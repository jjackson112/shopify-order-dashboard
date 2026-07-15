from flask import Blueprint, jsonify, request
from extensions import db
from services.webhook_verification import verify_shopify_signature
from models.webhook_event import WebhookEvent

webhooks_bp = Blueprint("webhooks", __name__, url_prefix="/api/webhooks")

@webhooks_bp.route("/<path:topic>", methods=["POST"])
def get_webhook(topic):
    signature = request.headers.get(
        "X-Shopify-Hmac-SHA256"
    )

    if not verify_shopify_signature(
        request.data,
        signature
    ):
        return jsonify({"error": "Invalid signature"}), 401

    # read Shopify's topic header - use directly or verify from URL
    shopify_topic = request.headers.get("X-Shopify-Topic")

    if not shopify_topic:
        return jsonify({"error": "Missing webhook topic"}), 400

    if shopify_topic != topic:
        return jsonify({"error": "Webhook topic mismatch"}), 400

    data = request.get_json(silent=True) # or {} means data will almost never be None

    if data is None:
        return jsonify({"error": "Invalid JSON"}), 400

    event = WebhookEvent(
        topic=topic,
        payload=data
    )  

    db.session.add(event)
    db.session.commit()
    
    print("Webhook event", topic)
    print(data)

    return jsonify({"received": True}), 200

@webhooks_bp.route("/events", methods=["GET"])
def list_webhook_events():
    events = WebhookEvent.query.order_by(WebhookEvent.created_at.desc()).all()

    return jsonify([event.to_dict() for event in events]), 200

# @webhooks_bp.route("/orders/create", methods=["POST"])
# def create_order():
#    data = request.get_json() or {}
#    print("Order created", data)
#    return jsonify({"received": True}), 200