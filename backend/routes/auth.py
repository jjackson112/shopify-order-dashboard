import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from extensions import db
from flask import Blueprint, request, jsonify
import datetime
from sqlalchemy import or_
from models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix='/api/auth')

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not username.strip() or not password.strip() or not email.strip():
        return jsonify({'error': "Username, password, and email are required."}), 400
    
    # existing user
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first() 
    if existing_user:
        return jsonify({"Username has already been taken"}), 400
    
    # new user
    new_user = User(username=username, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': "New user successfully registered."}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    identifier = data.get("identifier", "").strip().lower()
    password = data.get("password", "").strip()

    if not identifier or not password:
        return jsonify({"Username/email and password are required"}), 401

    user = User.query.filter_by(identifier=identifier).first()

    
    return jsonify({'message': "Login successful"}), 200