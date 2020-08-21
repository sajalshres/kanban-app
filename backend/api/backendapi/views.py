from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Board, Todo, Item
from .serializers import BoardSerializer, ItemSerializer, TodoSerializer
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.decorators import api_view


class BoardView(viewsets.ModelViewSet):
    '''Class for CRUD operation for Boards.'''
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Board.objects.filter()
    serializer_class = BoardSerializer
    lookup_field = 'id'

    def create(self, request):
        '''
        Create new board and save it under logged in user.

        Arguement : request of type POST

        Returns :
           Failure -> Response object with "Error" : "could not create board" and 404 BAD REQUEST
           Success -> Response object with "new board": "new board created" and 201 CREATED
        '''
        try:
            userObj = User.objects.get(username=request.user)
            board = Board.objects.create(
                user=userObj, name=request.data['name'])

        except:
            return Response({"error": "board not created"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"board": board.name}, status=status.HTTP_201_CREATED)

    def list(self, request):
        '''Return list of all Boards its todos with its items available under logged in user'''
        queryset = Board.objects.filter(user=request.user)
        serializer = BoardSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, id=None):
        '''Return board its todos with its items with specific id.'''
        queryset = Board.objects.filter(user=request.user, id=id)
        if queryset.exists():
            serializer_class = BoardSerializer(queryset, many=True)
            return Response(serializer_class.data, status=status.HTTP_200_OK)
        return Response({"error": "board not found"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, id=None):
        '''Update board with specific id'''
        queryset = Board.objects.filter(user=request.user, id=id)
        if queryset.exists():
            serializer_class = BoardSerializer(queryset)
            return super().update(request, id)
        return Response({"error": "board not updated"}, status=status.HTTP_403_FORBIDDEN)

    def destroy(self, request, id=None):
        '''Delete board with specific id'''
        queryset = Board.objects.filter(user=request.user, id=id)
        if queryset.exists():
            serializer_class = BoardSerializer(queryset)
            return super().destroy(request, id)
        return Response({"error": "board not deleted"}, status=status.HTTP_403_FORBIDDEN)


class TodoView(viewsets.ModelViewSet):
    '''Class for CRUD operations for Todos.'''
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    lookup_field = 'id'

    def create(self, request):
        '''
        Create new todo linking it under certain board and save it under logged in user.

        Arguement : request of type POST

        Returns :
           Failure -> Response object with "Error" : "could not create todo" and 404 BAD REQUEST
           Success -> Response object with "new board": "new todo created" and 201 CREATED
        '''
        try:
            board = Board.objects.get(
                user=request.user, id=request.data['board'])
            todo = Todo.objects.create(board=board, name=request.data['name'])
            todo.save()
        except:
            print("Unexpected error:", sys.exc_info()[0])
            return Response({"error": "todo not created"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"success": "new todo created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        '''Return list of all Todos and its items available under logged in user'''
        board = Board.objects.filter(user=request.user)
        queryset = Todo.objects.filter(board__in=board)
        serializer = TodoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, id=None):
        '''Return specific Todos and its items  as per id if available under logged in user'''
        board = Board.objects.filter(user=request.user)
        queryset = Todo.objects.filter(board__in=board, id=id)
        if queryset.exists():
            serializer = TodoSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"Data": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, id=None):
        '''Update specific Todo as per id'''

        # Check if board id given exists and belongs to user
        board = Board.objects.filter(
            user=request.user, id=request.data['board'])
        if(board.exists()):
            board = Board.objects.filter(
                user=request.user)
            queryset = Todo.objects.filter(board__in=board, id=id)
            if queryset.exists():
                serializer_class = TodoSerializer(queryset)
                return super().update(request, id)
        return Response({"Data": "Could Not Update"}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, id=None):
        '''Delete specific Todo as per id'''
        board = Board.objects.filter(user=request.user)
        queryset = Todo.objects.filter(board__in=board, id=id)
        if(queryset.exists()):
            serializer_class = TodoSerializer(queryset)
            return super().destroy(request, id)
        return Response({"Error": "Could Not Delete"}, status=status.HTTP_404_NOT_FOUND)


class ItemView(viewsets.ModelViewSet):
    '''Class for CRUD operations for Items.'''
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    lookup_field = 'id'

    def create(self, request):
        '''
        Create new item linking it under todo , board and save it under logged in user.

        Arguement : request of type POST

        Returns :
           Failure -> Response object with "Error" : "could not create item" and 404 BAD REQUEST
           Success -> Response object with "new board": "new item created" and 201 CREATED
        '''
        try:

            board = Board.objects.filter(user=request.user)

            todo = Todo.objects.get(board__in=board, id=request.data['todo'])

            item = Item.objects.create(
                todo=todo, description=request.data['description'], completed=bool(request.data['completed']), name=request.data['name'])
            item.save()
        except Exception as e:
            print(e)
            return Response({"Error": "Could not create the Item"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"success": "new item created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        '''Get all the available  Item under all todos'''
        board = Board.objects.filter(user=request.user)
        todo = Todo.objects.filter(board__in=board)
        queryset = Item.objects.filter(todo__in=todo)
        serializer = ItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, id=None):
        '''Get the specific item as per id'''
        board = Board.objects.filter(user=request.user)
        todo = Todo.objects.filter(board__in=board)
        queryset = Item.objects.filter(todo__in=todo, id=id)
        if queryset.exists():
            serializer = ItemSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"Data": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, id=None):
        '''Update specific item as per id'''
        board = Board.objects.filter(user=request.user)
        todo = Todo.objects.filter(
            board__in=board, id=request.data['todo'])
        if todo.exists():
            todo = Todo.objects.filter(board__in=board)
            queryset = Item.objects.filter(todo__in=todo)
            if queryset.exists():
                serializer_class = ItemSerializer(queryset)
                return super().update(request, id)
        return Response({"Data": "Could Not Update"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None):
        '''Delete specific item as per id'''
        board = Board.objects.filter(user=request.user)
        todo = Todo.objects.filter(
            board__in=board, id=request.data['todo'])
        queryset = Item.objects.filter(todo__in=todo, id=id)
        if(queryset.exists()):
            serializer_class = ItemSerializer(queryset)
            return super().destroy(request, id)
        return Response({"Data": "Could Not Delete"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def createUser(request):

    try:
        username = request.data['username']
        email = request.data['email']
        password = request.data['password']
        user = User.objects.create_user(username, email, password)
        print(user.username)
        return Response({"user": user.username})
    except:
        return Response({"error": "couldnot create username"})
