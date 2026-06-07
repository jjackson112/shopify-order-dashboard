import flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from services.token import token_required

products_bp = Blueprint("/products", __name__, url_prefix='api/products')
# get list of products
@product_bp.route("/", methods=["GET"])
@token_required

# get a single product
@product_bp.route("/product/<int:id>", methods=["GET"])
@token_required

@product_bp.route("/", methods=["POST"])
@token_required

@product_bp.route("/product/<int:id>", methods=["PATCH"])
@token_required

@product_bp.route("/product/<int:id>", methods=["DELETE"])
@token_required