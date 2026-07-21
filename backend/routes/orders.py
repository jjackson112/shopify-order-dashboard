from flask import Blueprint, jsonify
from services.token import token_required
from services.shopify import fetch_orders
from models.order import Order

orders_bp = Blueprint("orders", __name__, url_prefix='/api/orders')

# order data source for live Shopify data - call Shopify directly
@orders_bp.route("/shopify", methods=["GET"])
@token_required
def fetch_orders():
    orders = fetch_orders()

    return jsonify({
        "message": "Orders fetched",
        "orders": orders
    }), 200

# order data source for locally sourced webhook data
@orders_bp.route("", methods=["GET"])
@token_required
def list_saved_orders(current_user):
    orders = Order.query.order_by(Order.created_at.desc()).all()

    return jsonify({
        "message": "Saved orders",
        "orders": [order.to_dict() for order in orders]
    }), 200