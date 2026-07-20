from extensions import db
from flask import jsonify
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
    event.processed = True
    db.session.commit()

    # handle processing errors
    try:
        if topic == "orders/create":
            process_order_created(event)
    except Exception as error:
        db.session.rollback()
        print("Webhook proessing failed", error)

        return jsonify({
            "error": "Webhook received but processing failed"
        })