from flask import Blueprint, jsonify
from extensions import db
from services.shopify import fetch_orders
from services.token import token_required

orders_bp = Blueprint("orders", __name__, url_prefix='/api/orders')

@orders_bp.route("", methods=["GET"])
@token_required
def fetch_orders():
    orders = fetch_orders()

    return jsonify({
        "message": "Orders fetched",
        "orders": orders
    }), 200