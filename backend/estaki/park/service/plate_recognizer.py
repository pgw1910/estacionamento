import requests
from django.conf import settings

PLATE_RECOGNIZER_URL = "https://api.platerecognizer.com/v1/plate-reader/"


def read_plate(image_file):
    headers = {"Authorization": f"Token {settings.PLATE_RECOGNIZER_TOKEN}"}

    response = requests.post(
        PLATE_RECOGNIZER_URL,
        files={"upload": image_file},
        headers=headers,
    )

    if response.status_code != 201:
        return None

    results = response.json().get("results", [])
    if not results:
        return None

    best = results[0]
    return {
        "plate": best["plate"].upper(),
        "confidence": best["score"],
    }