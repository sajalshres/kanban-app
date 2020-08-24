from django.db import models
from django.contrib.auth.models import User


class Board(models.Model):
    ''' Create table Board with name(type-character) and user(type-User object).'''
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='boards')
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Todo(models.Model):
    '''Create table Todo with name(type - character) and user (type-Board object).'''
    name = models.CharField(max_length=200)
    board = models.ForeignKey(
        Board, on_delete=models.CASCADE, related_name='todos')

    def __str__(self):
        return self.name


class Item(models.Model):
    '''Create table Item with name(character) description(character),completed(boolean) and todo(Todo object).'''
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    completed = models.BooleanField()
    todo = models.ForeignKey(
        Todo, on_delete=models.CASCADE, related_name='items')

    def __str__(self):
        return self.name
