from extensions import db
from decimal import Decimal
from models.order import Order
from models.order_item import OrderItem

# a webhook processor marks the event that processes
# webhook routes handle HTTP - no Flask - while processors handle business logic
# pass WebhookEvent (event) through + if processed = True will be saved to db

def process_order_created(event):
    payload = event.payload

    order = Order(
        order_number=payload["order_number"],
        order_status=payload.get("financial_status", "pending"),
        total_price=Decimal(payload["total_price"])
    )

    for item_data in payload.get("line_items", []):
        unit_price = Decimal(item_data["price"])
        quantity = item_data["quantity"]

        item = OrderItem(
            product_name=item_data["name"],
            quantity=quantity,
            unit_price=unit_price,
            total_price=unit_price * quantity,
            sku=item_data.get("sku")
        )

        order.items.append(item)

    db.session.add(order)
    event.processed = True
    db.session.commit()
