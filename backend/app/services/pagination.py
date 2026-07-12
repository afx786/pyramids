from sqlalchemy import asc, desc


def normalize_pagination(
    limit: int = 20,
    offset: int = 0
):
    limit = max(
        1,
        min(limit, 100)
    )

    offset = max(
        0,
        offset
    )

    return limit, offset


def apply_created_sort(
    query,
    model,
    sort: str = "newest"
):
    if sort == "oldest":
        return query.order_by(
            asc(model.created_at)
        )

    return query.order_by(
        desc(model.created_at)
    )


def paginate_query(
    query,
    limit: int,
    offset: int
):
    limit, offset = normalize_pagination(
        limit,
        offset
    )

    total = query.count()

    items = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    return items, {
        "total": total,
        "limit": limit,
        "offset": offset
    }


def paginate_list(
    items: list,
    limit: int,
    offset: int
):
    limit, offset = normalize_pagination(
        limit,
        offset
    )

    return items[offset:offset + limit], {
        "total": len(items),
        "limit": limit,
        "offset": offset
    }
