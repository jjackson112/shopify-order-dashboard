from flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from services.token import token_required

products_bp = Blueprint("/products", __name__, url_prefix='api/products')

@products_bp.route("", methods=["POST"])
@token_required
def create_product():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

# get list of products
@products_bp.route("", methods=["GET"])
@token_required
def get_products_list():
    
    query = Product.query.filter_by(user_id=current_user.id)

    return jsonify({"message": "Products list is here."}), 200

# get a single product
@products_bp.route("/<int:id>", methods=["GET"])
@token_required
def get_single_product():

    query = Product.query.filter_by(id=products.id,user_id=current_user.id)

    return jsonify({"message": "Single product is here."}), 200

@products_bp.route("/<int:id>", methods=["PATCH"])
@token_required
def update_product(id):
    pass

@products_bp.route("/<int:id>", methods=["DELETE"])
@token_required
def delete_product(id):
    pass