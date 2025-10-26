- Sha He
- CSC289 - Group 9
- Creation Date: September 19th, 2025
- Latest Revision: October 24th, 2025

# SpinStorm API Testing Guide

This document is for backend developers and QA testers to verify API responses and JSON structures using curl commands.

| Scenario | Description |
|-----------|--------------|
|**Backend Self-Testing** | After implementing a new route, developers can immediately run the corresponding `curl` command to verify whether the returned JSON structure and data are correct. |
|**QA Testing** | QA testers can follow this document step by step to execute requests, check HTTP status codes (200 / 400 / 404), and validate the structure of the response body. |
|**Frontend-Backend Integration** | Frontend developers can refer to the request body format (e.g., `username`, `bet`, `amount`) to ensure their requests align with the backend API definitions. |

------------------------------------------------------------------------

## 1️⃣ Setup Instructions


``` bash
# Clone the project
git clone https://github.com/tgiversen/CSC289-Group9.git
cd CSC289-Group9/be

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate    # On Mac/Linux
venv\Scripts\activate       # On Windows

# Install dependencies
pip install -r requirements.txt

# Initialize database (first time only)
flask db upgrade

# Run backend server
flask run
```

#### Backend will be available at: http://127.0.0.1:5000/api

------------------------------------------------------------------------

## 2️⃣ API Endpoints to Test（You should replace the username alice as your registered username）

**Health Check**
``` bash
curl -X GET http://127.0.0.1:5000/api/ping 
**Expected Response:**

``` json
{
  "status": "success",
  "msg": "ping",
  "data": {
    "tatus": "ok"
  }
}
```
**1. Register new user**

``` bash
curl -X POST http://127.0.0.1:5000/api/register -H "Content-Type: application/json" -d '{"username":"alice", "email":"alice@example.com","password":"123456"}'
```
**Expected Response:**

``` json
{
  "status": "success",
  "msg": "User registered successfully",
  "data": {
    "username": "alice",
    "balance": 100
  }
}
```
**2. Login user**

``` bash
curl -X POST http://127.0.0.1:5000/api/login -H "Content-Type: application/json" -d '{"email":"alice@example.com", "password":"123456"}'
```
**Expected Response:**
``` json
{
  "status": "success",
  "msg": "Login successful",
  "data": {
    "username": "alice",
    "balance": 100
  }
}

```

**3. Get user banlance info**
``` bash
curl -X GET http://127.0.0.1:5000/api/balance/alice
```
**Expected Response:**
``` json
{
  "status": "success",
  "msg": "Get balance successfully",
  "data": {
    "username": "alice",
    "balance": 100,
    "level": 1
  }
}

```
**4. spin with bet**
You may encounter 500 Internal Server Error if you run this command frequently.
It is most likely SQLite write lock conflict.SQLite is a single-file database and does not support multi-threaded writes.
If the db.session.commit() call from the previous spin has not yet fully released the file lock, and you initiate a second request almost simultaneously, a 500 error may be briefly displayed. Just wait for a while and rerun this commamd.
``` bash
curl -X POST http://127.0.0.1:5000/api/spin -H "Content-Type: application/json" -d '{"username": "alice", "bet": 10}'
```
**some of Expected Response:**
``` json
{
  "status": "success",
  "msg": "Spin result",
  "data": {
    "result": ["CHERRY", "BELL", "FREE"],
    "rewards": {
      "jackpot": false,
      "free_spin": true,
      "points": 0,
      "message": "You won a Free Spin!"
    },
    "new_balance": 90,
    "remaining_free_spins": 1
  }
}
```
``` json
{
  "status": "success",
  "msg": "Spin result",
  "data": {
    "result": ["PLUM","BAR","CHERRY"],
    "rewards": {
      "jackpot": false,
      "free_spin": false,
      "points": 0,
      "message": "No win, better luck next time!"
    },
    "new_balance": 90,
    "remaining_free_spins": null
  }
}
```

**5. free spin**
``` bash
curl -X POST http://127.0.0.1:5000/api/free-spins \
-H "Content-Type: application/json" \
-d '{"username": "alice"}'
```
**one of Expected Response:**
``` json
{
  "status": "success",
  "msg": "Free Spin result",
  "data": {
    "result": ["CHERRY", "CHERRY", "CHERRY"],
    "rewards": {
      "jackpot": true,
      "points": 500,
      "message": "Jackpot! You won 500 points!"
    },
    "new_balance": 590,
    "remaining_free_spins": 0
  }
}
```

**6. Daily Login Reward**
``` bash
curl -X POST http://127.0.0.1:5000/api/daily-reward \
-H "Content-Type: application/json" \
-d '{"username": "alice"}'

```
**Expected Response:**
``` json
{
  "status": "success",
  "msg": "Daily reward claimed",
  "data": {
    "username": "alice",
    "reward_points": 100,
    "balance": 690
  }
}
```

**7. List All Rewards**
``` bash
curl -X GET http://127.0.0.1:5000/api/rewards

```
**Expected Response:**
``` json
{
  "status": "success",
  "msg": "Reward list retrieved",
  "data": [
    {"type": "daily_login", "amount": 100, "description": "Daily login reward"},
    {"type": "jackpot", "amount": 500, "description":"Match 3 symbols to win jackpot"},
    {"type": "free_spin", "amount": 0, "description":"Earn a free spin when 'FREE' appears"}
  ]
}
```

**8. Buy coins**
``` bash
curl -X POST http://127.0.0.1:5000/api/buy-coins \
-H "Content-Type: application/json" \
-d '{"username": "alice", "amount": 500}'
```
**Expected Response:**
``` json
{
  "status": "success",
  "msg": "500 coins added successfully",
  "data": {
    "username": "alice",
    "new_balance": 1190
  }
}
```
**8. Reward History**
``` bash
TBD
```

**Expected Response:**
``` json
```

------------------------------------------------------------------------
## 3️⃣ Database Debugging (Optional)

Open database:

``` bash
sqlite3 instance/site.db
```

Useful commands:

``` sql
.tables               -- list all tables
.schema user          -- see User table structure
SELECT * FROM user;   -- see registered users
SELECT * FROM reward; -- see available rewards
SELECT * FROM user_reward; -- see history of rewards claimed by users

```
------------------------------------------------------------------------

## 4️⃣ Tips for Testing

-   If something breaks, delete `instance/site.db` and re-run
    `flask db upgrade` to reset.
-   Use ### different usernames/emails ### when testing register.
-   Try invalid inputs (e.g., wrong password) to check error handling.
-   Report all findings in Trello / GitHub Issues.
