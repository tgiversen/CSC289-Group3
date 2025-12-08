# Tyler Khin
# CSC289 - Group 9
# Creation Date: September 19th, 2025
# Latest Revision: December 8th, 2025
# test_routes.py: Unit/Integration tests for routes


# -------------------------
# tests the ping route
# -------------------------
def test_ping(client):
    response = client.get("/api/ping")
    assert response.status_code == 200


# -------------------------
# Auth routes
# -------------------------


# tests the register route
def test_register_user(client):
    response = client.post(
        "/api/register",
        json={
            "username": "John Cena",
            "email": "johncena@test.com",
            "password": "123456",
        },
    )
    assert response.status_code == 201


# tests the login route
def test_login_missing_user(user_client):
    # mssing field
    response = user_client.post(
        "/api/login",
        json={"email": "test@example.com"},
        follow_redirects=True,
    )
    assert response.status_code == 400


def test_login_wrong_user(user_client):
    # wrong input
    response = user_client.post(
        "/api/login",
        json={"email": "wrong@example", "password": "testpassword"},
        follow_redirects=True,
    )
    assert response.status_code == 401


def test_login_user(user_client):
    # normal login
    response = user_client.post(
        "/api/login",
        json={"email": "test@example.com", "password": "testpassword"},
        follow_redirects=True,
    )
    assert response.status_code == 200


# tests the logout route
def test_logout_user(user_client):
    response = user_client.post(
        "/api/login",
        json={"email": "test@example.com", "password": "testpassword"},
        follow_redirects=True,
    )
    response = user_client.post("/api/logout")
    assert response.status_code == 200


# -------------------------
# User info routes
# -------------------------


# tests the balance route
def test_get_balance(user_client):
    # normal response
    response = user_client.get("/api/balance/testuser")
    assert response.status_code == 200


def test_get_balance_wrong_user(user_client):
    # wrong user
    response = user_client.get("/api/balance/wronguser")
    assert response.status_code == 404


# tests the reward history route
def test_get_rewards_no_rewards(user_client):
    # no rewards
    response = user_client.get("/api/rewards/testuser")
    assert response.status_code == 200


def test_get_rewards_wrong_user(user_client):
    # wrong user
    response = user_client.get("/api/rewards/wronguser")
    assert response.status_code == 404


def test_get_rewards_with_rewards(reward_client):
    # with rewards
    response = reward_client.get("/api/rewards/luckyuser")
    assert response.status_code == 200


# -------------------------
# Game routes
# -------------------------


# tests the spin route
def test_spin(user_client):
    # regular spins
    for i in range(1, 20):
        response = user_client.post(
            "/api/spin",
            json={"username": "testuser", "bet": 5},
            follow_redirects=True,
        )
        assert response.status_code == 200


def test_spin_wrong_user(user_client):
    # wrong user name
    response = user_client.post(
        "/api/spin",
        json={"username": "wronguser", "bet": 10},
        follow_redirects=True,
    )
    assert response.status_code == 404


# tests the free spin route
def test_free_spins(reward_client):
    # regular free spins
    for i in range(1, 20):
        response = reward_client.post(
            "/api/free-spins",
            json={"username": "luckyuser", "bet": 5},
            follow_redirects=True,
        )
        assert response.status_code == 200


def test_free_spins_wrong_user(user_client):
    # wrong user name
    response = user_client.post(
        "/api/free-spins",
        json={"username": "wronguser"},
        follow_redirects=True,
    )
    assert response.status_code == 404


def test_free_spins_no_free_spins(user_client):
    # no free spin
    response = user_client.post(
        "/api/free-spins",
        json={"username": "testuser"},
        follow_redirects=True,
    )
    assert response.status_code == 400


# -------------------------
# Rewards system routes
# -------------------------


# tests the daily reward route
def test_daily_reward(reward_client):
    # daily reward not claimed
    response = reward_client.post(
        "/api/daily-reward",
        json={"username": "luckyuser"},
        follow_redirects=True,
    )
    assert response.status_code == 200


def test_daily_reward_wrong_user(reward_client):
    # wrong user
    response = reward_client.post(
        "/api/daily-reward",
        json={"username": "wronguser"},
        follow_redirects=True,
    )
    assert response.status_code == 404


def test_daily_reward_already_claimed(reward_client):
    # claim daily reward
    response = reward_client.post(
        "/api/daily-reward",
        json={"username": "luckyuser"},
        follow_redirects=True,
    )
    # daily reward already claimed
    response = reward_client.post(
        "/api/daily-reward",
        json={"username": "luckyuser"},
        follow_redirects=True,
    )
    assert response.status_code == 404


# tests the other rewards route with no rewards
def test_no_rewards(user_client):
    # response with no rewards
    response = user_client.get("/api/rewards")
    assert response.status_code == 200


# tests the other rewards route with rewards present
def test_some_rewards(reward_client):
    # response with rewards
    response = reward_client.get("/api/rewards")
    assert response.status_code == 200


# -------------------------
# Virtual Currency routes
# -------------------------


# tests the buy coins route
def test_buy_coins(user_client):
    # normal response
    response = user_client.post(
        "/api/buy-coins",
        json={"username": "testuser", "amount": 100},
        follow_redirects=True,
    )
    assert response.status_code == 200


def test_buy_coins_wrong_user(user_client):
    # wrong user
    response = user_client.post(
        "/api/buy-coins",
        json={"username": "wronguser", "amount": 100},
        follow_redirects=True,
    )
    assert response.status_code == 404


def test_buy_coins_missing_fields(user_client):
    # missing username or amount
    response = user_client.post(
        "/api/buy-coins",
        json={"username": "testuser"},
        follow_redirects=True,
    )
    assert response.status_code == 400
