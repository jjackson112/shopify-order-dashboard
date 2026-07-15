# test is signature is valid and then invalid
# is the header missing?
# was the JSON rejected at all?

# No Thunder Client ↓ POST request ↓ localhost ↓ receive response
# Pytest does it all for me

def test_valid_webhook(client):
    # simulate the request
    response = client.post(
        "/api/webhooks/orders/create"
    )

    # check the status code
    assert response.status_code == 200

    # check JSON
    assert response.json["error"] == "Invalid signature"

def test_invalid_webhook(client):
    response = client.post(
        "api/webhooks/orders/create"
    )

    assert response.status_code == 400

    assert response.json["error"] == "Invalid JSON"