from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.deps import get_db

from app.schemas.search import (
    UserSearchResponse
)

from app.services.search_service import (
    search_users_by_skill,
    search_users_by_name,
    search_users_by_rank,
    unified_search
)
from app.services.pagination import paginate_list
from app.services.search_service import (

    search_users_by_skill,

    search_users_by_name,

    search_users_by_rank,

    search_users_by_branch,

    search_users_by_domain,

    unified_search

)

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)


@router.get("/users")
def search_users(
    skill: str | None = None,
    public_id: str | None = None,
    db: Session = Depends(get_db),
    limit: int | None = None,
    offset: int = 0,
    sort: str = "newest"
):
    if public_id:
        from app.models.user import User
        from sqlalchemy import func
        user = db.query(User).filter(func.upper(User.public_id) == public_id.strip().upper()).first()
        results = [{
            "id": user.id,
            "name": user.name,
            "username": user.username,
            "profile_picture": user.profile_picture,
            "headline": user.headline,
            "public_id": user.public_id
        }] if user else []
    else:
        results = search_users_by_skill(
            db,
            skill
        )

    if limit is None:
        return results

    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": {**meta, "sort": sort}}


@router.get("/users/by-name")
def search_by_name(
    name: str,
    db: Session = Depends(get_db),
    limit: int | None = None,
    offset: int = 0,
    sort: str = "newest"
):
    results = search_users_by_name(
        db,
        name
    )

    if sort == "highest_rank":
        results = sorted(results, key=lambda item: item["points"], reverse=True)

    if limit is None:
        return results

    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": {**meta, "sort": sort}}


@router.get("/users/by-rank")
def search_by_rank(
    rank: str,
    db: Session = Depends(get_db),
    limit: int | None = None,
    offset: int = 0,
    sort: str = "newest"
):
    results = search_users_by_rank(
        db,
        rank
    )

    if sort == "highest_rank":
        results = sorted(results, key=lambda item: item["points"], reverse=True)

    if limit is None:
        return results

    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": {**meta, "sort": sort}}

@router.get("")
def global_search(
    q: str,
    db: Session = Depends(get_db),
    limit: int | None = None,
    offset: int = 0,
    sort: str = "newest"
):
    results = unified_search(
        db=db,
        query=q
    )

    if limit is None:
        return results

    paginated = {}

    for key, value in results.items():
        items, meta = paginate_list(value, limit, offset)
        paginated[key] = {
            "items": items,
            "meta": {
                **meta,
                "sort": sort
            }
        }

    return paginated


@router.get("/users/by-branch")
def search_by_branch(

    branch: str,

    db: Session = Depends(get_db),

    limit: int | None = None,

    offset: int = 0,

    sort: str = "newest"

):

    results = search_users_by_branch(

        db,

        branch

    )

    if limit is None:
        return results

    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": {**meta, "sort": sort}}


@router.get("/users/by-domain")
def search_by_domain(

    domain: str,

    db: Session = Depends(get_db),

    limit: int | None = None,

    offset: int = 0,

    sort: str = "newest"

):

    results = search_users_by_domain(

        db,

        domain

    )

    if limit is None:
        return results

    items, meta = paginate_list(results, limit, offset)
    return {"items": items, "meta": {**meta, "sort": sort}}
