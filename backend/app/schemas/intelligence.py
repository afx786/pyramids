from pydantic import BaseModel


class RepositoryAnalysisRequest(BaseModel):
    github_url: str


class RepositoryInfo(BaseModel):
    owner: str
    name: str
    description: str | None
    stars: int
    forks: int
    language: str | None
    default_branch: str
    private: bool


class RepositoryStatistics(BaseModel):
    total_files: int
    python_files: int
    javascript_files: int
    typescript_files: int
    docker_files: int
    workflow_files: int


class RepositoryAnalysisResponse(BaseModel):

    repository: RepositoryInfo

    languages: list[str]

    frameworks: list[str]

    libraries: list[str]

    databases: list[str]

    cloud: list[str]

    devops: list[str]

    files_analyzed: list[str]

    repository_statistics: RepositoryStatistics