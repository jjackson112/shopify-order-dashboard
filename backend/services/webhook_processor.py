from extensions import db
from models.order import Order
from models.order_item import OrderItem

# a webhook processor marks the event that processes
# webhook routes handle HTTP while processors handle business logic

def process_order_created(payload):
    order = Order(
        order_number=payload["order_number"],
        order_status=payload.get("financial_status", "pending"),
        total_price=payload["total_price"]
    )

    for item_data in payload.get("line_items", []):
        item = OrderItem(
            product_name=item_data["name"],
            quantity=item_data["quantity"],
            unit_price=item_data["price"],
            total_price=(
                float(item_data["price"])
                * item_data["quantity"]
            ),
            sku=item_data.get("sku")
        )

        order.items.append(item)

    db.session.add(order)
    db.session.commit()