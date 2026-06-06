import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from extensions import db
from flask import Blueprint, request, jsonify
import datetime
from models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix='/api/auth')

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    email = data.get("email", "").strip()

    if not username.strip() or not password.strip() or not email.strip():
        return jsonify({'error': "Username and password are required."}), 400
    
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
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"Username not found"})

