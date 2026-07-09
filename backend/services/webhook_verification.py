import hashlib
import hmac
import os
from flask import Flask, request, abort

# GitHub uses the X-Hub-Signature-256 header with HMAC-SHA256.
# change GitHub to Shopify 

app = Flask(__name__)
GITHUB_SECRET = os.environ['GITHUB_WEBHOOK_SECRET'].encode()

def verify_github_signature(payload_body: bytes, signature_header: str) -> bool:
    if not signature_header or not signature_header.startswith('sha256='):
        return False
    expected = 'sha256=' + hmac.new(
        GITHUB_SECRET, payload_body, hashlib.sha256
    ).hexdigest()
    # Use compare_digest to prevent timing attacks
    return hmac.compare_digest(expected, signature_header)

@app.route('/webhooks/github', methods=['POST'])
def github_webhook():
    signature = request.headers.get('X-Hub-Signature-256', '')
    if not verify_github_signature(request.data, signature):
        abort(400, 'Invalid signature')

    payload = request.get_json()
    event = request.headers.get('X-GitHub-Event')
    print(f'Received {event} event for {payload.get("repository", {}).get("full_name")}')
    return '', 204