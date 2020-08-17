from django.shortcuts import render
from django.http import HttpResponse
from .models import Board, Todo, Item
from .serializers import BoardSerializer, ItemSerializer, TodoSerializer
from rest_framework.response import Response
from rest_framework import viewsets
# Create your views here.

# super user = Vagrant /userpass


class BoardView(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer


class TodoView(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer


class ItemView(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
