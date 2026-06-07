from rest_framework import serializers
from .models import Vehicle, ParkingRecord, Usuario, ParkingConfig


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'


class ParkingRecordSerializer(serializers.ModelSerializer):
    vehicle_plate = serializers.CharField(source='vehicle.plate', read_only=True)
    owner_name = serializers.CharField(source='vehicle.owner_name', read_only=True)
    vehicle_type = serializers.CharField(source='vehicle.vehicle_type', read_only=True)
    duration_minutes = serializers.SerializerMethodField()

    class Meta:
        model = ParkingRecord
        fields = [
            'id', 'vehicle', 'vehicle_plate', 'owner_name', 'vehicle_type',
            'entry_time', 'exit_time', 'status',
            'confidence', 'raw_plate_detected', 'duration_minutes',
        ]

    def get_duration_minutes(self, obj):
        return obj.duration_minutes()


class PlateUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()
    owner_name = serializers.CharField(required=False, allow_blank=True)
    vehicle_type = serializers.ChoiceField(choices=['car', 'moto'], default='car')


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'matricula', 'telefone']


class ParkingConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingConfig
        fields = '__all__'