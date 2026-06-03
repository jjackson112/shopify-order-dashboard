from extensions import db
from datetime import datetime

class Variant(db.Model):
    __tablename__ = "variants"

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("product_id"), nullable=False)
    
    title = db.Column(db.String(150))
    SKU = db.Column(db.String(100), unique=True)
    price = db.Column(db.Integer)
    quantity = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = db.relationship("Product", back_populates="variants")