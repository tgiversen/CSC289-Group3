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

class GameLogic:
    # Note: Does not use User object from database or datetime object (Will add later)
    # Slot machine symbols
    #SYMBOLS = ['CHERRY', 'LEMON', 'ORANGE', 'PLUM','BELL', 'BAR', 'SEVEN', 'FREE']
    SYMBOLS = ['CHERRY', 'LEMON', 'FREE', 'FREE']
    JACKPOT_REWARD_POINTS = 500
    DAILY_REWARD_POINTS = 100                                                                                                                                                                                                                       # Will change later

    #---------------------------------------------
    # Spin reels (basic random generator)
    # ---------------------------------------------
    @staticmethod
    def spin_reels():
        """
        Simulate spinning 3 reels and return the result.
        """
        result = []
        for i in range(3):  # use for loop to improve the scalability.
            result.append(random.choice(GameLogic.SYMBOLS))
        return result

    # ---------------------------------------------
    # Analyze results and determine rewards
    # ---------------------------------------------
    @staticmethod
    def check_results(result):
        """
        Determine the result and return the reward information, not responsible for changing the balance.
        - Jackpot → all 3 symbols are the same.
        - Free Spin → 'FREE' appears anywhere in the result.
        """
        rewards = {
            "jackpot": False,
            "free_spin": False,
            "points": 0,
            "message": "No win, better luck next time!"
        }

        # Case 1:Jackpot：same three symbols.
        if len(set(result)) == 1:
            rewards["jackpot"] = True
            rewards["points"] += GameLogic.JACKPOT_REWARD_POINTS
            rewards["message"] = f"Jackpot! You won {GameLogic.JACKPOT_REWARD_POINTS} points!"

        # Case 2:Free Spin：the result including "FREE".
        elif "FREE" in result:
            rewards["free_spin"] = True
            rewards["message"] = "You won a Free Spin!"
        
        # Case 3: Normal (no win) — keep default message
        return rewards

    # ---------------------------------------------
    # Paid spin (normal spin with a bet)
    # ---------------------------------------------
    @staticmethod
    def spin_with_bet(balance, bet):
        """
        Perform a paid spin:
        - Deduct bet from balance.
        - Spin reels and evaluate result.
        - Apply jackpot or free spin rewards if applicable.
        Return (result, rewards, new_balance).
        """
        # Step 1. Check balance
        if bet > balance:
            return None, {"error": "Insufficient balance"}, balance

        # Step 2. Deduct bet
        balance -= bet

        # Step 3. Perform the spin
        result = GameLogic.spin_reels()

        # Step 4. Evaluate result
        rewards = GameLogic.check_results(result)

        # Step 5. Apply rewards
        if rewards["jackpot"]:
            balance += rewards["points"]
        # If win free spin reward：show message and you can do free spin one time.
        elif rewards["free_spin"]:
            rewards["message"] = "You won a Free Spin! Use it on the Free Spin Button!" 

        #Step 6. Return data to API
        return result, rewards, balance

    # ---------------------------------------------
    # Free spin (no cost spin)
    # ---------------------------------------------
    @staticmethod
    def free_spin(balance):
        """
        Free Spin button on the UI.
        Grant a free spin to the user (does not reduce balance).
        Returns a spin result and reward (if any).
        """
        # Spin without deducting bet
        result = GameLogic.spin_reels()
        rewards = GameLogic.check_results(result)

        # If win Jackpot reward, increase the reward
        if rewards["jackpot"]:
            balance += rewards["points"]
        
       # # NOTE: Do NOT auto-trigger new free spins — user must click manually.
        
        return result, rewards, balance

    # ---------------------------------------------
    # Daily login reward
    # ---------------------------------------------
    @staticmethod
    def daily_login_reward(last_login):
        """
        Give daily login reward (e.g., 100 points).
        Ensure the user can only claim once per day.
        Returns reward amount or 0 if already claimed.
        """
        today = datetime.now().date()
        # First time login (no record in DB yet)
        if not last_login:
            return GameLogic.DAILY_REWARD_POINTS, True

        # Compare only the date (ignore time)
        if last_login.date() < today:
            return GameLogic.DAILY_REWARD_POINTS, True

        # Already logged in today → no reward
        return 0, False