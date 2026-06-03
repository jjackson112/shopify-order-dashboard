from extensions import db
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from sqlalchemy import or_
from flask import Blueprint, jsonify
import datetime

auth_bp = Blueprint("auth", __name__, url_prefix='api/auth')

@auth_bp.route("/login", methods=["POST"])
def login():
data = request.get_json() or {}
    identifier = data.get('identifier', '').strip()
    password = data.get('password', '').strip()

    user = User.query.filter(
        or_(
            User.username == identifier,
            User.email == identifier
        )
    ).first()

    print("identifier", identifier)
    print("password", password)

    if user:
        print("stored username", user.username)
        print("stored email", user.email)
        print("stored password", user.check_password(password))

    if not user or not user.check_password(password):
        return jsonify({'error': "Invalid username or password"}), 401

    secret = current_app.config['SECRET_KEY']
    if not secret:
        return jsonify({"error": "Server misconfiguration"}), 500 

    # Generate JWT token - payload (data)
    # access only token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, secret, algorithm='HS256') # HS256 to decode and catch expired/invalid tokens
    
    refresh_token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=5)
    }, secret, algorithm='HS256')

    if isinstance(token, bytes):
        token = token.decode('utf-8')
    
    return jsonify({
        'token': token,
        'username': user.username,
        'refresh_token' : refresh_token,
        'user': user.to_dict() # Helpful to send user info back on login
    }), 200

@auth_bp.route("/register", methods=["POST"])
def register():