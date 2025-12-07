- Sha He
- CSC289 - Group 3
- Creation Date: Nov. 16th, 2025

# SpinStorm – Manual Integration Test

---

## 1. Introduction
This document outlines the manual integration testing performed for the **SpinStorm Slot Game Application**, verifying the communication and behavior between the **React frontend** and **Flask backend API**.

Integration testing ensures that multiple components work together properly and data flows correctly across the entire system.

---

## 2. Testing Environment

| Component | Configuration |
|----------|--------------|
| **Frontend** | React + Vite (`npm run dev -- --host 127.0.0.1`) |
| **Backend** | Flask (`flask run`) |
| **Database** | SQLite (`be/instance/site.db`) |
| **Browser** | Google Chrome / Edge |
| **Frontend URL** | `http://127.0.0.1:5173/` |
| **Backend API URL** | `http://127.0.0.1:5000/api/` |

---

## 3. Manual Steps for Integration Test Cases

### 3.1 User Registration
**Objective:** Verify registration request flows correctly from frontend to backend.

**Steps:**
1. Navigate to `http://127.0.0.1:5173/register`
2. Enter username, email, and password
3. Click **Create Accout**

**Expected Result:**
- `POST /api/register` is triggered.
- Backend returns `status: success`.
- User is redirected to Login page.
- User record is inserted into SQLite DB.

**Status:** Passed

---

### 3.2 User Login
**Objective:** Verify login credentials are validated and UI updates accordingly.

**Steps:**
1. Go to `/login`
2. Enter valid email + password
3. Click **Login**

**Expected Result:**
- Page redirects to game page.

**Status:** Passed

---

### 3.3 Verify Game Page Loads Correctly
**Objective:** Verify Game Page Loads Correctly

**Steps:**
1. Navigate to: http://localhost:5173/game game page.

**Expected Result:**
- Page loads without errors.
- Dark/light theme UI appears.
- Title “SPINSTORM – Slot machine” is visible.
- Balance is displayed (e.g., Balance 100).
- No console errors.

**Status:** Passed

---

### 3.4 Verify Reel (Slot Card) Display
**Objective:** Verify Game Page Loads Correctly

**Steps:**
1. Observe the three slot boxes in the center.

**Expected Result:**
- Exactly 3 reels/cards are displayed.
- Each reel shows a red “?” initially.
- No missing images, broken icons, or undefined symbols.

**Status:** Passed

---
### 3.5 Verify Current Bet Display
**Objective:** Verify Current Bet Display and the + Bet/- Bet buttons work as expected.

**Steps:**
1. Look at the right-side Game Info panel.

**Expected Result:**
- Section title “Game Info” appears.
- Field “Current Bet” is displayed, default value is 10.
- Click the "+ Bet" button and the current Bet will be added by 5.
- Click the "- Bet" button and the current Bet will be subtracted by 5. However, the minimum value is 1, and it will not decrease to 0.

**Status:** Passed

---

### 3.6 Verify “Last Rewards” Section
**Objective:** Verify “Last Rewards” Section ans ensure the “Last Rewards” part can display the latest reward type.

**Steps:**
1. Check the “Last Rewards” panel.

**Expected Result:**
- If the user has not played yet:“No spins yet — try your luck!”
- After a spin, reward details should appear points/Jackpot/Freespin dynamically.

**Status:** Passed

---

### 3.7 Verify Daily Reward Button
**Objective:** Verify Daily Reward Button can be clicked and the reward can be added to the balance correctly.

**Steps:**
1. Click the Daily Reward button under the “Actions” section.

**Expected Result:**
- Daily Reward Button can be clicked and the reward can be added to the balance correctly. Balance increases (e.g., from 100 → 200). “Last Rewards” updates with a daily reward message.
- If it is claimed,it will pop out the message "Already claimed today or not eligible yet".
- No console errors.

**Status:** Passed

---
### 3.8 Spin Game
**Objective:** Validate the spin action triggers backend spin results.

**Steps:**
1. Click **Spin**
3. Observe reels + balance update

**Expected Result:**
- `POST /api/spin` is called.
- Balance displayed updates, UI animation works.
- If it displays the same three pictures, you win a jackpot. The balance will be added 500, and the "last Rewards" panel will be updated with "Points 500" and "Jackpot Yes".
- If it displays 1 or 2 gift picture, you will win a free spin. The "Free Spin Remaining" number will be added by 1, and the "last Rewards" panel will be updated with "Free Spin Yes".

**Status:** Passed

---

### 3.9 Free Spin
**Objective:** Ensure free spin logic works end-to-end.

**Steps:**
1. Trigger a reward that grants a free spin
2. Click **Free Spin**

**Expected Result:**
- Does **not** deduct balance
- UI plays animation normally
- The "Free Spin Remaining" will be deducted by 1, until it goes to zero.

**Status:** Passed

---

### 3.10 Reward History
**Objective:** Retrieve reward history and display it on the UI.

**Steps:**
1. Open Account page and check the Account Overview, Current Balance, and Total Earned.

**Expected Result:**
- UI displays the correct Current Balance, and Total Earned.
- UI displays the Top 3 scores.
- UI display the Reward History with Type, Amount, Description, and When.

**Status:** Passed

---

### 3.11 Logout
**Objective:** Ensure user session ends on both client and server.

**Steps:**
1. Click **Sign Out**

**Expected Result:**
- LocalStorage cleared
- User redirected to home page

**Status:** Passed

---

## 4. Test Summary

| Test Case | Result |
|-----------|--------|
| User Registration |  Passed |
| Login |  Passed |
| Logout |  Passed |
| Spin Game |  Passed |
| Free Spin |  Passed |
| Daily Reward |  Passed |
| Reward History |  Passed |
| System Navigation |  Passed |

All integration tests completed successfully.

---

