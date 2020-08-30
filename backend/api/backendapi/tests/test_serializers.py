from ..serializers import TodoSerializer, UserSerializer, BoardSerializer, ItemSerializer, UsergetSerializer
from rest_framework.test import APITestCase, APIRequestFactory
from django.core import serializers
from ..models import Board, Item, Todo
from django.contrib.auth.models import User


class TestSerializers(APITestCase):

    def test_user_serializer(self):
        user = User.objects.create(username='suraj123', password='userpass')
        serializer = UsergetSerializer(instance=user)
        data = serializer.data
        self.assertCountEqual(data.keys(), ['id', 'username'])
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['username'], 'suraj123')

    def test_board_serializer(self):
        user = User.objects.create(username='suraj123', password='userpass')
        board = Board.objects.create(name='board', user=user)
        serializer = BoardSerializer(instance=board)
        data = serializer.data
        self.assertCountEqual(data.keys(), ['id', 'name', 'todos'])
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['name'], 'board')
        self.assertFalse(data['todos'])

    def test_todo_serializer(self):
        user = User.objects.create(username='suraj123', password='userpass')
        board = Board.objects.create(name='board', user=user)
        todo = Todo.objects.create(name='todo', board=board)
        serializer = TodoSerializer(instance=todo)
        data = serializer.data
        self.assertCountEqual(data.keys(), ['id', 'name', 'items', 'board'])
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['name'], 'todo')
        self.assertEqual(data['board'], 1)
        self.assertFalse(data['items'])

    def test_item_serializer(self):
        user = User.objects.create(username='suraj123', password='userpass')
        board = Board.objects.create(name='board', user=user)
        todo = Todo.objects.create(name='todo', board=board)
        item = Item.objects.create(
            name='item', todo=todo, description='my_desc', completed=False)
        serializer = ItemSerializer(instance=item)
        data = serializer.data
        self.assertCountEqual(
            data.keys(), ['id', 'name', 'todo', 'description', 'completed'])
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['name'], 'item')
        self.assertEqual(data['todo'], 1)
        self.assertEqual(data['description'], 'my_desc')
        self.assertFalse(data['completed'])
