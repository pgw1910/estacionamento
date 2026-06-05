from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'vehicles', views.VehicleViewSet)
router.register(r'usuarios', views.UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('entry/', views.register_entry, name='register-entry'),
    path('exit/<int:record_id>/', views.register_exit, name='register-exit'),
    path('current/', views.current_vehicles, name='current-vehicles'),
    path('test/', views.test_page, name='test-page'),
    path('delete-vehicle/<int:record_id>/', views.delete_vehicle_custom, name='delete-vehicle')
]