# CSC289 Group 9 Project

## CSC289 Group 9 - Team Members

### Teddy Iversen  
- **Role**: Project Manager / Scrum Master, UX/UI Developer  
- **Email**: iaiversen@my.waketech.edu  

### Shawntel Hamilton  
- **Role**: Frontend Developer  
- **Email**: shamilton7@my.waketech.edu  

### Jisu Kim  
- **Role**: Frontend Developer  
- **Email**: jkim47@my.waketech.edu 

### Sha He  
- **Role**: Backend Developer  
- **Email**: shewtcc1@my.waketech.edu 

### Emma Johnson  
- **Role**: Backend Developer  
- **Email**: ekjohnson2@my.waketech.edu  

### Tyler Khin  
- **Role**: QA / Testing  
- **Email**: tekhin@my.waketech.edu  


## Project Setup

1. Clone the repository:
   ```
   git clone https://github.com/tgiversen/CSC289-Group9.git
   cd CSC289-Group9
     ```

2. Create and activate a virtual environment:
Mac/Linux:
```
python3 -m venv venv
source venv/bin/activate
```

Windows:
```
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows
```

3. Install Python (>=3.10) and verify installation

4. Install dependencies:
```
pip install -r requirements.txt
```

5. Set environment variables:
On Mac/Linux:
```
export FLASK_APP=run.py
export FLASK_ENV=development
export SECRET_KEY='dev-secret-key'   # Replace with a strong key
```

On Windows:
```
set FLASK_APP=run.py
set FLASK_ENV=development
set SECRET_KEY='dev-secret-key'   # Replace with a strong key
```

6. Initialize the Database (only after models are created)
```
(you only need to run the last command. ignore the first two commands.)
flask db init
flask db migrate -m "Initial migration"
flask db upgrade (you only need to run the last command.)
```
7. check database
```
sqlite3 instance/site.db
.tables
select * from user;
select * from reward;
select * from user_reward;
```

8. Run the application
```
flask run
```
The app will be available at: http://127.0.0.1:5000/api/

## Project name: Spinstorm (Slot Machine Game)

Spinstorm is a casino-style slot machine web application.
It uses Flask as the backend framework and provides APIs to manage spins, rewards, and user progress.
The game is powered by a randomized slot machine engine with reels, jackpots, free spins, and daily login rewards.
This is a full-stack project with frontend + backend + database integration.

### ✅ Features

- User authentication (Register/Login)  
- Spin reels and generate randomized outcomes  
- Display spin results (win/loss + payout)  
- Rewards system:  
  - Free spins  
  - Jackpot  
  - Bonus rewards  
  - Daily login rewards  
- Track user progress (XP, level-ups)  
- Save and display user balance  
- Reward animations and result UI (Frontend)  
- System tests for game flow and rewards  

### ✅ Project Type

This is a web-based full-stack application using Flask + Database.

### ✅ File Structure