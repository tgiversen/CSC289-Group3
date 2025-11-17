- sha he
- CSC289 - Group 3
- September 24th, 2025 updated
# Project Structure：
```
backend/
│── app/
│   ├── __init__.py        # Flask app factory & register Blueprint
│   ├── models.py          # Database models(User, Reward, UserReward)
│   ├── forms.py           # Form validation(RegisterForm, LoginForm)
│   ├── routes.py          # All API routes(Blueprint = main)
│   └── game_logic.py      # Slot machine core logic (random number RNG, winning judgment)
│
├── migrations/            # Database migrations(flask db init/migrate/upgrade)
├── venv/                  # Virtual environment
├── run.py                 # Application entry point
├── config.py              # Configuration file (DB URI, SECRET_KEY)
|── README.md              # Project set up
└── requirements.txt       # python dependencies

```
### Notes
- `app/` contains all core backend logic.  
- `migrations/` will be auto-generated when you run Flask-Migrate.  
- `venv/` is local only (never commit to Git). Always activate your venv before running the app.
- `run.py` is used to start the app.  
- `requirements.txt` ensures consistent dependencies across teammates. Update requirements.txt when new packages are installed:
    ```
    pip freeze > requirements.txt

    ```
- Frontend (React) should call backend APIs via routes defined in routes.py.

### API Endpoint Overview

| Method | Endpoint                   | Description                                   | Status   |
|--------|-----------------------------|-----------------------------------------------|----------|
| POST   | `/api/register`             | Register a new user (username, email, password) | ✅ Done  |
| POST   | `/api/login`                | User login, returns balance info               | ✅ Done  |
| POST   | `/api/logout`               | User logout                                    | ✅ Done  |
| GET    | `/api/balance/<username>`   | Get user balance by username                   | ✅ Done  |
| GET    | `/api/rewards/<username>`   | Get a user's reward history                    | ⏳ To Do |
| POST   | `/api/spin`                 | Spin the slot machine (bet, result, payout)    | ⏳ To Do |
| POST   | `/api/daily-reward`         | Claim daily login reward                       | ⏳ To Do |
| GET    | `/api/rewards`              | List all available rewards                     | ⏳ To Do |
| POST   | `/api/buy-coins`            | Buy virtual coins (increase balance)           | ⏳ To Do |
| POST   | `/api/exchange`             | Exchange coins for rewards / bonus             | ⏳ To Do |
