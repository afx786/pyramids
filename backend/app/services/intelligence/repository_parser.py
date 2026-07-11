from app.services.github.tree import (
    get_tree
)

from app.services.github.contents import (
    get_file
)
from app.services.intelligence.ignore_engine import (
    should_ignore
)

SUPPORTED_PROJECT_FILES = {

    "requirements.txt",

    "pyproject.toml",

    "package.json",

    "Dockerfile",

    "docker-compose.yml",

    "README.md"

}


SUPPORTED_SOURCE_EXTENSIONS = {

    ".py",

    ".js",

    ".jsx",

    ".ts",

    ".tsx",
    
    ".sql"
    
    ".java",

    ".go",

    ".rs",

    ".cpp",

    ".c"

}
MAX_SOURCE_FILES = 100

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
    source_files = 0

    for item in tree.get("tree", []):

        # Ignore directories
        if item.get("type") != "blob":
            continue

        path = item["path"]
        
        if should_ignore(path):
            continue

        filename = path.split("/")[-1]

        extension = ""

        if "." in filename:
            extension = "." + filename.split(".")[-1]
 
        if (
            filename not in SUPPORTED_PROJECT_FILES
            and extension not in SUPPORTED_SOURCE_EXTENSIONS
        ):
            continue

        content = get_file(
            owner,
            repository,
            path
        )

        if content:

           files[path] = content

           if extension in SUPPORTED_SOURCE_EXTENSIONS:

               source_files += 1

               if source_files >= MAX_SOURCE_FILES:

                   break
        
        

    return files