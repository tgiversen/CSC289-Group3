# Tyler Khin
# CSC289 - Group 9
# Creation Date: September 19th, 2025
# Latest Revision: October 3rd, 2025
# test_routes.py: Unit/Integration tests for routes

# tests the ping route
def test_ping(client):
    response = client.get('/api/ping')
    assert response.status_code == 200

# tests the register route
def test_register_user(client):
    response = client.post('/api/register', json={"username":"John Cena", "email":"johncena@test.com", "password":"123456"})
    assert response.status_code == 201

# tests the login route
def test_login_user(user_client):
    response = user_client.post("/api/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    }, follow_redirects=True)
    assert response.status_code == 200

# tests the balance route
def test_get_balance(user_client):
    response = user_client.get('/api/balance/testuser')
    assert response.status_code == 200

# tests the logout route
def test_logout_user(user_client):
    response = user_client.post("/api/login", json={
        "email": "test@example.com",
        "password": "testpassword"
    }, follow_redirects=True)
    response = user_client.post('/api/logout')
    assert response.status_code == 200

