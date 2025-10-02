"""
Game Logic Module for SpinStorm Slot Machine

This module implements the core mechanics of the slot machine:
- spin_reels(): Generate random symbols for 3 reels.
- check_results(): Determine rewards (Jackpot, Free Spin).
- spin_with_bet(): Handle spins with coin bets, update balance.
- free_spin(): Perform a spin without deducting balance.
- daily_login_reward(): Grant daily login bonus (once per day).

Rewards include Jackpot points, Free Spins, and Daily Login bonus.
"""

import random
from datetime import datetime

# Note: Does not use User object from database or datetime object (Will add later)

# Slot machine symbols
SYMBOLS = ['CHERRY', 'LEMON', 'ORANGE', 'PLUM','BELL', 'BAR', 'SEVEN', 'FREE']
JACKPOT_REWARD_POINTS = 500
DAILY_REWARD_POINTS = 100                                                                                                                                                                                                                       # Will change later


def spin_reels():
    """
    Simulate spinning 3 reels and return the result.
    """
    result = []
    for i in range(3):  # use for loop to improve the scalability.
        result.append(random.choice(SYMBOLS))
    return result


def check_results(result):
    """
     Check spin results and determine rewards:
    - Jackpot (all 3 match)
    - Free Spin (contains FREE)
    """
    rewards = {
        "jackpot": False,
        "free_spin": False,
        "points": 0,
        "message": ""
    }

    # Jackpot：same three symbols.
    if len(set(result)) == 1:
        rewards["jackpot"] = True
        rewards["points"] += JACKPOT_REWARD_POINTS

    # Free Spin：the result including "FREE".
    if "FREE" in result:
        rewards["free_spin"] = True

    return rewards


def spin_with_bet(balance, bet):
    """
    Perform a spin where the user bets coins.
    Deduct bet from balance unless jackpot or free spin covers it.
    Return (result, rewards, new_balance).
    """
    if bet > balance:
        return None, {"error": "Insufficient balance"}, balance

    # Each spin first deducts the bet
    balance -= bet

    # Then perform a spin after deduct the bet
    result = spin_reels()
    rewards = check_results(result)

    # If win Jackpot reward, increase the reward
    if rewards["jackpot"]:
        balance += rewards["points"]

    # If win free spin reward：show message and you can do free spin one time
    # Allows an infinite loop of "continuous free spins" now.
    if rewards["free_spin"]:
        rewards["message"] = "You won a Free Spin!" 

    return result, rewards, balance


def free_spin(balance):
    """
    Free Spin button on the UI.
    Grant a free spin to the user (does not reduce balance).
    Returns a spin result and reward (if any).
    """
   # Spin without deducting bet
    result = spin_reels()
    rewards = check_results(result)

    # If win Jackpot reward, increase the reward
    if rewards["jackpot"]:
        balance += rewards["points"]
    
    # If win free spin reward：show message and you can do free spin one time
    if rewards["free_spin"]:
        rewards["message"] = "You won a Free Spin!" 
    
    return result, rewards, balance


def daily_login_reward(last_login):
    """
    Give daily login reward (e.g., 100 points).
    Ensure the user can only claim once per day.
    Returns reward amount or 0 if already claimed.
    """
    today = datetime.now().date()
   # First time login (no record in DB yet)
    if not last_login:
        return DAILY_REWARD_POINTS, True

    # Compare only the date (ignore time)
    if last_login.date() < today:
        return DAILY_REWARD_POINTS, True

    # Already logged in today → no reward
    return 0, False
