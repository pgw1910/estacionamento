# Recriado manualmente — migration inicial do app park

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Vehicle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plate', models.CharField(max_length=20, unique=True)),
                ('owner_name', models.CharField(blank=True, max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='ParkingRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entry_time', models.DateTimeField(auto_now_add=True)),
                ('exit_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(
                    choices=[('in', 'Dentro'), ('out', 'Saiu')],
                    default='in',
                    max_length=3,
                )),
                ('plate_image', models.ImageField(blank=True, null=True, upload_to='plates/')),
                ('raw_plate_detected', models.CharField(blank=True, max_length=20)),
                ('confidence', models.FloatField(default=0.0)),
                ('vehicle', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='records',
                    to='park.vehicle',
                )),
            ],
        ),
    ]
