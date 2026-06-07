from flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from models.variant import Variant
from services.token import token_required

# variants belong to products - there is no user_id column in DB model
# POST   /api/products/1/variants
# GET    /api/products/1/variants/2

variants_bp = Blueprint("variants", __name__, url_prefix='/api')

@variants_bp.route("/products/<int:product_id>/variants", methods=["POST"])
@token_required
def create_variant(current_user, product_id):
    product = Product.query.filter_by(
        id=product_id,
        user_id=current_user.id
    ).first_or_404()

    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400
    
    title = data.get("title", "").strip()
    sku = data.get("sku", "").strip()
    price = data.get("price", "")
    quantity = data.get("quantity", "")

    if not title or not sku or price is None or quantity is None:
        return jsonify({"error": "Title, SKU, price, and quantity are required."}), 400

    variant = Variant(
        product_id=product.id,
        title=title,
        sku=sku,
        price=price,
        quantity=quantity
    )

    db.session.add(variant)
    db.session.commit()

    return jsonify({"variant": variant.to_dict()}), 200

# single resource endpoint
@variants_bp.route("/products/<int:product_id>/variants/int:<variant_id>", methods=["GET"])
@token_required
def get_single_variant(current_user, variant_id):
   variant = Variant.query.join(Product).filter(
      Variant.id == variant_id,
      Product.user_id == current_user.id
   ).first_or_404()
   
   return jsonify({"variant": variant.to_dict()}), 200

@variants_bp.route("products/<int:product_id>/variants/int:<variant_id>", methods=["PATCH"])
@token_required
def update_variants(current_user, variant_id):
    variant = Variant.query.join(Product).filter(
      Variant.id == variant_id,
      Product.user_id == current_user.id
    ).first_or_404()

    data = request.get_json()
   
    title = data.get("title")
    sku = data.get("sku")
    price = data.get("price")
    quantity = data.get("quantity")

    if title is not None:
        variant.title = title.strip()

    if sku is not None:
        variant.sku = sku.strip()

    if price is not None:
        variant.price = price

    if quantity is not None:
        variant.quantity = quantity

    db.session.commit()

    return jsonify({
        "message": "Variant updated.",
        "variant": variant.to_dict()
    }), 200


@variants_bp.route("/<int:variant_id>", methods=["DELETE"])
@token_required
def delete_variants(current_user, variant_id):
   variant = Variant.query.join(Product).filter(
       Variant.id == variant_id,
       Product.user_id == current_user.id
   ).first_or_404()

   db.session.delete(variant)
   db.session.commit()

   return "", 204