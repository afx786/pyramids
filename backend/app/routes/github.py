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
    "/analyze",
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
            detail="Invalid GitHub repository URL."
        )

    if result == "private_or_not_found":
        raise HTTPException(
            status_code=404,
            detail=(
                "Repository not found or is private. "
                "Currently Pyramids can analyze only public GitHub repositories."
            )
        )

    if result == "github_error":
        raise HTTPException(
            status_code=502,
            detail="GitHub API temporarily unavailable."
        )

    return result