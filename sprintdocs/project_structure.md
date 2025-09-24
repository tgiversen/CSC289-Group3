# Project Structure：
```
backend/
│── app/
│   ├── __init__.py        # Flask app factory & register Blueprint
│   ├── models.py          # Database models(User, Reward, UserReward)
│   ├── forms.py           # Form validation(RegisterForm, LoginForm)
│   ├── routes.py          # All API routes(Blueprint = main)
│   └── ...
│
├── migrations/            # Database migrations(flask db init/migrate/upgrade)
├── venv/                  # Virtual environment
├── run.py                 # Application entry point
├── config.py              # Configuration file (DB URI, SECRET_KEY)
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

| Method | Endpoint                | Description                                |
|--------|--------------------------|--------------------------------------------|
| POST   | `/api/register`          | Register a new user (username, email, password) |
| POST   | `/api/login`             | User login, returns balance info           |
| POST   | `/api/logout`            | User logout                                |
| GET    | `/api/balance/<username>`| Get user balance by username               |
| GET    | `/api/rewards/<username>`| Get a user's reward history                |
| POST   | `/api/spin`              | Spin the slot machine (bet, result, payout)|
| POST   | `/api/daily-reward`      | Claim daily login reward                   |
| GET    | `/api/rewards`           | List all available rewards                 |
