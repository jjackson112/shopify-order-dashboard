from extensions import db
from datetime import UTC, datetime

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    order_number = db.Column(db.Integer)
    order_status = db.Column(db.String)
    total_price = db.Column(db.Integer)

    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC))

    items = db.relationship(
        "OrderItem",
        back_populates="order"
    )