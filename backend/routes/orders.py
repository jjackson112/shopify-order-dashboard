from flask import Blueprint, jsonify
from services.token import token_required
from services.shopify import fetch_orders
from models.order import Order

orders_bp = Blueprint("orders", __name__, url_prefix="/api/orders")

# Order data source for live Shopify data
@orders_bp.route("/shopify", methods=["GET"])
@token_required
def fetch_shopify_orders(current_user):
    try:
        orders = fetch_orders()

        normalized_orders = []

        for order in orders:
            customer = order.get("customer") or {}
            shipping_address = order.get("shippingAddress") or {}

            total_price_set = order.get("totalPriceSet") or {}
            shop_money = total_price_set.get("shopMoney") or {}

            # line items in shopify graphql don't exist in the normalized response - alternative solution
            line_items = []
            
            for edge in order.get("lineItems", {}).get("edges", []):
                item = edge.get("node") or {}

                line_items.append({
                    "id": item.get("id"),
                    "name": item.get("name"),
                    "quantity": item.get("quantity"),
                    "sku": item.get("sku")
                })

            normalized_orders.append({
                "id": order.get("id"),
                "name": order.get("name"),
                "email": order.get("email"),
                "created_at": order.get("createdAt"),
                "display_financial_status": order.get(
                    "displayFinancialStatus"
                ),

                "display_fulfillment_status": order.get(
                    "displayFulfillmentStatus"
                ),

                "total_price": shop_money.get("amount"),
                "currency": shop_money.get("currencyCode"),
                "line_items": line_items,

                "customer": {
                    "id": customer.get("id"),
                    "first_name": customer.get("firstName"),
                    "last_name": customer.get("lastName"),
                    "email": customer.get("email"),
                    "phone": customer.get("phone"),
                },

                "shipping_address": {
                    "first_name": shipping_address.get("firstName"),
                    "last_name": shipping_address.get("lastName"),
                    "address1": shipping_address.get("address1"),
                    "address2": shipping_address.get("address2"),
                    "city": shipping_address.get("city"),
                    "province": shipping_address.get("province"),
                    "zip": shipping_address.get("zip"),
                    "country": shipping_address.get("country"),
                },
            })

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
def get_single_order(current_user)
    order_id = request.args.get("id")

    if not order_id:
        return jsonify({"error": "Order ID required"}), 400

    order = fetch_single_order(order_id)

    return jsonify({
        "message": "Order not found",
        "order": normalized_orders(order)
    }), 200

# Order data source for locally saved webhook data
@orders_bp.route("", methods=["GET"])
@token_required
def list_saved_orders(current_user):
    orders = Order.query.order_by(Order.created_at.desc()).all()

    return jsonify({
        "message": "Saved orders",
        "orders": [order.to_dict() for order in orders],
    }), 200