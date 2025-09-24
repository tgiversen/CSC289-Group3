# Week #2 Backend Progress Report

## 1. Database Schema ✅

### `User` Table
- Stores basic user information, including account details, balance, level, and last login time.

### `Reward` Table
- Defines different types of rewards, such as: Daily login bonus, Jackpot, Slot spin rewards.

### `UserReward` Table
- Logs the actual rewards claimed by users: Who claimed it, When it was claimed, Which reward type was granted.

---

## 2. Virtual Currency System ✅

- Upon registration, each user receives an **initial balance** (e.g., `100` virtual coins).
- Balance is stored in the `User` table.

---

## 3. Backend Functionality Implemented(API Endpoints) ✅

### Registration/Login/Logout API
- The basic user authentication system is now complete.

### API Endpoints Overview

| Method | Endpoint                   | Description                                      |
|--------|----------------------------|--------------------------------------------------|
| POST   | `/api/register`            | Register a new user (username, email, password)  |
| POST   | `/api/login`               | User login, returns balance info                 |
| POST   | `/api/logout`              | User logout                                      |
| GET    | `/api/balance/<username>`  | Get user balance by username                     |
| GET    | `/api/rewards/<username>`  | Get a user's reward history                      |
| POST   | `/api/spin`                | Spin the slot machine (bet, result, payout)      |
| POST   | `/api/daily-reward`        | Claim daily login reward                         |
| GET    | `/api/rewards`             | List all available rewards                       |

---

## 4. Database Initialization and Migration ✅

- All three core tables (`User`, `Reward`, `UserReward`) are created via migrations or initialization scripts.

---

## Current Functional Flow

- User Registers (`/api/register`), User Logs In (`/api/login`), User Checks Balance (`/api/balance`)
✅ This forms a **complete backend loop** for user creation and session validation.

---

## To Be Done (TBD)(Plan to finish them in weekend and at the first two days of sprint2)
After these tests,we can merge the code the main branch to let the front-end developers to do the first integration.

### Unit Tests
Create test cases for:
- Successful and failed registrations/logins
- Authenticated balance checks
- Edge cases (e.g., duplicate usernames)

### Functional Tests
Use Postman or automation frameworks (e.g., `pytest + requests`) to:
- Validate API contract
- Ensure database records are created/updated as expected