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
        if not app.config.get("TESTING", False):
            init_rewards()

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
    """
    Initialize default rewards if they don't exist in the database.
    Avoids duplicate insertions that cause UNIQUE constraint errors.
    """
    try:
        # Retrieve existing reward types (type field).
        existing = {r.type for r in Reward.query.all()}

        # Define default reward configuration.
        default_rewards = [
            {"type": "daily_login", "amount": 100, "description": "Daily login reward"},
            {"type": "jackpot", "amount": 500, "description": "Match 3 symbols to win jackpot"},
            {"type": "free_spin", "amount": 0, "description": "Earn a free spin when 'FREE' appears"},
        ]

        # Check and insert missing rewards
        added = []
        for r in default_rewards:
            if r["type"] not in existing:
                db.session.add(Reward(**r))
                added.append(r["type"])

        db.session.commit()

        if added:
            print(f"Added new reward types: {', '.join(added)}")
        else:
            print("All default reward types already exist. No new rewards added.")

    except Exception as e:
        db.session.rollback()
        print(f"Failed to initialize rewards: {e}")
