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


class TechnologyEvidence(BaseModel):
    name: str
    confidence: int
    evidence: list[str]


class VerifiedSkill(BaseModel):
    skill: str
    confidence: int
    evidence: list[str]


class RepositoryAnalysisResponse(BaseModel):

    repository: RepositoryInfo

    languages: list[str]

    frameworks: list[TechnologyEvidence]

    libraries: list[TechnologyEvidence]

    databases: list[TechnologyEvidence]

    cloud: list[TechnologyEvidence]

    devops: list[TechnologyEvidence]

    files_analyzed: list[str]

    repository_statistics: RepositoryStatistics

    verified_skills: list[VerifiedSkill]