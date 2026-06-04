import os
from flask import Flask
from extensions import db
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # DB Configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Init DB - connect
    db.init_app(app)

    # Import models before create_all
    from models.user import User
    from models.product import Product
    from models.variant import Variant

    with app.app_context():
       db.create_all()

    return app