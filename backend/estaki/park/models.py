from django.db import models


class ParkingConfig(models.Model):
    max_vehicles = models.IntegerField(default=50)
    name = models.CharField(max_length=100, default='Meu Estacionamento')

    class Meta:
        verbose_name = 'Configuração'

    def __str__(self):
        return self.name


class Vehicle(models.Model):
    VEHICLE_TYPES = [
        ('car', 'Carro'),
        ('moto', 'Moto'),
    ]

    plate = models.CharField(max_length=20, unique=True)
    owner_name = models.CharField(max_length=100, blank=True)
    vehicle_type = models.CharField(max_length=10, choices=VEHICLE_TYPES, default='car')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.plate} - {self.owner_name}"


class ParkingRecord(models.Model):
    STATUS_CHOICES = [
        ('in', 'Dentro'),
        ('out', 'Saiu'),
    ]

    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, related_name='records'
    )
    entry_time = models.DateTimeField(auto_now_add=True)
    exit_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=3, choices=STATUS_CHOICES, default='in')
    plate_image = models.ImageField(upload_to='plates/', null=True, blank=True)
    raw_plate_detected = models.CharField(max_length=20, blank=True)
    confidence = models.FloatField(default=0.0)

    def duration_minutes(self):
        if self.exit_time:
            return int((self.exit_time - self.entry_time).total_seconds() / 60)
        return None

    def __str__(self):
        return f"{self.vehicle.plate} — {self.status}"


class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    matricula = models.CharField(max_length=10, unique=True)
    telefone = models.CharField(max_length=11)

    def __str__(self):
        return f"{self.nome} — {self.matricula}"