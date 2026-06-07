from flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from models.variant import Variant
from services.token import token_required

variants_bp = Blueprint("variants", __name__, url_prefix='/api/variants')

@variants_bp.route("/int:<variant_id>", methods=["POST"])
@token_required
def create_variant():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400
    
    title = data.get("title", "").strip()
    sku = data.get("sku", "").strip()
    price = data.get("price", "").strip()
    quantity = data.get("quantity", "").strip()

    if not title or not sku or not price or not quantity:
        return jsonify({"error": "Title and description are required."}), 400

    variant = Variant(
        title=title,
        sku=sku,
        price=price,
        quantity=quantity
    )

    db.session.add(variant)
    db.sessiom.commit()

    return jsonify({
        "title": title.to_dict(),
        "sku": sku.to_dict(),
        "price": price.to_dict(),
        "quantity": quantity.to_dict()
    }), 200

# single resource endpoint
@variants_bp.route("/int:<variant_id>", methods=["GET"])
@token_required
def get_single_variant(current_user, variant_id):
   variant = Variant.query.join(Product).filter(
      Variant.id == variant_id,
      Product.user_id == current_user.id
   ).first_or_404()
   
   return jsonify({"variant": variant.to_dict()}), 200

@variants_bp.route("/int:<variant_id>", methods=["PATCH"])
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