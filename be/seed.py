from app import create_app, db
from app.models import User

app = create_app()

with app.app_context():
    # clear data
    db.drop_all()
    db.create_all()

    # input user
    user1 = User(username="alice", email="alice@example.com")
    user1.set_password("123456")

    user2 = User(username="bob", email="bob@example.com")
    user2.set_password("password")

    # input rewards
   

    db.session.add_all([user1, user2])
    db.session.commit()

    print("Database seeded successfully!")