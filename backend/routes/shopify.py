from extensions import db
from flask import Blueprint, jsonify

shopify_bp = Blueprint("shopify", __name__, url_prefix='/api/shopify')

@shopify_bp.route("/products", method=["GET"])
def get_products():
    return