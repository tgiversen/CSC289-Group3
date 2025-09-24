
- sha he
- CSC289 - Group 9
- September 24th, 2025 updated
# SpinStorm Backend Testing Guide

This document is for the QA/Testing team to verify backend
functionality.

------------------------------------------------------------------------

## 1️⃣ Setup Instructions

### Clone the project

``` bash
git clone <your-repo-url>
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

Backend will be available at:

http://127.0.0.1:5000/api

------------------------------------------------------------------------

## 2️⃣ API Endpoints to Test

### Register new user

``` bash
curl -X POST http://127.0.0.1:5000/api/register      -H "Content-Type: application/json"      -d '{"username":"alice", "email":"alice@example.com", "password":"123456"}'
```
**Expected:**

``` json
{"msg": "User registered successfully", "balance": 100}
```
### Login

``` bash
curl -X POST http://127.0.0.1:5000/api/login      -H "Content-Type: application/json"      -d '{"email":"alice@example.com", "password":"123456"}'
```
**Expected:**
``` json
{"msg": "Login successful", "balance": 100}
```

### Get user banlance info
``` bash
curl -X GET http://127.0.0.1:5000/api/balance/<username>
```
**Expected:**
``` json
{"balance":100,"level":1,"username":"<username>"}
```

### Add reward type

``` bash
TBD
```

### Claim daily_reward

``` bash
TBD'
```

### List all rewards

``` bash
TBD
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
