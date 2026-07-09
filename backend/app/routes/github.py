from fastapi import (
    APIRouter,
    HTTPException
)

from app.schemas.github import (
    GitHubRepositoryRequest,
    GitHubRepositoryResponse
)

from app.services.github_service import (
    fetch_repository
)

router = APIRouter(

    prefix="/github",

    tags=["GitHub"]

)


@router.post(

    "/repository",

    response_model=GitHubRepositoryResponse

)
def analyze_repository(

    data: GitHubRepositoryRequest

):

    result = fetch_repository(

        data.github_url

    )

    if result == "invalid_url":

        raise HTTPException(

            status_code=400,

            detail="Invalid GitHub URL"

        )

    if result == "not_found":

        raise HTTPException(

            status_code=404,

            detail="Repository not found"

        )

    return result