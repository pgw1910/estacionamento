import requests
from django.conf import settings

PLATE_RECOGNIZER_URL = "https://api.platerecognizer.com/v1/plate-reader/"


def read_plate(image_file):
    headers = {"Authorization": f"Token {settings.PLATE_RECOGNIZER_TOKEN}"}
    
    # 1. Rebobina o "cursor" de leitura do arquivo de volta para o início (0)
    image_file.seek(0)
    
    # 2. Passa o arquivo no formato que o 'requests' entende perfeitamente:
    # (nome_do_arquivo, objeto_do_arquivo, content_type)
    files = {
        "upload": (image_file.name, image_file, image_file.content_type)
    }
    
    response = requests.post(
        PLATE_RECOGNIZER_URL,
        files=files,
        headers=headers,
    )
    
    if response.status_code != 201:
        # Dica: adicione um print aqui para ajudar a debugar se der erro futuramente
        print("Erro na API externa:", response.text) 
        return None

    results = response.json().get("results", [])
    if not results:
        return None

    best = results[0]
    return {
        "plate": best["plate"].upper(),
        "confidence": best["score"],
    }