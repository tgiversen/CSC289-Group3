"""
All API routes (Blueprint = main)
"""
from flask import Blueprint, request, jsonify
from app.models import db, User, Reward, UserReward
from flask_login import login_user, logout_user, login_required
from app.game_logic import GameLogic


main = Blueprint('main', __name__)

# -------------------------
# Health check route
# -------------------------
@main.route('/ping', methods=['GET'])
def ping():
    return jsonify({
        "status": "success",
        "msg": "pong",
        "data": {"status": "ok"}
    }), 200

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
    return jsonify({
        "status": "success",
        "msg": "User registered successfully", 
        "data":{
            "username": user.username,
            "balance": user.balance
        } 
        }), 201


# user login
@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # if eamil or password missing.
    if not email or not password:
        return jsonify({
            "status": "error",
            "msg": "Missing email or password"
        }), 400
    # check and return user data.
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({
            "status": "success",
            "msg": "Login successful",
            "data": {
                "username": user.username,
                "balance": user.balance
            }
        }), 200
    # if login failed.
    return jsonify({
        "status": "error",
        "msg": "Invalid email or password"
    }), 401

# user logout
@main.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({
        "status": "success",
        "msg": "Logged out successfully",
        "data": {}}), 200

# -------------------------
# User info routes
# -------------------------
# Get user balance
@main.route('/balance/<username>', methods=['GET'])
def get_balance(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({
            "status":"error",
            "msg": "user not found",
            "data": {}
        }), 404
    return jsonify({
        "status": "success",
        "msg": "Get balance successfully",
        "data":{
            "username": user.username, 
            "balance": user.balance, 
            "level": user.level
        }
    }), 200

# Get user reward history
@main.route('/rewards/<username>', methods=['GET'])
def get_rewards(username):
    # TO DO: query UserReward, and return the user rewards history.
    return jsonify({
        "status": "success",
        "msg": "Not implemented yet",
        "data": {}
    }), 200

# -------------------------
# Game routes
# -------------------------
#  Spin the slot machine
@main.route('/spin', methods=['POST'])
def spin():
    data = request.get_json()
    username = data.get("username")
    bet = data.get("bet", 10) # the default number will be 10.

    # look for the user
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({
            "status": "error",
            "msg": "User not found",
            "data": {}
        }), 404

    # call function spin_with_bet in game_logic
    result, rewards, new_balance = GameLogic.spin_with_bet(user.balance, bet)

    # update the balance
    user.balance = new_balance
    # If the spin rewards include a FREE SPIN, add one
    if rewards.get("free_spin"):
        user.free_spins += 1
    db.session.commit()

    return jsonify({
        "status": "success",
        "msg": "Spin result",
        "data": {
            "result": result,
            "rewards": rewards,
            "new_balance": new_balance,
            "remaining_free_spins": user.free_spins
        }
    }), 200

@main.route('/free-spins', methods=['POST'])
def free_spins():
    data = request.get_json()
    username = data.get("username")

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({
            "status": "error",
            "msg": "User not found",
            "data": {}
        }), 404

    # check the user has free spins or not.
    if user.free_spins <= 0:
        return jsonify({
            "status": "error", 
            "msg": "No available free spins",
            "data": {}
        }), 400

    result, rewards, new_balance = GameLogic.free_spin(user.balance)

    # deduct one free spin
    user.free_spins -= 1
    user.balance = new_balance
    # If the reward includes another FREE SPIN, will not add the free spin to the database to avoid the infinite free spins.
    #if rewards.get("free_spin"):
    #    user.free_spins += 1
    db.session.commit()

    return jsonify({
        "status": "success",
        "msg": "Free Spin result",
        "data": {
            "result": result,
            "rewards": rewards,
            "new_balance": new_balance,
            "remaining_free_spins": user.free_spins
        }
    }), 200

# -------------------------
# Rewards system routes
# -------------------------
# Claim daily login reward
@main.route('/daily-reward', methods=['POST'])
def daily_reward():
    data = request.get_json()
    username = data.get("username")

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({
            "status": "error",
            "msg": "User not found",
            "data": {}
        }), 404

    reward_points, granted = GameLogic.daily_login_reward(user.last_login)
    if granted:
        user.balance += reward_points
        user.last_login = db.func.now()# update the user new login time
        db.session.commit()

        return jsonify({
            "status": "success",
            "msg": "Daily reward claimed" if granted else "Already claimed today",
            "data": {
                "username": user.username,
                "reward_points": reward_points,
                "balance": user.balance
            }
        }), 200
    
    return jsonify({
            "status": "error",
            "msg": "Already claimed daily reward today",
            "data": {"last_login": user.last_login.strftime("%Y-%m-%d")}
        }), 404

# List all available rewards
@main.route('/rewards', methods=['GET'])
def list_rewards():
    """
    Return all reward types defined in the system.
    Used for Rewards Info page.
    """
    rewards = Reward.query.all()

    # preset the default reward type.
    if not rewards:
        default_rewards = [
            {"type": "daily_login", "amount": 100, "description": "Daily login reward"},
            {"type": "jackpot", "amount": 500, "description": "Match 3 symbols to win jackpot"},
            {"type": "free_spin", "amount": 0, "description": "Earn a free spin when 'FREE' appears"}
        ]
        return jsonify({
            "status": "success",
            "msg": "Default rewards loaded",
            "data": default_rewards
        }), 200

    # retrieve data from the database
    reward_list = [
        {
            "id": r.id,
            "type": r.type,
            "amount": r.amount,
            "description": r.description,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in rewards
    ]

    return jsonify({
        "status": "success",
        "msg": "Reward list retrieved",
        "data": reward_list
    }), 200

# -------------------------
# Virtual Currency routes
# -------------------------

# Buy virtual coins (simulate in-game purchase, increase balance)
@main.route('/buy-coins', methods=['POST'])
def buy_coins():
    """
    The player clicks the “Buy Coins” button on the UI 
    → a popup appears with purchase amount options (e.g. 100, 500, 1000 coins) 
    → the API is called.
    Request body example:
    {
        "username": "alice",
        "amount": 500
    }
    """
    data = request.get_json()
    username = data.get("username")
    amount = data.get("amount")

    # parameter verification
    if not username or amount is None:
        return jsonify({
            "status": "error",
            "msg": "Missing username or amount"
        }), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({
            "status": "error",
            "msg": "User not found"
        }), 404

    # buy virtual currency
    user.balance += int(amount)
    db.session.commit()

    return jsonify({
        "status": "success",
        "msg": f"{amount} coins added successfully",
        "data": {
            "username": user.username,
            "new_balance": user.balance
        }
    }), 200

# Exchange coins for other rewards (e.g., bonus spins, cosmetic items)
# TBD for extension feature
@main.route('/exchange', methods=['POST'])
def exchange():
    pass