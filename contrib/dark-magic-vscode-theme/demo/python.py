import requests

url = "https://api.magicbell.com/users"

payload = {
    "user": {
        "external_id": "56780",
        "email": "hana@supportbee.com",
        "first_name": "Hana",
        "last_name": "Mohan",
        "custom_attributes": {
            "plan": "enterprise",
            "pricing_version": "v10",
            "preferred_pronoun": "She"
        },
        "phone_numbers": [
            "+15005550001"
        ]
    }
}

headers = {
    "X-MAGICBELL-API-KEY": "[MAGICBELL_API_KEY]",
    "X-MAGICBELL-API-SECRET": "[MAGICBELL_API_SECRET]"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
