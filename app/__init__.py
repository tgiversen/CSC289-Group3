from flask import Flask

def create_app():
    app = Flask(__name__)

    # Config
    app.config['SECRET_KEY'] = 'your-secret-key'

    # Register routes
    from .routes import main
    app.register_blueprint(main)

    return app