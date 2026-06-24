from flask import Blueprint, jsonify
from services.shopify import shopify_graphql

# only exists to fetch Shopify products, orders, and variants

shopify_bp = Blueprint("shopify", __name__, url_prefix='/api/shopify')

@shopify_bp.route("/products", methods=["GET"])
def get_products():
    query = """ 
    {
        products(first: 10) {
            edges {
                node {
                    title
                    description
                }
            }
        }
    }
    """

    data = shopify_graphql(query)

    return jsonify(data)