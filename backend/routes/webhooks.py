from flask import Blueprint, jsonify, request
from extensions import db
from models.webhook_event import WebhookEvent

webhooks_bp = Blueprint("webhooks", __name__, url_prefix="/api/webhooks")

@webhooks_bp.route("/<topic>", methods=["POST"])
def get_webhook(topic):
    data = request.get_json() or {}

    if data is None:
        return ({"error": "Invalid JSON"}), 400

    event = WebhookEvent(
        topic=topic,
        payload=data
    )  

    db.session.add(event)
    db.session.commit()
    
    print("Webhook event", {topic})
    print(data)

    return jsonify({"received": True}), 200


# @webhooks_bp.route("/orders/create", methods=["POST"])
# def create_order():
#    data = request.get_json() or {}
#    print("Order created", data)
#    return jsonify({"received": True}), 200