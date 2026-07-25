from flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from services.token import token_required
from services.shopify import fetch_products
from services.shopify import fetch_single_product

products_bp = Blueprint("products", __name__, url_prefix='/api/products')

@products_bp.route("", methods=["POST"])
@token_required
def create_product(current_user):
    data = request.get_json() or {}

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400
    
    name = data.get("name", "").strip()
    description = data.get("description", "").strip()

    if not name or not description:
        return jsonify({"error": "Name and description are required."}), 400

    product = Product(
        name=name,
        description=description,
        user_id=current_user.id
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({
        "message": "Product created.",
        "product": product.to_dict()
    }), 201

# get list of products
@products_bp.route("", methods=["GET"])
@token_required
def get_products_list(current_user):
    
    try:
        products = fetch_products()

        return jsonify({
            "message": "Products list is here.",
            "products": products
            }), 200
    except Exception as e:
        print("PRODUCT ROUTE ERROR", e)
        return jsonify({"error": str(e)}), 500

# get a single product
@products_bp.route("/<int:product_id>", methods=["GET"])
@token_required
def get_single_product(current_user, product_id):
    product_id = request.args.get("id") # read query parameters from URL

    if not product_id:
        return jsonify({"error": "Product ID required"}), 400

    product = fetch_single_product(product_id)

    return jsonify({
        "message": "Single product is here.",
        "product": product
    }), 200

@products_bp.route("/<int:product_id>", methods=["PATCH"])
@token_required
def update_product(current_user, product_id):
    # fetch the note, but verify owner
    product = Product.query.filter_by(id=product_id, user_id=current_user.id).first_or_404()

    data = request.get_json() or {}
    name = data.get("name")
    description = data.get("description")

    if name is not None:
        product.name = name.strip()

    if description is not None:
        product.description = description.strip()

    db.session.commit()

    return jsonify({
        "message": "Product updated.",
        "product": product.to_dict()
    }), 201

@products_bp.route("/<int:product_id>", methods=["DELETE"])
@token_required
def delete_product(current_user, product_id):
    # if the note exists but belongs to another person, a 404 error appears
    product = Product.query.filter_by(id=product_id, user_id=current_user.id).first_or_404()

    db.session.delete(product)
    db.session.commit()

    return "", 204 # successful request but no content required