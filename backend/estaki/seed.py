import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'estaki.settings')
django.setup()

from park.models import Vehicle

vehicles = [
    {'plate': 'DQE2H66', 'owner_name': 'Pedro',   'vehicle_type': 'car'},
    {'plate': 'ABC1234', 'owner_name': 'Maria',    'vehicle_type': 'car'},
    {'plate': 'XYZ5678', 'owner_name': 'João',     'vehicle_type': 'moto'},
    {'plate': 'DEF9012', 'owner_name': 'Ana',      'vehicle_type': 'car'},
    {'plate': 'GHI3456', 'owner_name': 'Carlos',   'vehicle_type': 'moto'},
]

for v in vehicles:
    obj, created = Vehicle.objects.get_or_create(
        plate=v['plate'],
        defaults={'owner_name': v['owner_name'], 'vehicle_type': v['vehicle_type']}
    )
    status = 'CRIADO' if created else 'JA EXISTE'
    print(f"{status}: {obj.plate} - {obj.owner_name} ({obj.vehicle_type})")

print("\nSeed concluido!")
