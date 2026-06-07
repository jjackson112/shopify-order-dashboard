from flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from services.token import token_required

products_bp = Blueprint("products", __name__, url_prefix='/api/products')

@products_bp.route("", methods=["POST"])
@token_required
def create_product(current_user):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400
    
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()

    if not title or not description:
        return jsonify({"error": "Title and description are required."}), 400

    product = Product(
        title=title,
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
    
    products = Product.query.filter_by(user_id=current_user.id)

    return jsonify({
        "message": "Products list is here.",
        "products": [product.to_dict() for product in products]
        }), 200

# get a single product
@products_bp.route("/<int:product_id>", methods=["GET"])
@token_required
def get_single_product(current_user, product_id):

    product = Product.query.filter_by(id=product_id,user_id=current_user.id).first_or_404()

    return jsonify({
        "message": "Single product is here.",
        "product": product.to_dict()
    }), 200

@products_bp.route("/<int:product_id>", methods=["PATCH"])
@token_required
def update_product(current_user, product_id):
    # fetch the note, but verify owner
    product = Product.query.filter_by(id=product_id, user_id=current_user.id).first_or_404()

    data = request.get_json()
    title = data.get("title")
    description = data.get("description")

    if title is not None:
        product.title = title.strip()

    if description is not None:
        product.description = description.strip()

    db.session.commit()

    return jsonify({
        "message": "Product updated.",
        "product": product.to_dict()
    }), 200

@products_bp.route("/<int:product_id>", methods=["DELETE"])
@token_required
def delete_product(current_user, product_id):
    # if the note exists but belongs to another person, a 404 error appears
    product = Product.query.filter_by(id=product_id, user_id=current_user.id).first_or_404()

    db.session.delete(product)
    db.session.commit()

    return "", 204 # successful request but no content required