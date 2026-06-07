from flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from services.token import token_required

products_bp = Blueprint("products", __name__, url_prefix='api/products')

@products_bp.route("", methods=["POST"])
@token_required
def create_product(current_user):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

# get list of products
@products_bp.route("", methods=["GET"])
@token_required
def get_products_list(current_user):
    
    query = Product.query.filter_by(user_id=current_user.id)

    return jsonify({"message": "Products list is here."}), 200

# get a single product
@products_bp.route("/<int:id>", methods=["GET"])
@token_required
def get_single_product(current_user, product_id):

    query = Product.query.filter_by(id=product_id,user_id=current_user.id)

    return jsonify({"message": "Single product is here."}), 200

@products_bp.route("/<int:id>", methods=["PATCH"])
@token_required
def update_product(product_id):
    # fetch the note, but verify owner
    product = Product.query.filter_by(id=product_id)

    data = request.get_json()

    if not data:
        return jsonify({"message": "Product updated"}), 200

@products_bp.route("/<int:id>", methods=["DELETE"])
@token_required
def delete_product(current_user, product_id):
    # if the note exists but belongs to another person, a 404 error appears
    product = Product.query.filter_by(id=product_id, user_id=current_user.id).first_or_404()

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "Product deleted"}), 204 # successful request but no content required