from app.services.github.repository import (
    get_repository
)

from app.services.github.languages import (
    get_languages
)

from app.services.intelligence.repository_parser import (
    fetch_repository_files
)

from app.services.intelligence.technology_detector import (
    detect_technologies
)

from app.services.github.tree import get_tree

from app.services.github.tree import (
    get_tree
)
from app.services.intelligence.skill_inference import (
    infer_skills
)
def calculate_repository_statistics(
    tree_paths: list[str]
):
    return {

        "total_files": len(tree_paths),

        "python_files": sum(
            path.endswith(".py")
            for path in tree_paths
        ),

        "javascript_files": sum(
            path.endswith(".js")
            for path in tree_paths
        ),

        "typescript_files": sum(
            path.endswith(".ts") or path.endswith(".tsx")
            for path in tree_paths
        ),

        "docker_files": sum(
            "docker" in path.lower()
            for path in tree_paths
        ),

        "workflow_files": sum(
            path.startswith(".github/workflows")
            for path in tree_paths
        )
    }


def analyze_repository(
    owner: str,
    repository: str
):

    repo = get_repository(
        owner,
        repository
    )

    if repo == "rate_limit":
        return "rate_limit"

    if repo == "not_found":
        return "repository_not_found"

    if repo == "github_error":
        return "github_error"
    branch = repo["default_branch"]

    languages = get_languages(
        owner,
        repository
    ) or {}
    
    tree = get_tree(
        owner,
        repository,
        branch
    )

    tree_paths = []

    if tree and "tree" in tree:

        tree_paths = [
            item["path"]
            for item in tree["tree"]
        ]

    files = fetch_repository_files(
        owner,
        repository,
        branch
    )

    technologies = detect_technologies(
        files,
        languages
    )
    skills = infer_skills(
        technologies
    )

    statistics = calculate_repository_statistics(
        tree_paths
    )

    return {

        "repository": {

            "owner": owner,

            "name": repository,

            "description": repo.get(
                "description"
            ),

            "stars": repo.get(
                "stargazers_count"
            ),

            "forks": repo.get(
                "forks_count"
            ),

            "language": repo.get(
                "language"
            ),

            "default_branch": branch,

            "private": repo.get(
                "private"
            )

        },

        "languages": technologies[
            "languages"
        ],

        "frameworks": technologies[
            "frameworks"
        ],

        "libraries": technologies[
            "libraries"
        ],

        "databases": technologies[
            "databases"
        ],

        "cloud": technologies[
            "cloud"
        ],

        "devops": technologies[
            "devops"
        ],

        "files_analyzed": list(
            files.keys()
        ),

        "repository_statistics": statistics,
        "verified_skills": skills,
    }