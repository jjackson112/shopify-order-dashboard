import jwt
import os
from extensions import db
from flask import Blueprint, request, jsonify
import datetime
from models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix='/api/auth')

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    username = data.get("username", "").strip().lower()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not username.strip() or not password.strip() or not email.strip():
        return jsonify({'error': "Username, password, and email are required."}), 400
    
    # existing user
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first() 
    if existing_user:
        return jsonify({"error": "Username has already been taken"}), 400
    
    # new user
    new_user = User(username=username, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': "New user successfully registered."}), 201

@auth_bp.route("", methods=["POST"])
def login():
    data = request.get_json() or {}

    identifier = data.get("identifier", "").strip().lower()
    password = data.get("password", "").strip()

    if not identifier or not password:
        return jsonify({"error": "Username/email and password are required"}), 401

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username/email or password."}), 401
    
    secret = os.getenv("SECRET_KEY") # current_app.config["SECRET_KEY"] later
    if not secret:
        return jsonify({"error": "Server misconfiguration"}), 500
    
    # Generate JWT token - payload (data)
    token = jwt.encode(
        {
            'user_id': user.id,
            'role': "merchant", # Shopify dashboard
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, 
        secret, 
        algorithm='HS256'
    ) # HS256 to decode and catch expired/invalid tokens
    
    return jsonify({
        'message': "Login successful",
        "token": token,
        "username": user.username
    }), 200