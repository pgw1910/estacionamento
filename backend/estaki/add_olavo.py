import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'estaki.settings')
django.setup()

from park.models import Vehicle

v, created = Vehicle.objects.get_or_create(
    plate='FTR5I05',
    defaults={'owner_name': 'Olavo', 'vehicle_type': 'car'}
)

print('CRIADO' if created else 'JA EXISTE', '-', v.plate, '-', v.owner_name, '-', v.vehicle_type)
