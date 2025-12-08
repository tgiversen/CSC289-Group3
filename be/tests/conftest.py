# Tyler Khin
# CSC289 - Group 9
# Creation Date: September 19th, 2025
# Latest Revision: December 8th, 2025
# conftest.py: Contains pytest fixtures used for testing

import pytest
from app.__init__ import create_app, db
from config import TestConfig
from app.models import User, Reward, UserReward
from datetime import datetime, timedelta


# fixture to start the app in testing mode
@pytest.fixture
def app():
    app = create_app()
    app.config["TESTING"] = True
    app.config["WTF_CSRF_ENABLED"] = False
    with app.app_context():
        db.create_all()
        # Clear the reward table here to avoid unique constraint conflicts.
        Reward.query.delete()
        db.session.commit()

        yield app
        db.session.remove()
        db.drop_all()  # clean up after test
        db.engine.dispose()


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


@pytest.fixture
def reward_client(client):
    user = User(username="luckyuser", email="lucky@example.com")
    user.set_password("luckypassword")
    print(user.id)
    user.free_spins = 20
    user.last_login = datetime.now() - timedelta(days=1)
    reward = Reward(
        type="jackpot", amount=500, description="Match 3 symbols to win jackpot"
    )
    db.session.add(user)
    db.session.add(reward)
    db.session.commit()

    userReward = UserReward(user_id=user.id, reward_id=reward.id)
    db.session.add(userReward)
    db.session.commit()

    db.session.refresh(user)

    return client
