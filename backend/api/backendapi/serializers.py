from rest_framework import serializers
from .models import Board, Todo, Item
from django.contrib.auth.models import User


class ItemSerializer(serializers.ModelSerializer):
    '''Serialize item model.'''

    class Meta:
        model = Item
        fields = '__all__'


class TodoSerializer(serializers.ModelSerializer):
    '''Serialize todo model with items as next depth level.'''
    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Todo
        fields = ('id', 'name', 'items', 'board')


class BoardSerializer(serializers.ModelSerializer):
    '''Serializer board model with todo as next depth level'''
    todos = TodoSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ('id', 'name', 'todos')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')
