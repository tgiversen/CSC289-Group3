
- sha he
- CSC289 - Group 9
- October 5th, 2025 updated


# 🧭 Dashboard Feature Design Document

## 1. Overview
The **Dashboard (Home Page)** serves as the central hub of the Slot Machine Game.  
It connects the core game logic (`game_logic.py`) with user account features through RESTful API endpoints.

Each section of the Dashboard corresponds to a specific backend API, allowing users to:
- Spin the slot machine
- Use free spins (when available)
- Claim daily login rewards
- View balance and reward history
- Show what types of rewards are available in the game help page
- Buy virtual coins


---

## 2. UI Modules and API Mapping

| Module | UI Element | API Endpoint | Description |
|--------|-------------|---------------|-------------|
| 🎰 **Spin** | “Spin” button (main slot machine control) | `POST /api/spin` | Spins the slot machine with a bet amount. Returns spin result, winning information, and updated balance. |
| 🆓 **Free Spins** | “Free Spin” button (only active when available) | `POST /api/free-spins` | This button activates when the user wins a free spin bonus. Clicking it will execute one free spin without deducting any remaining balance. The button will automatically deactivate after use. |
| 🪙 **Balance** | “Current Balance” display | `GET /api/balance/<username>` | Displays the user's current balance and level. Automatically refreshed after each login, spin, or top-up.. |
| 🎁 **Daily Login Reward** | “Claim Daily Reward” button | `POST /api/daily-reward` | Grants daily login rewards (once per day). |
| 💳 **Buy Coins** | “Buy Coins” button + pop-up selection box | `POST /api/buy-coins` | Allow players to purchase virtual coins (simulate top-up). The front-end sends a request like { "username": "alice", "amount": 500 } , and the back-end updates the balance. |
| 📜 **Rewards History** | “Reward History” table | `GET /api/rewards/<username>` | Displays a list of all rewards that the user has earned (jackpot, free spins, daily login, etc.). |
| 🧾 **Reward Types** | (Optional) “Reward List” info modal | `GET /api/rewards` | Lists all available reward types (e.g., `daily_login`, `jackpot`, `free_spin`), for help pages. |

---

## 3. Reward System Logic

| Reward Type | Trigger | Reward Description | API Endpoint |
|--------------|----------|--------------------|---------------|
| 🪙 **Jackpot** | All 3 slot symbols match | +500 coins (default in `game_logic.py`) | `/api/spin` |
| 🎁 **Daily Login** | First login per day | +100 coins (once per day) | `/api/daily-reward` |
| 🆓 **Free Spin** | Spin result includes `"FREE"` | Grants 1 free spin opportunity | `/api/spin (bet=0)` |

---



###  Reward Data Management

| API Endpoint | Function | Usage |
|---------------|-----------|--------|
| `GET /api/rewards` | Fetch all defined reward types in the system | Used in “Help Center” or “Reward Info” section for static display |
| `GET /api/rewards/<username>` | Fetch a specific player’s reward history | Displayed under “Account Overview” → “Reward History” table |

---

## 4. Virtual Currency System

### 1️⃣ Overview

The **Virtual Currency System** allows players to manage in-game coins — they can purchase coins, use them for betting, or exchange them for special rewards.

---

### 2️⃣ Core Modules

| Module | Frontend Display | API Endpoint | Description |
|---------|------------------|---------------|--------------|
| 🪙 **Buy Coins** | “Buy Coins” Button | `POST /api/buy-coins` | Simulates an in-game purchase; backend increases the user’s `balance` value. |
| 🔁 **Exchange (Optional)** | TBD | `POST /api/exchange` |TBD. |

---

## Frontend API Usage Guide

---
### This document provides the API endpoints and rules that **frontend developers must follow** when integrating with the backend (Flask).
---

## 🔹 General Rules
1. **Use the exact endpoints** defined below. Do not rename or change them.  
2. **Use the correct HTTP method** (GET / POST).  
3. **Send data as JSON** in request bodies when using POST.  
4. **Expect JSON responses** from all endpoints.  
5. If you encounter issues, check the request URL, method, and payload format first.

---


## 🔹 API Endpoints

### 1. Auth
| Method | Endpoint         | Description | Example Request Body |
|--------|------------------|-------------|-----------------------|
| POST   | `/api/register`  | Register a new user | `{ "username": "alice", "email": "alice@test.com", "password": "123456" }` |
| POST   | `/api/login`     | User login, returns balance info | `{ "email": "alice@test.com", "password": "123456" }` |
| POST   | `/api/logout`    | Logout current user | *No body* |

---

### 2. User Info
| Method | Endpoint                   | Description | Example | (no body)
|--------|-----------------------------|-------------|---------|
| GET    | `/api/balance/<username>`  | Get user balance | `/api/balance/alice` |
| GET    | `/api/rewards/<username>`  | Get user’s reward history | `/api/rewards/alice` |

---

### 3. Game
| Method | Endpoint        | Description | Example Request Body |
|--------|-----------------|-------------|-----------------------|
| POST   | `/api/spin`     | Spin the slot machine (bet, result, payout)Handles RNG, win/loss calculation. | `{ "username": "alice", "bet": 50 }` |
| POST   | `/api/free-spins`| Spin the slot machine (bet, result, payout)Handles RNG, win/loss calculation. | `{ "username": "alice"}` |


### 4. Rewards
| Method | Endpoint           | Description | Example |
|--------|--------------------|-------------|---------|
| POST   | `/api/daily-reward`| Claim daily login reward | `{ "username": "alice" }` |
| GET    | `/api/rewards`     | List all available rewards | `/api/rewards` |

## 5. Virtual Currency APIs

| Method | Endpoint        | Description | Example Request Body
|--------|-----------------|-------------|
| `POST` | `/api/buy-coins` | Buy virtual coins (simulate in-game purchase, increase balance). | { "username": "alice", "amount": 500 }
| `POST` | `/api/exchange`  | TBD |

---

## System APIs

| Method | Endpoint   | Description |
|--------|------------|-------------|
| `GET`  | `/api/ping` | Health check (returns `{ "status": "ok" }`). |

---


## 🔹 Example Workflow
1. **Register → Login**:  
   Frontend registers a user, then logs in to receive session info.  
2. **Login → Spin**:  
   Send a POST request to `/api/spin` with bet amount.  
3. **Spin → Rewards/Balance**:  
   Use `/api/balance/<username>` and `/api/rewards/<username>` to update the UI.  
4. **Login → Daily Reward**:  
   Call `/api/daily-reward` once per day to claim bonus.

---

✅ **Reminder:** If the frontend does not follow these endpoints and payload formats, the integration will fail. Please confirm with the backend team before making changes.  


