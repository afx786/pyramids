from app.services.github.tree import (
    get_tree
)

from app.services.github.contents import (
    get_file
)


SUPPORTED_PROJECT_FILES = {

    "requirements.txt",

    "package.json",

    "pyproject.toml",

    "Dockerfile",

    "docker-compose.yml",

    "README.md"

}


def fetch_repository_files(
    owner: str,
    repository: str,
    branch: str
):
    """
    Fetch all important project files from the repository,
    regardless of which folder they are located in.
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

        # Ignore directories
        if item.get("type") != "blob":
            continue

        path = item["path"]

        filename = path.split("/")[-1]

        if filename not in SUPPORTED_PROJECT_FILES:
            continue

        content = get_file(
            owner,
            repository,
            path
        )

        if content:

            # Store the FULL PATH instead of only the filename
            files[path] = content

    return files