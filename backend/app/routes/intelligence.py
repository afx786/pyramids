from fastapi import (
    APIRouter,
    HTTPException
)

from app.schemas.intelligence import (
    RepositoryAnalysisRequest,
    RepositoryAnalysisResponse
)

from app.services.github_service import (
    extract_repo
)

from app.services.intelligence.orchestrator import (
    analyze_repository
)

router = APIRouter(
    prefix="/intelligence",
    tags=["Repository Intelligence"]
)


@router.post(
    "/analyze",
    response_model=RepositoryAnalysisResponse
)
def analyze(
    data: RepositoryAnalysisRequest
):

    repo = extract_repo(
        data.github_url
    )

    if repo is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid GitHub URL."
        )

    owner, repository = repo

    result = analyze_repository(
        owner,
        repository
    )

    # These checks MUST be inside the function
    if result == "rate_limit":
        raise HTTPException(
            status_code=429,
            detail="GitHub API rate limit exceeded."
        )

    if result == "repository_not_found":
        raise HTTPException(
            status_code=404,
            detail="Repository not found."
        )

    if result == "github_error":
        raise HTTPException(
            status_code=502,
            detail="GitHub API unavailable."
        )

    return result