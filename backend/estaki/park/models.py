from django.db import models


class Vehicle(models.Model):
    plate = models.CharField(max_length=20, unique=True)
    owner_name = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.plate


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

    def __str__(self):
        return f"{self.vehicle.plate} — {self.status}"
