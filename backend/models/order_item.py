from extensions import db
from datetime import UTC, datetime

class OrderItem(db.Model):
    order_id = db.Column(db.Integer, primary_key=True)
    
    product_name = db.Column(db.String)
    quantity = db.Column(db.Integer)
    total_price = db.Column(db.Integer)
    sku = db.Column(db.String, nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC))

    order = db.relationship(
        "Order",
        back_populates="items"
    )