from app.services.github.tree import (
    get_tree
)

from app.services.github.contents import (
    get_file
)


SUPPORTED_PROJECT_FILES = [

    "requirements.txt",

    "package.json",

    "pyproject.toml",

    "Dockerfile",

    "docker-compose.yml",

    "README.md"

]


def fetch_repository_files(
    owner: str,
    repository: str,
    branch: str
):
    """
    Fetch only important repository files
    needed for Repository Intelligence.
    """

    tree = get_tree(
        owner,
        repository,
        branch
    )

    if tree is None:
        return {}

    files = {}

    for item in tree.get("tree", []):

        path = item["path"]

        filename = path.split("/")[-1]

        if filename not in SUPPORTED_PROJECT_FILES:
            continue

        content = get_file(
            owner,
            repository,
            path
        )

        if content is not None:

            files[filename] = content

    return files