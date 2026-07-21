from models.order import Order
from models.order_item import OrderItem
from models.webhook_event import WebhookEvent
from tests.create_test_signature import create_test_signature

def test_order(client):
    payload = b'''
    {
        "order_number": 1001,
        "order_status": "paid",
        "total_price": "59.98"
        "line_items": [
            {
                "product_name": "Black T-shirt",
                "quantity": 2,
                "price": "29.99",
                "sku": "SHIRT-BLK-M"
            }
        ]
    }
    '''

    signature = create_test_signature(
        "test_secret",
        payload
    )

    # simulate the request
    response = client.post(
        "/api/webhooks/orders/create",
        data=payload,
        content_type="application/json",
        headers={
            "X-Shopify-Hmac-SHA256": signature,
            "X-Shopify-Topic": "orders/create"
        }
    )

    # status code
    assert response.status_code == 200

    # check JSON
    assert response.json["received"] is True