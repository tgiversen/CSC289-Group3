"""
Flask Application & Registering Blueprint
"""
from flask import Flask
from flask_login import LoginManager
from flask_migrate import Migrate
from app.models import db, User
from app.routes import main
from config import Config

migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Load config from the root-level config.py
    app.config.from_object("config.Config")

    # Initialize database
    db.init_app(app)

    # Initialize Flask-Migrate
    migrate.init_app(app, db)
            
    # Initialize login manager
    login_manager = LoginManager()
    login_manager.init_app(app)

    # Flask-Login: how to load user by ID
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprint
    app.register_blueprint(main, url_prefix="/api")

    return app
