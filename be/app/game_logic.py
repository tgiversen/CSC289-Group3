import random
from datetime import datetime, timedelta

# Note: Does not use User object from database or datetime object (Will add later)

# Slot machine symbols
SYMBOLS = ['SYMBOL_1', 'SYMBOL_2', 'SYMBOL_3', 'SYMBOL_4', 'SYMBOL_5', 'SYMBOL_6', 'SYMBOL_7', 'SYMBOL_8', 'SYMBOL_9', 'SYMBOL_10',]        # Will change later
JACKPOT_REWARD_POINTS = 1000000                                                                                                             # Will change later                                                                                                               # Will change later


def spin_reels():
    """
    Simulate spinning 3 reels and return the result.
    """
    result = []
    result.append(random.choice(SYMBOLS))
    result.append(random.choice(SYMBOLS))
    result.append(random.choice(SYMBOLS))
    return result


def spin_with_bet(balance, bet):
    """
    Perform a spin where the user bets coins.
    Deducts bet amount from balance.
    Returns result, win/loss, and reward.
    """
    result = spin_reels()
    is_jackpot, reward = check_jackpot(result)
    if not is_jackpot:
        balance -= bet

    return result, is_jackpot, reward


def check_jackpot(result):
    """
    Check if the result is a jackpot (all symbols match).
    Returns (bool, reward_points).
    """
    is_jackpot = len(set(result)) == 1
    reward_points = 0
    if is_jackpot:
        reward_points = JACKPOT_REWARD_POINTS

    return is_jackpot, reward_points


def free_spin():
    """
    Grant a free spin to the user (does not reduce balance).
    Returns a spin result and reward (if any).
    """
    result = spin_reels()
    is_jackpot, reward = check_jackpot(result)

    return result, is_jackpot, reward


def daily_login_reward(last_login):
    """
    Give daily login reward (e.g., 100 points).
    Ensure the user can only claim once per day.
    Returns reward amount or 0 if already claimed.
    """
    if last_login != 'today':
        return 100
    else:
        return 0
