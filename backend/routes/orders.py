from flask import Blueprint, jsonify, request
import math
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
        result = fetch_orders(first=100) # fetch more orders from Shopify with numbered pages in Flask

        orders = result["orders"]

        # simpler loop + dictionary code moved to utils
        normalized_orders = [
            normalize_order(order)
            for order in orders
        ]

        page = request.args.get("page", 1, type=int)
        per_page = 10

        # ceil is ceiling - round up to nearest whole number
        total = len(normalized_orders)
        total_pages = math.ceil(total/ per_page)

        start = (page - 1) * per_page
        end = start + per_page

        # cannot return every order without slice boundaries
        page_orders = normalized_orders[start:end]

        return jsonify({
            "message": "Orders fetched",
            "orders": page_orders,
            "pages": total_pages,
            "has_prev": page > 1,
            "has_next": page < total_pages
        }), 200

    except Exception as err:
        print(f"Failed to fetch Shopify orders: {err}")

        return jsonify({"error": "Failed to fetch Shopify orders"}), 500

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
            "order": normalized_order
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