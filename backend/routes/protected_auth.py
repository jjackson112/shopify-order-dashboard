from flask import Blueprint, jsonify
from services.token import token_required

# add protected route to test decorator
protected_auth_bp = Blueprint("protected_auth", __name__, url_prefix='/api/auth')

@protected_auth_bp.route("/protected", methods=["GET"])
@token_required
def protected_route(user):
    return jsonify({"message": f"Hello {user.username}, your token is valid!"})