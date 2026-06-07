from flask import Blueprint, request, jsonify
from extensions import db
from models.variant import Variant
from services.token import token_required

variants_bp = Blueprint("/variants", __name__, url_prefix='api/variants')

@variants_bp.route("/int:<variant_id>", methods=["GET"])
@token_required
def get_variant(variant_id):
   # give 404 error if not found
   variant = Variant.query.get_or_404(variant_id)

   return jsonify({"variant": variant.to_dict()}), 200

# single resource endpoint
@variants_bp.route("/int:<variant_id>", methods=["GET"])
@token_required
def get_single_variant(current_user, variant_id):
   variant = Variant.query.filter_by(id=variant_id, user_id=current_user.id).first_or_404()
   return jsonify(variant.to_dict()), 200

@variants_bp.route("/int:<variant_id>", methods=["PATCH"])
@token_required
def update_variants():

@variants_bp.route("/int:<variant_id>", methods=["DELETE"])
@token_required
def delete_variants():