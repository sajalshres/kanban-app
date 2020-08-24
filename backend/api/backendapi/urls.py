
from django.urls import path, include
from .import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('board', views.BoardView)
router.register('todo', views.TodoView)
router.register('item', views.ItemView)
router.register('user', views.UserView)
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth', include('rest_framework.urls'))
]
