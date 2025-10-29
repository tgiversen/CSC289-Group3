# Tyler Khin
# CSC289 - Group 9
# Creation Date: September 19th, 2025
# Latest Revision: October 3rd, 2025
# conftest.py: Contains pytest fixtures used for testing

import pytest
from app import create_app, db
from config import TestConfig
from app.models import User


# fixture to start the app in testing mode
@pytest.fixture
def app():
    app = create_app()
    app.config["TESTING"] = True
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()  # clean up after test
    return app


# fixture for creating a test client
@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def user_client(client):
    user = User(username="testuser", email="test@example.com")
    user.set_password("testpassword")
    db.session.add(user)
    db.session.commit()
    return client
