from rest_framework import viewsets, status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import render

from .models import Vehicle, ParkingRecord
from .serializers import VehicleSerializer, ParkingRecordSerializer, PlateUploadSerializer
from .service.plate_recognizer import read_plate


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def register_entry(request):
    serializer = PlateUploadSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    image = serializer.validated_data['image']
    result = read_plate(image)

    if not result:
        return Response(
            {"error": "Não foi possível detectar a placa na imagem."},
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    plate = result['plate']
    vehicle, created = Vehicle.objects.get_or_create(plate=plate)

    open_record = ParkingRecord.objects.filter(vehicle=vehicle, status='in').first()
    if open_record:
        return Response(
            {"error": f"Veículo {plate} já está no estacionamento.", "record_id": open_record.id},
            status=status.HTTP_409_CONFLICT,
        )

    image.seek(0)
    record = ParkingRecord.objects.create(
        vehicle=vehicle,
        plate_image=image,
        raw_plate_detected=plate,
        confidence=result['confidence'],
        status='in',
    )

    return Response({
        "message": "Entrada registrada com sucesso.",
        "plate": plate,
        "confidence": result['confidence'],
        "vehicle_created": created,
        "record_id": record.id,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def register_exit(request, record_id):
    try:
        record = ParkingRecord.objects.get(id=record_id, status='in')
    except ParkingRecord.DoesNotExist:
        return Response(
            {"error": "Registro não encontrado ou veículo já saiu."},
            status=status.HTTP_404_NOT_FOUND,
        )

    record.status = 'out'
    record.exit_time = timezone.now()
    record.save()

    minutes = int((record.exit_time - record.entry_time).total_seconds() / 60)

    return Response({
        "message": "Saída registrada.",
        "plate": record.vehicle.plate,
        "entry_time": record.entry_time,
        "exit_time": record.exit_time,
        "duration_minutes": minutes,
    })


@api_view(['GET'])
def current_vehicles(request):
    records = ParkingRecord.objects.filter(status='in').select_related('vehicle')
    serializer = ParkingRecordSerializer(records, many=True)
    return Response(serializer.data)


def test_page(request):
    return render(request, 'park/test.html')

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Vehicle # ou ParkingRecord, dependendo do que quer deletar

@api_view(['DELETE'])
def delete_vehicle_custom(request, record_id):
    # 1. Tenta encontrar o registro no banco. Se não achar, já retorna erro 404.
    vehicle = get_object_or_404(Vehicle, id=record_id)
    
    # 2. Deleta o registro para sempre
    vehicle.delete()
    
    # 3. Retorna uma resposta de sucesso. 
    # O status 204 (No Content) é o padrão oficial de APIs para "Deletado com sucesso"
    return Response(status=status.HTTP_204_NO_CONTENT)

    # DICA: Se o seu frontend precisa de uma mensagem JSON de confirmação,
    # você pode trocar a linha de cima por esta abaixo:
    # return Response({"message": "Registro excluído com sucesso!"}, status=status.HTTP_200_OK)