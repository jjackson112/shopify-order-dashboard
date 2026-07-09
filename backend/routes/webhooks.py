from flask import Blueprint, jsonify, request

webhooks_bp = Blueprint("webhooks", __name__, url_prefix="/api/webhooks")

@webhooks_bp.route("/orders/create", methods=["POST"])
def create_order():
    data = request.get_json() or {}

    print("Order created", data)

    return jsonify({"received": True}), 200