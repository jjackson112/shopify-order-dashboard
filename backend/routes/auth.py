from extensions import db
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from sqlalchemy import or_
from flask import Blueprint, jsonify
import datetime

auth_bp = Blueprint("auth", __name__, url_prefix='api/auth')

@auth_bp.route("/login", methods=["POST"])
def login():

@auth_bp.route("/register", methods=["POST"])
def register():