from extensions import db
from datetime import datetime

# store webhook events, not just print the webhook in console

class WebhookEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    topic = db.Column(db.String(100))
    shopify_id = db.Column(db.String(100))
    payload = db.Column(db.JSON) # lets you store a whole JSON object/dictionary inside one db column

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)