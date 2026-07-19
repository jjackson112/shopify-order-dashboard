from extensions import db
from datetime import UTC, datetime

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("order.id"), nullable=False)
    
    product_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    sku = db.Column(db.String(100), nullable=True)

    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC))

    order = db.relationship(
        "Order",
        back_populates="items"
    )