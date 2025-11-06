"""
Entities:

User → Stores basic user information, including account details, balance, level, and last login time.

Reward → Defines different types of rewards, such as daily login bonus, jackpot, or slot spin rewards.

UserReward → Logs the actual rewards claimed by users, including who claimed it, when it was claimed, and which reward type was granted.

Benefits of This Design:

Allows quick access to a user’s balance and level.

Provides the ability to track the complete reward claim history of each user.

Enables statistics and analysis on reward usage (e.g., how many users have claimed the daily login reward).
"""
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_login import UserMixin
from sqlalchemy import CheckConstraint

# Initialize SQLAlchemy object (database instance)
db = SQLAlchemy()

# User table, Store basic user information (account number, balance, level, login time).
class User(UserMixin, db.Model):

    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    balance = db.Column(db.Integer, default=100)  # Virtual balance (default 100 coins when registering)
    xp = db.Column(db.Integer, default=0)         # Experience points
    level = db.Column(db.Integer, default=1)      # User level (default level 1)
    free_spins = db.Column(db.Integer, default=0)  # number of available free spins
    last_login = db.Column(db.DateTime, nullable=True)           # last login time
    
    # One-to-many relationship: A user can have many rewards
    rewards = db.relationship('UserReward', back_populates='user', cascade="all, delete-orphan", lazy=True) 

    # Optional constraint: free spins cannot be negative
    __table_args__ = (
        CheckConstraint('free_spins >= 0', name='check_free_spins_non_negative'),
    )
    # Password Management
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


# Rewards table (defines the types of rewards, such as daily login, jackpot, free spins)
class Reward(db.Model):

    __tablename__ = "reward"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), unique=True, nullable=False, index=True)    # Reward type (e.g., "daily_login", "jackpot", "free_spin")
    amount = db.Column(db.Integer, nullable=False)     # Reward amount (could be coins or other currency)
    description = db.Column(db.String(200))
    # Timestamp when the reward type was created
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 
    # One-to-many relationship: A reward type can be claimed by many users
    users = db.relationship('UserReward', back_populates='reward', lazy=True)


# UserReward table (association table).Record the rewards that users have actually received (who, when, and what kind of reward).
class UserReward(db.Model):

    __tablename__ = "user_reward"

    id = db.Column(db.Integer, primary_key=True)
    # Which user claimed this reward
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # Which reward type was claimed
    reward_id = db.Column(db.Integer, db.ForeignKey('reward.id'), nullable=False)
    # Timestamp of when the user claimed the reward
    claimed_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship: Link back to User table
    user = db.relationship('User', back_populates='rewards')
    # Relationship: Link back to Reward table
    reward = db.relationship('Reward', back_populates='users')