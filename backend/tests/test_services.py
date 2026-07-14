import pytest
from unittest.mock import MagicMock, patch


class TestAuthService:
    def test_password_hashing(self):
        from app.core.security import hash_password, verify_password

        hashed = hash_password("testpass123")
        assert hashed != "testpass123"
        assert verify_password("testpass123", hashed)
        assert not verify_password("wrongpass", hashed)

    def test_jwt_token_flow(self):
        from app.core.auth import create_access_token, decode_token

        token = create_access_token({"user_id": 1})
        assert token is not None

        payload = decode_token(token)
        assert payload["user_id"] == 1

    def test_invalid_token(self):
        from app.core.auth import decode_token
        from jose import JWTError

        with pytest.raises(Exception):
            decode_token("invalid.token.here")


class TestRankService:
    def test_get_user_rank_explorer(self):
        from app.services.rank_service import get_rank_from_points

        assert get_rank_from_points(0) == "Explorer"
        assert get_rank_from_points(25) == "Explorer"
        assert get_rank_from_points(49) == "Explorer"

    def test_get_user_rank_builder(self):
        from app.services.rank_service import get_rank_from_points

        assert get_rank_from_points(50) == "Builder"
        assert get_rank_from_points(75) == "Builder"
        assert get_rank_from_points(99) == "Builder"

    def test_get_user_rank_creator(self):
        from app.services.rank_service import get_rank_from_points

        assert get_rank_from_points(100) == "Creator"
        assert get_rank_from_points(150) == "Creator"
        assert get_rank_from_points(199) == "Creator"

    def test_get_user_rank_architect(self):
        from app.services.rank_service import get_rank_from_points

        assert get_rank_from_points(200) == "Architect"
        assert get_rank_from_points(300) == "Architect"
        assert get_rank_from_points(399) == "Architect"

    def test_get_user_rank_pyramidion(self):
        from app.services.rank_service import get_rank_from_points

        assert get_rank_from_points(400) == "Pyramidion"
        assert get_rank_from_points(1000) == "Pyramidion"


class TestPaginationService:
    def test_normalize_pagination_clamps_values(self):
        from app.services.pagination import normalize_pagination

        limit, offset = normalize_pagination(0, -1)
        assert limit == 1
        assert offset == 0

        limit, offset = normalize_pagination(500, 100)
        assert limit == 100
        assert offset == 100

    def test_paginate_list(self):
        from app.services.pagination import paginate_list

        items = list(range(100))
        result, meta = paginate_list(items, 10, 0)
        assert len(result) == 10
        assert result == [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        assert meta["total"] == 100
        assert meta["limit"] == 10
        assert meta["offset"] == 0

        result, meta = paginate_list(items, 10, 95)
        assert len(result) == 5
        assert result == [95, 96, 97, 98, 99]
