from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'vehicles', views.VehicleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('entry/', views.register_entry, name='register-entry'),
    path('exit/<int:record_id>/', views.register_exit, name='register-exit'),
    path('current/', views.current_vehicles, name='current-vehicles'),
]