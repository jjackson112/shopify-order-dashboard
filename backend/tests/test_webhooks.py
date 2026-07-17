# test is signature is valid and then invalid
# is the header missing?
# was the JSON rejected at all?

# No Thunder Client ↓ POST request ↓ localhost ↓ receive response
# Pytest does it all for me

# missing input - fake payload, signature + headers - create helper function
from tests.create_test_signature import test_signature

def test_valid_webhook(client):
    payload = b'{"id": 123}' # b is raw bytes

    signature = test_signature(
        "test_secret",
        payload
    )

    # simulate the request
    response = client.post(
        "/api/webhooks/orders/create",
        data=payload,
        content_type="application/json",
        headers={
            "X-Shopify-Hmac-SHA256": signature
        }
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