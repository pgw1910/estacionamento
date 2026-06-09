from rest_framework import viewsets, status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import render, get_object_or_404
from django.db.models import Q

from .models import Vehicle, ParkingRecord, Usuario, ParkingConfig
from .serializers import (
    VehicleSerializer, ParkingRecordSerializer,
    PlateUploadSerializer, UsuarioSerializer, ParkingConfigSerializer
)
from .service.plate_recognizer import read_plate


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class ParkingConfigViewSet(viewsets.ModelViewSet):
    queryset = ParkingConfig.objects.all()
    serializer_class = ParkingConfigSerializer


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def register_entry(request):
    serializer = PlateUploadSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    image = serializer.validated_data['image']
    owner_name = serializer.validated_data.get('owner_name', '')
    vehicle_type = serializer.validated_data.get('vehicle_type', 'car')

    # Verifica limite máximo
    config = ParkingConfig.objects.first()
    if config:
        current_count = ParkingRecord.objects.filter(status='in').count()
        if current_count >= config.max_vehicles:
            return Response(
                {"error": f"Estacionamento lotado! Limite de {config.max_vehicles} vagas atingido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    result = read_plate(image)
    if not result:
        return Response(
            {"error": "Não foi possível detectar a placa na imagem."},
            status=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    plate = result['plate']

    # Apenas veículos já cadastrados podem entrar
    try:
        vehicle = Vehicle.objects.get(plate=plate)
    except Vehicle.DoesNotExist:
        return Response(
            {
                "error": f"Veículo com placa '{plate}' não está cadastrado no sistema.",
                "plate": plate,
                "confidence": result['confidence'],
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    created = False

    # NÃO sobrescreve o vehicle_type — usa sempre o cadastrado no banco/admin

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
        "owner_name": vehicle.owner_name,
        "vehicle_type": vehicle.vehicle_type,
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

    return Response({
        "message": "Saída registrada.",
        "plate": record.vehicle.plate,
        "owner_name": record.vehicle.owner_name,
        "vehicle_type": record.vehicle.vehicle_type,
        "entry_time": record.entry_time,
        "exit_time": record.exit_time,
        "duration_minutes": record.duration_minutes(),
    })


@api_view(['GET'])
def current_vehicles(request):
    records = ParkingRecord.objects.filter(status='in').select_related('vehicle')
    serializer = ParkingRecordSerializer(records, many=True)
    return Response({
        "total": records.count(),
        "vehicles": serializer.data
    })


@api_view(['GET'])
def history(request):
    records = ParkingRecord.objects.select_related('vehicle').order_by('-entry_time')

    plate = request.query_params.get('plate')
    date = request.query_params.get('date')
    start = request.query_params.get('start')
    end = request.query_params.get('end')
    search = request.query_params.get('search')

    if plate:
        records = records.filter(vehicle__plate__icontains=plate)
    if date:
        records = records.filter(entry_time__date=date)
    if start:
        records = records.filter(entry_time__date__gte=start)
    if end:
        records = records.filter(entry_time__date__lte=end)
    if search:
        records = records.filter(
            Q(vehicle__plate__icontains=search) |
            Q(vehicle__owner_name__icontains=search)
        )

    serializer = ParkingRecordSerializer(records, many=True)
    return Response({
        "total": records.count(),
        "records": serializer.data
    })


@api_view(['GET'])
def parking_status(request):
    config = ParkingConfig.objects.first()
    current = ParkingRecord.objects.filter(status='in').count()
    max_v = config.max_vehicles if config else None

    return Response({
        "current_vehicles": current,
        "max_vehicles": max_v,
        "available_spots": (max_v - current) if max_v else None,
        "is_full": (current >= max_v) if max_v else False,
    })


@api_view(['GET'])
def me(request):
    user = request.user
    telefone = ''
    matricula = ''
    nome = f"{user.first_name} {user.last_name}".strip() or user.username

    try:
        perfil = user.usuario
        telefone = perfil.telefone or ''
        matricula = perfil.matricula or ''
        if perfil.nome:
            nome = perfil.nome
    except Exception:
        pass

    return Response({
        'username': user.username,
        'full_name': nome,
        'email': user.email,
        'telefone': telefone,
        'matricula': matricula,
    })


@api_view(['DELETE'])
def delete_vehicle_custom(request, record_id):
    vehicle = get_object_or_404(Vehicle, id=record_id)
    vehicle.delete()
    return Response({"message": "Veículo excluído com sucesso."}, status=status.HTTP_200_OK)


def test_page(request):
    return render(request, 'park/test.html')