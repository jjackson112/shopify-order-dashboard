from flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from services.token import token_required

products_bp = Blueprint("/products", __name__, url_prefix='api/products')

# get list of products
@products_bp.route("", methods=["GET"])
@token_required
def get_products():
    return jsonify({})

@products_bp.route("", methods=["POST"])
@token_required
def create_product():
    pass 

# get a single product
@products_bp.route("/<int:id>", methods=["GET"])
@token_required
def get_product():
    pass

@products_bp.route("/<int:id>", methods=["PATCH"])
@token_required
def update_product(id):
    pass

@products_bp.route("/<int:id>", methods=["DELETE"])
@token_required
def delete_product(id):
    pass