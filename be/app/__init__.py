"""
Flask Application & Registering Blueprint
"""

import os
from flask import Flask
from flask_login import LoginManager
from flask_migrate import Migrate
from app.models import db, User, Reward
from app.routes import main
from config import Config
from flask_cors import CORS

migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # Fixed database path to ./be/instance/site.db
    basedir = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(basedir, "instance", "site.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # CORS configuration
    CORS(
        app,
        resources={
            r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}
        },
        supports_credentials=True,
    )

    # Load config from the root-level config.py
    app.config.from_object("config.Config")

    # Other configuration
    app.config.update(
        SECRET_KEY="dev-secret",
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=False,
    )

    # Initialize database
    db.init_app(app)

    # Create tables
    with app.app_context():
        db.create_all()

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


def init_rewards():
    rewards = [
        Reward(type="daily_login", amount=100, description="Daily login reward"),
        Reward(
            type="jackpot", amount=500, description="Match 3 symbols to win jackpot"
        ),
        Reward(
            type="free_spin",
            amount=0,
            description="Earn a free spin when 'FREE' appears",
        ),
    ]
    db.session.add_all(rewards)
    db.session.commit()
    print("Initialized default rewards.")
