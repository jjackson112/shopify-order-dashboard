from extensions import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(75), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # def to_dict(self): not needed because product is not a dictionary 
    # SQLAlchemy object only 
    # when you build API like GET api/products then return to_dict()

    # a product can have numerous variants - one to many
    # cascade tells SQLALchemy what happens to the child (variants) when something happens to the parent (product)
    # "all" - apply all operations on product to variants 
    # "delete-orphan" - when you delete something, it says deleted, not a useless, floating row (orphan)
    variants = db.relationship("Variant", back_populates="product", cascade="all, delete-orphan")