from pydantic import BaseModel


class GitHubRepositoryRequest(BaseModel):
    github_url: str


class GitHubRepositoryResponse(BaseModel):

    owner: str

    repository: str

    description: str | None

    stars: int

    forks: int

    language: str | None

    default_branch: str

    private: bool