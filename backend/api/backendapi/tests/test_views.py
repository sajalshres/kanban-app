import json
import re

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from backendapi.models import Board, Item, Todo
from backendapi.views import BoardView, ItemView, TodoView, UserView

from django.test import Client


class UserTests(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.userlist = reverse('user-list')
        cls.userdetail1 = reverse('user-detail', kwargs={'id': 1})
        cls.userdetail2 = reverse('user-detail', kwargs={'id': 2})

    def test_create_user(self):
        ''' Check if user can be made '''
        data = {'username': 'suraj1', 'password': 'userpass1'}
        response = self.client.post(self.userlist, data)
        self.assertEqual(response.data['username'], 'suraj1')
        self.assertEqual(response.status_code, 201)

        data1 = {'username': 'suraj2', 'password': 'userpass2'}
        response = self.client.post(self.userlist, data1)
        self.assertEqual(response.data['username'], 'suraj2')
        self.assertEqual(response.status_code, 201)

        errordata = {'username': 's', 'password': 'p'}
        response = self.client.post(self.userlist, errordata)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data['error'], 'please provide valid username and password of min length 8(not all numeric)')

        data1 = {'username': 'suraj2', 'password': 'userpass2'}
        response = self.client.post(self.userlist, data1)
        self.assertEqual(response.data['error'], 'username already exists')
        self.assertEqual(response.status_code, 400)

    def test_get_user(self):
        ''' Check what you can retrieve as non-logged and logged-in user'''
        # Non logged in user gets empty response on [/user/]
        response = self.client.get(self.userlist)
        self.assertFalse(response.data)  # No data means false

        # test what a logged in user can get from [/user/]
        self.test_create_user()
        myclient = APIClient()
        myclient.login(username='suraj1', password='userpass1')
        response = myclient.get(self.userlist)

        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'suraj1')

        # test what a logged in user can get from [/user/1]
        url1 = reverse('user-detail', kwargs={'id': 1})
        response = myclient.get(url1)

        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['username'], 'suraj1')

        # test if  logged in user can get details of another user [/user/1]
        myclient2 = APIClient()
        myclient2.login(username='suraj2', password='userpass2')
        response = myclient2.get(url1)
        self.assertEqual(response.status_code, 404)

    def test_delete_user(self):

        self.test_create_user()
        # Cannot delete other user account
        myclient = APIClient()
        myclient.login(username='suraj2', password='userpass2')
        response = myclient.delete(self.userdetail1)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['detail'], 'Not found.')

        # Can delete own user account/data
        myclient = APIClient()
        myclient.login(username='suraj1', password='userpass1')
        response = myclient.delete(self.userdetail1)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(response.data)

        # Cannot delete other user account

    def test_update_user(self):
        self.test_create_user()
        # Cannot update others user account/data
        myclient = APIClient()
        myclient.login(username='suraj2', password='userpass2')
        response = myclient.put(
            self.userdetail1, {'username': 'suraj-updated'})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['detail'], 'Not found.')

        # can update own user account/data
        myclient = APIClient()
        myclient.login(username='suraj1', password='userpass1')
        response = myclient.put(
            self.userdetail1, {'username': 'suraj-updated'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'suraj-updated')


class BoardTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.boardlist = reverse('board-list')
        cls.boarddetail1 = reverse('board-detail', kwargs={'id': 1})
        cls.boarddetail2 = reverse('board-detail', kwargs={'id': 2})
        userlist = reverse('user-list')
        client = APIClient()
        client.post(userlist, {'username': 'suraj1', 'password': 'userpass1'})
        client.post(userlist, {'username': 'suraj2', 'password': 'userpass2'})
        cls.client1 = APIClient()
        cls.client2 = APIClient()
        cls.client1.login(username='suraj1', password='userpass1')
        cls.client2.login(username='suraj2', password='userpass2')

    def setUp(self):
        # create board
        response = self.client1.post(
            self.boardlist, {'name': 'suraj1-board1'})
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['name'], 'suraj1-board1')
        response = self.client1.post(
            self.boardlist, {'name': ''})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data['error'], 'please provide valid board name')

        pass

    def test_retrieve_board(self):
        # check if same board name can be created
        response = self.client1.post(
            self.boardlist, {'name': 'suraj1-board1'})
        self.assertEqual(response.data['error'], 'Board already exists')
        self.assertEqual(response.status_code, 400)
        # get list of board from [board]
        response = self.client1.get(self.boarddetail1)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['name'], 'suraj1-board1')

        # get one board from[board/1]
        response = self.client1.get(self.boarddetail1)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], 1)

        # cannot get other user board from [board/1]
        response = self.client2.get(self.boarddetail1)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['detail'], 'Not found.')

        pass

    def test_update_board(self):

        # cannot update others board
        response = self.client2.put(
            self.boarddetail1, {'name': 'suraj1-board1'})
        self.assertEqual(response.status_code, 400)
        # self.assertEqual(response.data['detail'], 'Not found.')

        # can update own board
        response = self.client1.put(
            self.boarddetail1, {'name': 'suraj1-board1-updated'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], 'suraj1-board1-updated')

    def test_delete_board(self):

        # cannot delete others board
        response = self.client2.delete(self.boarddetail1)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['detail'], 'Not found.')

        # can delete own board
        response = self.client1.delete(self.boarddetail1)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(response.data)


class TodoTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.todolist = reverse('todo-list')
        cls.boardlist = reverse('board-list')
        cls.tododetail1 = reverse('todo-detail', kwargs={'id': 1})
        cls.tododetail2 = reverse('todo-detail', kwargs={'id': 2})
        userlist = reverse('user-list')
        client = APIClient()
        client.post(userlist, {'username': 'suraj1', 'password': 'userpass1'})
        client.post(userlist, {'username': 'suraj2', 'password': 'userpass2'})
        cls.client1 = APIClient()
        cls.client2 = APIClient()
        cls.client1.login(username='suraj1', password='userpass1')
        cls.client2.login(username='suraj2', password='userpass2')
        cls.client1.post(cls.boardlist, {'name': 'suraj1-board1'})
        cls.client2.post(cls.boardlist, {'name': 'suraj2-board1'})

    def setUp(self):
        response = self.client1.post(
            self.todolist, {'name': 'suraj1-todo1', 'board': 1})
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], 'suraj1-todo1')
        # invalid post request
        response = self.client1.post(
            self.todolist, {'board': 1})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'],
                         'please provide valid todo name and board id')

    def test_create_todo(self):
        # cannot create same todo again
        response = self.client1.post(
            self.todolist, {'name': 'suraj1-todo1', 'board': 1})
        self.assertEqual(response.data['error'], 'Todo already exists')
        self.assertEqual(response.status_code, 400)

        # cannot create todo on others board
        response = self.client1.post(
            self.todolist, {'name': 'suraj1-todo1', 'board': 2})
        self.assertEqual(response.data['error'],
                         'No Board matches the given query.')
        self.assertEqual(response.status_code, 400)

    def test_get_todo(self):
        # get todo from [/todo/]
        response = self.client1.get(self.todolist)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['id'], 1)

        # get todo from [/todo/1]
        response = self.client1.get(self.tododetail1)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['name'], 'suraj1-todo1')

        # cannot get todo of other users
        response = self.client2.get(self.tododetail1)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['detail'], 'Not found.')

    def test_update_todo(self):
        # cannot update others todo
        response = self.client2.put(
            self.tododetail1, {'name': 'suraj1-todo1', 'board': 1})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('No Board matches the given query.',
                        response.data['error'])

        # invalid update
        response = self.client2.put(
            self.tododetail1, {'name': 'suraj1-todo1'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'],
                         'please provide valid todo name and board id')

        # can update own todo
        response = self.client1.put(
            self.tododetail1, {'name': 'suraj1-todo1-updated', 'board': 1})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'suraj1-todo1-updated')

        # cannot update and make todo that matches already existing todo
        response = self.client1.put(
            self.tododetail1, {'name': 'suraj1-todo1-updated', 'board': 1})
        self.assertEqual(response.data['error'], 'Todo already exists')
        self.assertEqual(response.status_code, 400)

    def test_delete_todo(self):
        # cannot delete others todo
        response = self.client2.delete(self.tododetail1)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['detail'], 'Not found.')

        # can delete own todo
        response = self.client1.delete(self.tododetail1)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(response.data)


class TestItem(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.todolist = reverse('todo-list')
        cls.boardlist = reverse('board-list')
        cls.itemlist = reverse('item-list')
        cls.itemdetail1 = reverse('item-detail', kwargs={'id': 1})
        cls.itemdetail2 = reverse('item-detail', kwargs={'id': 2})
        userlist = reverse('user-list')
        client = APIClient()
        client.post(userlist, {'username': 'suraj1', 'password': 'userpass1'})
        client.post(userlist, {'username': 'suraj2', 'password': 'userpass2'})
        cls.client1 = APIClient()
        cls.client2 = APIClient()
        cls.client1.login(username='suraj1', password='userpass1')
        cls.client2.login(username='suraj2', password='userpass2')
        response = cls.client1.post(cls.boardlist, {'name': 'suraj1-board1'})
        cls.client2.post(cls.boardlist, {'name': 'suraj2-board1'})
        cls.client1.post(
            cls.todolist, {'name': 'suraj1-todo1', 'board': 1})

        cls.client2.post(
            cls.todolist, {'name': 'suraj2-todo1', 'board': 2})

    def setUp(self):
        response = self.client1.post(
            self.itemlist, {'name': 'suraj1-todo1-item1', 'todo': 1, 'completed': False, 'description': 'my_desc'})

        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], 'suraj1-todo1-item1')
        response = self.client2.post(
            self.itemlist, {'name': 'suraj2-todo1-item1', 'todo': 2, 'completed': False, 'description': 'my_desc'})

        self.assertEqual(response.data['id'], 2)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], 'suraj2-todo1-item1')

    def test_create_item(self):
        # cannot create same todo
        response = self.client1.post(
            self.itemlist, {'name': 'suraj1-todo1-item1', 'todo': 1, 'completed': False, 'description': 'my_desc'})
        self.assertEqual(response.data['error'], 'Item already exists')
        self.assertEqual(response.status_code, 400)

        # invalid item post request
        response = self.client1.post(
            self.itemlist, {'todo': 1, 'completed': False, 'description': 'my_desc'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data['error'], 'please provide valid item name,description,completed and todo id')

        # cannot create on others todo
        response = self.client2.post(
            self.itemlist, {'name': 'suraj2-todo1-item1', 'todo': 1, 'completed': False, 'description': 'my_desc'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual('No Todo matches the given query.',
                         response.data['error'])

    def test_get_item(self):
        # get items from [/item/]
        response = self.client1.get(self.itemlist)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], 1)

        # get items from [/item/1]
        response = self.client1.get(self.itemdetail1)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['name'], 'suraj1-todo1-item1')

        # cannot get item of other users
        response = self.client2.get(self.itemdetail1)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['detail'], 'Not found.')

    def test_update_item(self):
        # cannot update others item
        response = self.client2.put(
            self.itemdetail1, {'name': 'suraj1-todo1-item1-updated', 'todo': 1, 'completed': False, 'description': 'my_desc'})
        self.assertEqual(response.status_code, 400)
        self.assertTrue('No Todo matches the given query.',
                        response.data['error'])

        # invalid post request
        response = self.client1.put(
            self.itemdetail1, {'todo': 1, 'description': 'my_desc'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data['error'], 'please provide valid item name,description,completed and todo id')

        # can update own todo
        response = self.client1.put(
            self.itemdetail1, {'name': 'suraj1-todo1-item1-updated', 'todo': 1, 'completed': False, 'description': 'my_desc'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'suraj1-todo1-item1-updated')

        # cannot update and make same as any existing item
        response = self.client1.put(
            self.itemdetail1, {'name': 'suraj1-todo1-item1-updated', 'todo': 1, 'completed': False, 'description': 'my_desc'})
        self.assertEqual(response.data['error'], 'Item already exists')
        self.assertEqual(response.status_code, 400)

    def test_delete_item(self):
        # cannot delete others item
        response = self.client2.delete(self.itemdetail1)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['detail'], 'Not found.')

        # can delete own item
        response = self.client1.delete(self.itemdetail1)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(response.data)
