from django.test import TestCase
from ..models import Board, Todo, Item
from django.contrib.auth.models import User
from ..validator import BoardValidator, TodoValidator, UserValidator, ItemValidator


class ModelTest(TestCase):

    def setUp(self):
        user = User.objects.create(username='suraj1', password='userpass')
        self.assertEqual(user.username, 'suraj1')
        board = Board.objects.create(name='boarder', user=user)
        self.assertEqual(board.name, 'boarder')
        self.assertEqual(str(board), 'boarder')
        todo = Todo.objects.create(name='todo', board=board)
        self.assertEqual(todo.name, 'todo')
        self.assertEqual(str(todo), 'todo')
        item = Item.objects.create(
            name='item', todo=todo, completed=False, description='my GOD')
        self.assertEqual(item.name, 'item')
        self.assertEqual(str(item), 'item')

    def test_validator(self):

        self.assertFalse(BoardValidator().is_valid())
        self.assertFalse(BoardValidator({'name': ''}).is_valid())
        self.assertTrue(BoardValidator({'name': 'asdasdasd'}).is_valid())
        self.assertTrue(TodoValidator(
            {'name': 'asdasdasd', 'board': 1}).is_valid())
        self.assertFalse(TodoValidator({'name': 'asdasdasd'}).is_valid())
        self.assertTrue(TodoValidator(
            {'name': 'asdasdasd', 'board': 1}).is_valid())
        self.assertFalse(TodoValidator(
            {'name': '12312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312312', 'board': 1}).is_valid())
        data = {
            'todo': 1,
            'completed': False,
            'name': 'Item',
            'description': 'myDesc'
        }
        data1 = {
            'todo': 1,
            'completed': False,
            'name': 'Item',
        }
        self.assertTrue(ItemValidator(data).is_valid())
        self.assertFalse(ItemValidator(data1).is_valid())
