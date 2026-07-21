from models.order import Order
from models.order_item import OrderItem
from models.webhook_event import WebhookEvent
from tests.create_test_signature import create_test_signature

def test_order():
    payload = b'''
    {
        "order_number": 1001,
        "order_status": "paid",
        "total_price": "59.98"
    }
    '''