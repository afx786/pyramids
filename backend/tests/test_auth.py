import pytest


class TestAuth:
    def test_signup_success(self, client):
        response = client.post(
            "/auth/signup",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "password": "password123",
                "program": "Computer Science"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test User"
        assert data["email"] == "test@example.com"
        assert "id" in data

    def test_signup_duplicate_email(self, client):
        client.post(
            "/auth/signup",
            json={
                "name": "User One",
                "email": "dupe@example.com",
                "password": "password123"
            }
        )
        response = client.post(
            "/auth/signup",
            json={
                "name": "User Two",
                "email": "dupe@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 400

    def test_login_success(self, client):
        client.post(
            "/auth/signup",
            json={
                "name": "Login User",
                "email": "login@example.com",
                "password": "password123"
            }
        )
        response = client.post(
            "/auth/login",
            json={
                "email": "login@example.com",
                "password": "password123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client):
        response = client.post(
            "/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == 401

    def test_get_me_authenticated(self, client):
        signup_resp = client.post(
            "/auth/signup",
            json={
                "name": "Me User",
                "email": "me@example.com",
                "password": "password123"
            }
        )
        login_resp = client.post(
            "/auth/login",
            json={
                "email": "me@example.com",
                "password": "password123"
            }
        )
        token = login_resp.json()["access_token"]
        response = client.get(
            "/users/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert response.json()["email"] == "me@example.com"

    def test_get_me_unauthenticated(self, client):
        response = client.get("/users/me")
        assert response.status_code == 403
