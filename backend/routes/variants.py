from flask import Blueprint, request, jsonify
from extensions import db
from models.variant import Variant
from services.token import token_required

variants_bp = Blueprint("/variants", __name__, url_prefix='api/variants')