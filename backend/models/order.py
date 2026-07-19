from extensions import db
from datetime import UTC, datetime

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    order_number = db.Column(db.Integer, nullable=False, unique=True)
    order_status = db.Column(db.String(50), nullable=False)

    # db.Numeric(10, 2) is for money - allow for 10 digits + 2 of those digits are after the decimal point
    total_price = db.Column(db.Numeric(10, 2), nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC))

    items = db.relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan" # if the parent dies, so do the children (OrderItems)
    )