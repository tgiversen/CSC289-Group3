"""
Quick test to verify database migration and models are working.
"""
from app import create_app, db
from app.models import User

app = create_app()

with app.app_context():
    # 1. Create a new user
    new_user = User(username="testuser", email="test@example.com")
    new_user.set_password("password123")
    db.session.add(new_user)
    db.session.commit()
    print("User created:", new_user.username, new_user.email)

    # 2. Query the user back
    user = User.query.filter_by(username="testuser").first()
    if user:
        print("User fetched from DB:", user.username, "Balance:", user.balance)
    else:
        print("User not found in DB")