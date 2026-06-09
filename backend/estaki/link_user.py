import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'estaki.settings')
django.setup()

from django.contrib.auth.models import User
from park.models import Usuario

# Lista todos os Users existentes
users = User.objects.all()
print("Users existentes:")
for u in users:
    has_profile = hasattr(u, 'usuario')
    print(f"  id={u.id} username={u.username} email={u.email} | tem perfil: {has_profile}")

# Para cada user sem perfil, cria um Usuario vinculado
for u in users:
    if not hasattr(u, 'usuario'):
        matricula = f"USR{u.id:04d}"
        usuario = Usuario.objects.create(
            user=u,
            nome=f"{u.first_name} {u.last_name}".strip() or u.username,
            matricula=matricula,
            telefone='',
        )
        print(f"Perfil criado para {u.username}: matricula={matricula}")
    else:
        # Atualiza o vínculo se já existe mas user está vazio
        p = u.usuario
        if not p.user:
            p.user = u
            p.save()
            print(f"Perfil vinculado para {u.username}")
        else:
            print(f"{u.username} já tem perfil vinculado: {p.nome}")

print("\nConcluído!")
