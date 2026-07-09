import hashlib
import hmac
import os
import base64 # Shopify encoded not hex
from flask import Flask, request, abort

# GitHub uses the X-Hub-Signature-256 header with HMAC-SHA256.
# change GitHub to Shopify (X-Shopify-Hmac-SHA256)

# store the secret
SHOPIFY_SECRET = os.environ['SHOPIFY_WEBHOOK_SECRET'].encode()

# Receive the webhook - get the raw body + Shopify sends the header
def verify_shopify_signature(payload_body: bytes, signature_header: str) -> bool:
    if not signature_header or not signature_header.startswith('sha256='):
        return False
    
    # recreate Shopify signature using secret
    digest = hmac.new(
        SHOPIFY_SECRET, 
        payload_body, 
        hashlib.sha256
    ).digest()

    # convert it to Shopify format
    expected = base64.b64encode(digest).decode()

    # Use compare_digest to prevent timing attacks - valid or not?
    return hmac.compare_digest(expected, signature_header)