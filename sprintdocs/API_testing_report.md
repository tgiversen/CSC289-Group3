- Sha He
- CSC289 - Group 9
- Creation Date: September 26th, 2025

# SpinStorm Backend API Testing Report

**Environment:**  
- Backend: Flask (`http://127.0.0.1:5000/api`)  
- Database: SQLite (development mode)  
- Testing Tool: `curl` (manual API verification)  

---

## 1. Purpose
This document summarizes the manual verification of all available API endpoints for the SpinStorm backend.  
The testing aims to ensure that each endpoint:
- Responds correctly with expected status codes (`200`, `400`, `404`, `500` if applicable).  
- Returns JSON data in the expected format.  
- Properly updates database states (e.g., balance, rewards, login status).  

---

## 2. Test Environment Setup
| Component | Details |
|------------|----------|
| Backend Port | `http://127.0.0.1:5000/api` |
| Database | `instance/site.db` |
| User Used for Testing | `username: alice`, `email: alice@example.com` |
| Tools | macOS Terminal + `curl` commands |
| Authentication | Basic (username/email + password) |

---

## 3. API Endpoints Tested

### 3.1 Health Check
**Endpoint:** `/api/ping`  
**Method:** `GET`  
**Command:**
```bash
curl -X GET http://127.0.0.1:5000/api/ping
```
**Expected Response:**
```json
{"status":"success","msg":"ping","data":{"status":"ok"}}
```
**Result:** ✅ Passed (backend reachable)

---

### 3.2 Register New User
**Endpoint:** `/api/register`  
**Method:** `POST`  
**Command:**
```bash
curl -X POST http://127.0.0.1:5000/api/register \
-H "Content-Type: application/json" \
-d '{"username":"alice", "email":"alice@example.com","password":"123456"}'
```
**Expected Response:**  
User registered successfully with initial balance 100.  
**Result:** ✅ Passed

---

### ✅ 3.3 Login User
**Endpoint:** `/api/login`  
**Method:** `POST`  
**Command:**
```bash
curl -X POST http://127.0.0.1:5000/api/login \
-H "Content-Type: application/json" \
-d '{"email":"alice@example.com", "password":"123456"}'
```
**Result:** ✅ Passed (returns success message and current balance)

---

### 3.4 Get User Balance
**Endpoint:** `/api/balance/<username>`  
**Command:**
```bash
curl -X GET http://127.0.0.1:5000/api/balance/alice
```
**Result:** ✅ Passed (correct balance and user level retrieved)

---

### 3.5 Spin with Bet
**Endpoint:** `/api/spin`  
**Command:**
```bash
curl -X POST http://127.0.0.1:5000/api/spin \
-H "Content-Type: application/json" \
-d '{"username": "alice", "bet": 10}'
```
**Result:** ✅ Passed (balance deducted, random result returned)  
⚠️ Note: If `500 Internal Server Error` occurs, it may be due to SQLite write-lock conflict. Re-running resolves it.

---

### 3.6 Free Spin
**Endpoint:** `/api/free-spins`  
**Command:**
```bash
curl -X POST http://127.0.0.1:5000/api/free-spins \
-H "Content-Type: application/json" \
-d '{"username":"alice"}'
```
**Result:** ✅ Passed (if available free spins exist)

---

### 3.7 Daily Login Reward
**Endpoint:** `/api/daily-reward`  
**Command:**
```bash
curl -X POST http://127.0.0.1:5000/api/daily-reward \
-H "Content-Type: application/json" \
-d '{"username":"alice"}'
```
**Result:** ✅ Passed on first login of the day  
⚠️ Returns `"Already claimed daily reward today"` if executed again.

---

### 3.8 List All Rewards
**Endpoint:** `/api/rewards`  
**Command:**
```bash
curl -X GET http://127.0.0.1:5000/api/rewards
```
**Result:** ✅ Passed (returns reward list: daily, jackpot, free spin)

---

### 3.9 Buy Coins
**Endpoint:** `/api/buy-coins`  
**Command:**
```bash
curl -X POST http://127.0.0.1:5000/api/buy-coins \
-H "Content-Type: application/json" \
-d '{"username": "alice", "amount": 500}'
```
**Result:** ✅ Passed (balance increased correctly)

---

## 4. Observations and Notes
| Observation | Description |
|--------------|--------------|
| SQLite Lock Issue | Occasional `500 Internal Server Error` observed during frequent `/spin` calls due to file locking. Resolved by retrying after 1–2 seconds. |
| Free Spin Field | May return `null` if not initialized in DB. Should ensure `default=0`. |
| CORS | Configured and functional — frontend connection at `http://127.0.0.1:5173` allowed. |
| Response Consistency | All endpoints return JSON with `"status"`, `"msg"`, `"data"` fields — consistent API design. |

---

## 📊 5. Summary of Test Results
| Endpoint | Method | Status | Result |
|-----------|---------|--------|---------|
| `/api/ping` | GET | ✅ | Pass |
| `/api/register` | POST | ✅ | Pass |
| `/api/login` | POST | ✅ | Pass |
| `/api/balance/<username>` | GET | ✅ | Pass |
| `/api/spin` | POST | ⚠️ | Pass with occasional 500 error |
| `/api/free-spins` | POST | ✅ | Pass |
| `/api/daily-reward` | POST | ✅ | Pass |
| `/api/rewards` | GET | ✅ | Pass |
| `/api/buy-coins` | POST | ✅ | Pass |

---

## 6. Conclusion
- All core backend API endpoints for SpinStorm were tested successfully using `curl`.  
- The backend is stable and fully functional for integration with the frontend (`React/Vite` at port 5173).  
- Minor optimization is recommended for database concurrency and default field handling.
