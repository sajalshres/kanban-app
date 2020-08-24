from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.contrib.auth.models import User
from django.core.exceptions import FieldError, ValidationError
from django.http import HttpResponse
from .models import Board, Todo, Item
from .validator import BoardValidator, TodoValidator, ItemValidator, UserValidator
from .serializers import BoardSerializer, ItemSerializer, TodoSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view


class BoardView(viewsets.ModelViewSet):
    '''Class for CRUD operation for Boards.'''
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Board.objects.filter()
    serializer_class = BoardSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return Board.objects.filter(user=self.request.user)

    def create(self, request):
        '''Create new board and save it under logged in user.'''
        userObj = get_object_or_404(User, username=request.user)
        try:
            if BoardValidator(request.data).is_valid():
                name = request.data['name']
                boardObj = Board.objects.create(user=userObj, name=name)
                serialized = BoardSerializer(boardObj)
                return Response(serialized.data, status=status.HTTP_201_CREATED)
            else:
                raise ValidationError("please provide valid board name")
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TodoView(viewsets.ModelViewSet):
    '''Class for CRUD operations for Todos.'''
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    lookup_field = 'id'

    def get_queryset(self):
        boardObj = Board.objects.filter(user=self.request.user)
        return Todo.objects.filter(board__in=boardObj)

    def create(self, request):
        '''Create new todo linking it under certain board and save it under logged in user.'''
        userObj = get_object_or_404(User, username=request.user)
        try:
            if TodoValidator(request.data).is_valid():
                boardid = request.data['board']
                name = request.data['name']
                boardObj = get_object_or_404(Board, user=userObj, id=boardid)
                todo = Todo.objects.create(board=boardObj, name=name)
                serialized = TodoSerializer(todo)
                return Response(serialized.data, status=status.HTTP_201_CREATED)
            else:
                raise ValidationError(
                    "please provide valid todo name and board id")
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, id=None):
        '''Update specific Todo as per id'''
        try:
            if TodoValidator(request.data).is_valid():
                boardid = request.data['board']
                name = request.data['name']
                # Below line checks if board id to which todo is to be kept after update, exists and belongs to user
                boardObj = get_object_or_404(
                    Board, user=request.user, id=boardid)
                boardObj = get_list_or_404(Board, user=request.user)
                todoObj = get_object_or_404(Todo, board__in=boardObj, id=id)
                todoObj.name = name
                todoObj.save()
                serializer = TodoSerializer(todoObj)
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else:
                raise ValidationError(
                    "please provide valid todo name and board id")
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ItemView(viewsets.ModelViewSet):
    '''Class for CRUD operations for Items.'''
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    lookup_field = 'id'

    def get_queryset(self):
        boardObj = Board.objects.filter(user=self.request.user)
        todoObj = Todo.objects.filter(board__in=boardObj)
        return Item.objects.filter(todo__in=todoObj)

    def create(self, request):
        '''Create new item linking it under todo , board and save it under logged in user.'''
        try:
            if ItemValidator(request.data).is_valid():
                description = request.data['description']
                completed = request.data['completed']
                name = request.data['name']
                boardObj = get_list_or_404(Board, user=request.user)
                todo = get_object_or_404(
                    Todo, board__in=boardObj, id=request.data['todo'])
                item = Item.objects.create(
                    todo=todo, description=description, completed=completed, name=name)
                serializer = ItemSerializer(item)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                raise ValidationError(
                    "please provide valid item name,description,completed and todo id")
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, id=None):
        '''Update specific item as per id'''

        try:
            if ItemValidator(request.data).is_valid():
                todoid = request.data['todo']
                itemname = request.data['name']
                description = request.data['description']
                completed = request.data['completed']
                # Check if todo with which item to be linked after update is authenticated
                boardObj = get_list_or_404(Board, user=request.user)
                todoObj = get_object_or_404(
                    Todo, board__in=boardObj, id=todoid)
                todoObj = get_list_or_404(Todo, board__in=boardObj)
                itemObj = get_object_or_404(Item, todo__in=todoObj, id=id)
                itemObj.name = itemname
                itemObj.description = description
                itemObj.completed = completed
                itemObj.save()
                serializer = ItemSerializer(itemObj)
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else:
                raise ValidationError(
                    "please provide valid item name,description,completed and todo id")
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserView(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def create(self, request):
        try:

            if UserValidator(request.data).is_valid():
                username = request.data['username']
                password = request.data['password']
                if User.objects.filter(username=username).exists():
                    raise ValidationError("username already exist")
                user = User.objects.create_user(
                    username=username, password=password)
                serialized = UserSerializer(user)
                return Response(serialized.data, status=status.HTTP_201_CREATED)
            else:
                raise ValidationError(
                    "please provide valid username and password of min length 8(not all numeric)")

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
