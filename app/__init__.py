"""
Flask Application & Registering Blueprint
"""
from flask import Flask
from app.models import db
from app.routes import main
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

def create_app():
    app = Flask(__name__)

    # Load config from the root-level config.py
    app.config.from_object("config.Config")

    # Initialize database
    db.init_app(app)
            
    # Initialize login manager
    login_manager = LoginManager()
    login_manager.init_app(app)

    # Register blueprint
    app.register_blueprint(main, url_prefix="/api")

    return app