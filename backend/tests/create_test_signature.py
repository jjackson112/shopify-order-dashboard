import hashlib
import hmac
import base64

# test helper method to generate the signature from the payload + secret
def test_signature(secret, payload):
    digest = hmac.new(
        secret.encode("utf-8"),
        payload,
        hashlib.sha256
    ).digest()

    return base64.b64encode(digest).decode("utf-8")