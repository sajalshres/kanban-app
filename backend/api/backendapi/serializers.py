from rest_framework import serializers
from .models import Board, Todo, Item


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        # fields = ('id', 'name', 'description', 'completed')
        fields = '__all__'


class TodoSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Todo
        fields = ('id', 'name', 'items', 'board')


class BoardSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ('id', 'name', 'todos')
