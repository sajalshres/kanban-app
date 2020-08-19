
from django.urls import path, include
from .import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('board', views.BoardView)
router.register('todo', views.TodoView)
router.register('item', views.ItemView)

urlpatterns = [

    path('', include(router.urls)),
    path('create-user', views.createUser),
    path('delete-user', views.deleteUser)
]
