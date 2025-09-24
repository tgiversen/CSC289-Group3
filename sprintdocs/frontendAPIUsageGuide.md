# Frontend API Usage Guide

This document provides the API endpoints and rules that **frontend developers must follow** when integrating with the backend (Flask).

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
| Method | Endpoint                   | Description | Example |
|--------|-----------------------------|-------------|---------|
| GET    | `/api/balance/<username>`  | Get user balance | `/api/balance/alice` |
| GET    | `/api/rewards/<username>`  | Get user’s reward history | `/api/rewards/alice` |

---

### 3. Game
| Method | Endpoint        | Description | Example Request Body |
|--------|-----------------|-------------|-----------------------|
| POST   | `/api/spin`     | Spin the slot machine (bet, result, payout) | `{ "username": "alice", "bet": 50 }` |

---

### 4. Rewards
| Method | Endpoint           | Description | Example |
|--------|--------------------|-------------|---------|
| POST   | `/api/daily-reward`| Claim daily login reward | `{ "username": "alice" }` |
| GET    | `/api/rewards`     | List all available rewards | `/api/rewards` |

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
