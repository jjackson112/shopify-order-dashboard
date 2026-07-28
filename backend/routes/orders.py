from flask import Blueprint, jsonify, request
from services.token import token_required
from services.shopify import fetch_orders, fetch_single_order
from models.order import Order
from backend_utils.orders_normalization import normalize_order

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

# Order data source for live Shopify data
@orders_bp.route("/shopify", methods=["GET"])
@token_required
def fetch_shopify_orders(current_user):
    try:
        orders = fetch_orders()

        # simpler loop + dictionary code moved to utils
        normalized_orders = [
            normalize_order(order)
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
@orders_bp.route("/single", methods=["GET"])
@token_required
def get_single_order(current_user):
    order_id = request.args.get("id")

    if not order_id:
        return jsonify({"error": "Order ID required"}), 400

    try:
        order = fetch_single_order(order_id)

        if not order:
            return jsonify({"error": "Order not found"}), 404

        normalized_order = normalize_order(order)

        return jsonify({
            "message": "Order found",
            "order": normalize_order
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