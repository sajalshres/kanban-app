from rest_framework import serializers
from .models import Board, Todo, Item
from django.contrib.auth.models import User


class BoardPKField(serializers.PrimaryKeyRelatedField):
    '''
    Makes Sure only the user specific board are shown in the drop down Choice Field.
    '''

    def get_queryset(self):
        print('hereeeeeeeeeeeeeeeeeeeeeeeeee')
        print(self.context)
        user = self.context['request'].user
        queryset = Board.objects.filter(user=user)
        return queryset


class TodoPKField(serializers.PrimaryKeyRelatedField):
    '''Makes sure only the user specific todos are shown in the drop down choice Field.'''

    def get_queryset(self):

        user = self.context['request'].user
        board = Board.objects.filter(user=user)
        queryset = Todo.objects.filter(board__in=board)
        return queryset


class ItemSerializer(serializers.ModelSerializer):
    '''Serialize item model with id, name, description, completed and todo to which it belongs'''
    todo = TodoPKField()

    class Meta:
        model = Item
        fields = '__all__'


class TodoSerializer(serializers.ModelSerializer):
    '''Serialize todo model with id, name, items it contains and board to which it belongs.'''
    items = ItemSerializer(many=True, read_only=True)
    board = BoardPKField()

    class Meta:
        model = Todo
        fields = ('id', 'name', 'items', 'board')


class BoardSerializer(serializers.ModelSerializer):
    '''Serializer board model with id and name with its todos '''
    todos = TodoSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ('id', 'name', 'todos')


class UsergetSerializer(serializers.ModelSerializer):
    '''Serializer to get the username and id of logged in user without password.'''
    class Meta:
        model = User
        fields = ('id', 'username')


class UserSerializer(serializers.ModelSerializer):
    '''Serializer to get the username and id of logged in user with password as required for making new users.'''
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
