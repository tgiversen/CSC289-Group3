# Tyler Khin
# CSC289 - Group 9
# Creation Date: September 19th, 2025
# Latest Revision: October 3rd, 2025
# test_models.py: Unit tests for database models

from app.models import User, Reward, UserReward, db


def test_create_user(app):
    user = User(username="alice", email="a@example.com")
    user.set_password("password123")
    db.session.add(user)
    db.session.commit()

    result = User.query.filter_by(username="alice").first()
    assert result is not None
    assert result.balance == 100
    assert result.level == 1


def test_user_reward_relationship(app):
    user = User(username="bob", email="b@example.com")
    user.set_password("pw")
    reward = Reward(type="daily_login", amount=50)
    db.session.add_all([user, reward])
    db.session.commit()

    link = UserReward(user_id=user.id, reward_id=reward.id)
    db.session.add(link)
    db.session.commit()

    # Assert relationships work
    assert user.rewards[0].reward.type == "daily_login"
    assert reward.users[0].user.username == "bob"


def test_password_hashing(app):
    u = User(username="test", email="t@example.com")
    u.set_password("secret")
    assert u.password_hash != "secret"
    assert u.check_password("secret") is True
    assert u.check_password("wrong") is False


def test_delete_user_cascades_rewards(app):
    u = User(username="charlie", email="c@example.com")
    u.set_password("mypassword")
    r = Reward(type="jackpot", amount=500)
    db.session.add_all([u, r])
    db.session.commit()

    # link = UserReward(user_id=u.id, reward_id=r.id)
    link = UserReward(user=u, reward=r)
    db.session.add(link)
    db.session.commit()

    db.session.delete(u)
    db.session.commit()

    assert UserReward.query.filter_by(user_id=u.id).first() is None


def test_user_reward_claimed_at_set(app):
    user = User(username="dana", email="d@example.com")
    user.set_password("pw")
    reward = Reward(type="daily_login", amount=50)
    db.session.add_all([user, reward])
    db.session.commit()

    link = UserReward(user_id=user.id, reward_id=reward.id)
    db.session.add(link)
    db.session.commit()

    assert link.claimed_at is not None


import pytest
from sqlalchemy.exc import IntegrityError


def test_unique_username(app):
    u1 = User(username="eve", email="e@example.com")
    u1.set_password("pw")
    u2 = User(username="eve", email="e2@example.com")
    u2.set_password("pw")
    db.session.add_all([u1, u2])
    with pytest.raises(IntegrityError):
        db.session.commit()
