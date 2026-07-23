import pytest


def _auth_header(client):
    client.post(
        "/auth/signup",
        json={
            "name": "Pagination User",
            "email": "pagination@example.com",
            "password": "password123"
        }
    )
    resp = client.post(
        "/auth/login",
        json={
            "email": "pagination@example.com",
            "password": "password123"
        }
    )
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


class TestPagination:
    def test_teams_pagination(self, client):
        headers = _auth_header(client)
        response = client.get("/teams?limit=5&offset=0", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "meta" in data

    def test_teams_no_pagination(self, client):
        headers = _auth_header(client)
        response = client.get("/teams", headers=headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_opportunities_pagination(self, client):
        response = client.get("/opportunities?limit=5&offset=0")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "meta" in data

    def test_research_pagination(self, client):
        response = client.get("/research?limit=5&offset=0")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "meta" in data

    def test_research_no_pagination(self, client):
        response = client.get("/research")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_bookmarks_pagination(self, client):
        headers = _auth_header(client)
        response = client.get("/bookmarks?limit=5&offset=0", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "meta" in data

    def test_connections_pagination(self, client):
        headers = _auth_header(client)
        response = client.get("/connections?limit=5&offset=0", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "meta" in data

    def test_leaderboard_pagination(self, client):
        response = client.get("/leaderboard?limit=5&offset=0")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "meta" in data
