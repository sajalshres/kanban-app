from django.db import models

# Create your models here.


class Board(models.Model):
    name = models.CharField(max_length=500)

    def __str__(self):
        return self.name


class Todo(models.Model):
    name = models.CharField(max_length=1000)
    board = models.ForeignKey(
        Board, on_delete=models.CASCADE, related_name='todos')

    def __str__(self):
        return self.name


class Item(models.Model):
    name = models.CharField(max_length=500)
    description = models.CharField(max_length=500)
    completed = models.BooleanField()
    todo = models.ForeignKey(
        Todo, on_delete=models.CASCADE, related_name='items')

    def __str__(self):
        return self.name
