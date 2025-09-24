"""
All API routes (Blueprint = main)
"""
from flask import Blueprint, request, jsonify
from app.models import db, User, Reward, UserReward
from flask_login import login_user, logout_user, login_required


main = Blueprint('main', __name__)

# -------------------------
# Health check route
# -------------------------
@main.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "ok"}), 200

# -------------------------
# Auth routes
# -------------------------
# New user registration
@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User registered successfully", "balance": user.balance}), 201

# user login
@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        login_user(user)
        return jsonify({"msg": "Login successful", "balance": user.balance}), 200
    return jsonify({"error": "Invalid email or password"}), 401

# user logout
@main.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"msg": "Logged out successfully"}), 200

# -------------------------
# User info routes
# -------------------------
# Get user balance
@main.route('/balance/<username>', methods=['GET'])
def get_balance(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"username": user.username, "balance": user.balance, "level": user.level}), 200

# Get user reward history
@main.route('/rewards/<username>', methods=['GET'])
def get_rewards(username):
    pass

# -------------------------
# Game routes
# -------------------------
#  Spin the slot machine
@main.route('/spin', methods=['POST'])
def spin():
    pass

# -------------------------
# Rewards system routes
# -------------------------
# Claim daily login reward
@main.route('/daily-reward', methods=['POST'])
def daily_reward():
    pass

# List all available rewards
@main.route('/rewards', methods=['GET'])
def list_rewards():
    pass
