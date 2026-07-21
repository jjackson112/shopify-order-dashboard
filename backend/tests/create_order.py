from models.order import Order
from models.order_item import OrderItem
from models.webhook_event import WebhookEvent
from tests.create_test_signature import create_test_signature

def test_order(client, app):
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

    with app.app_context(): # db "wakes up"

        # find my order
        order = Order.query.filter_by(order_number=1001).first()

        # does the order exist?
        assert order is not None
        assert order.order_status == "paid"
        assert str(order.total_price) == "59.98"

        assert len(order.items) == 1

        item = order.items[0]

        assert item.product_name == "Black T-Shirt"
        assert item.quantity == 2
        assert str(item.unit_price) == "29.99"
        assert str(item.total_price) == "59.98"

        event = WebhookEvent.query.filter_by(topic="orders/create").order_by(WebhookEvent.id.desc()).first()

        # did the webhook event save?
        assert event is not None
        assert event.processed is True