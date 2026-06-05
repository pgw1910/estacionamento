from rest_framework import serializers
from .models import Vehicle, ParkingRecord


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'


class ParkingRecordSerializer(serializers.ModelSerializer):
    vehicle_plate = serializers.CharField(source='vehicle.plate', read_only=True)

    class Meta:
        model = ParkingRecord
        fields = [
            'id', 'vehicle', 'vehicle_plate',
            'entry_time', 'exit_time',
            'status', 'confidence', 'raw_plate_detected',
        ]


class PlateUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()