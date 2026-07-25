from flask import Blueprint, jsonify, request
from services.token import token_required
from services.shopify import fetch_orders, fetch_single_order
from models.order import Order

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

# Order data source for live Shopify data
@orders_bp.route("/shopify", methods=["GET"])
@token_required
def fetch_shopify_orders(current_user):
    try:
        orders = fetch_orders()

        normalized_orders = [
            normalized_orders(order)
            for order in orders
        ]

        return jsonify({
            "message": "Orders fetched",
            "orders": normalized_orders,
        }), 200

    except Exception as err:
        print(f"Failed to fetch Shopify orders: {err}")

        return jsonify({
            "error": "Failed to fetch Shopify orders"
        }), 500

# Get a single Shopify order - single resource endpoint
@orders_bp.route("/shopify/id", methods=["GET"])
@token_required
def get_single_order(current_user):
    order_id = request.args.get("id")

    if not order_id:
        return jsonify({"error": "Order ID required"}), 400

    try:
        order = fetch_single_order(order_id)

        if not order:
            return jsonify({"error": "Order not found"}), 404

        return jsonify({
            "message": "Order found",
            "order": order
        }), 200

    except Exception as err:
        print(f"Failed to fetch order", err)

        return jsonify({"error": "Failed to fetch order"}), 500

# Order data source for locally saved webhook data
@orders_bp.route("", methods=["GET"])
@token_required
def list_saved_orders(current_user):
    orders = Order.query.order_by(Order.created_at.desc()).all()

    return jsonify({
        "message": "Saved orders",
        "orders": [order.to_dict() for order in orders],
    }), 200