# test is signature is valid and then invalid
# is the header missing?
# was the JSON rejected at all?

# No Thunder Client ↓ POST request ↓ localhost ↓ receive response
# Pytest does it all for me

# missing input - fake payload, signature + headers - create helper function

def create_valid_webhook():
    payload = b'{"id": 123}' # b is raw bytes
    secret = "test_secret"
    

def test_valid_webhook(client):
    payload, signature, headers = (
        create_valid_webhook()
    )

    # simulate the request
    response = client.post(
        "/api/webhooks/orders/create",
        data=payload,
        headers=headers
    )

    # check the status code
    assert response.status_code == 200

    # check JSON
    assert response.json["received"] is True

def test_invalid_json(client):
    response = client.post(
        "/api/webhooks/orders/create"
    )

    assert response.status_code == 400
    assert response.json["error"] == "Invalid JSON"

def test_missing_signature(client):
    response = client.post(
        "/api/webhooks/orders/create"
    )

    assert response.status_code == 401
    assert response.json["error"] == "Invalid signature"