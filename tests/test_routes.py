# Tyler Khin
# CSC289 - Group 9
# September 19th, 2025
# test_routes.py: Unit/Integration tests for routes


# Tests the homepage route
def test_homepage_loads(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"Hello Spinstorm!" in response.data
