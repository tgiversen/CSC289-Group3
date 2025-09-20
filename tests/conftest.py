# Tyler Khin
# CSC289 - Group 9
# September 19th, 2025
# conftest.py: Contains pytest fixtures used for testing

from app import create_app
import pytest


# fixture to start the app in testing mode
@pytest.fixture
def app():
    app = create_app()
    app.config["TESTING"] = True
    return app


# fixture for creating a test client
@pytest.fixture
def client(app):
    return app.test_client()
