from django.contrib import admin
from .models import Vehicle, ParkingRecord, Usuario


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ['plate', 'owner_name', 'created_at']
    search_fields = ['plate', 'owner_name']


@admin.register(ParkingRecord)
class ParkingRecordAdmin(admin.ModelAdmin):
    list_display = ['vehicle', 'status', 'entry_time', 'exit_time', 'confidence', 'raw_plate_detected']
    list_filter = ['status']
    readonly_fields = ['entry_time', 'confidence', 'raw_plate_detected']

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['nome', 'matricula', 'telefone']
    search_fields = ['nome', 'matricula']