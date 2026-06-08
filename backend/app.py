import os
from flask import Flask
from extensions import db
from flask_cors import CORS
from routes.auth import auth_bp
from routes.protected_auth import protected_auth_bp
from routes.products import products_bp
from routes.variants import variants_bp

def create_app():
   app = Flask(__name__)
   CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

   # DB Configuration
   app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
   app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

   # SECRET_KEY - instead of os.getenv("SECRET_KEY") in every route
   app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

   # Init DB - connect
   db.init_app(app)

   # Import models before create_all
   from models.user import User
   from models.product import Product
   from models.variant import Variant

   # Blueprints
   app.register_blueprint(auth_bp)
   app.register_blueprint(protected_auth_bp)
   app.register_blueprint(products_bp)
   app.register_blueprint(variants_bp)

   with app.app_context():
      db.create_all()

   return app

app = create_app()