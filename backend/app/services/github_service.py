import requests


def extract_repo(url: str):

    url = url.rstrip("/")

    parts = url.split("/")

    if len(parts) < 5:
        return None

    owner = parts[-2]

    repo = parts[-1]

    return owner, repo


def fetch_repository(url: str):

    repo = extract_repo(url)

    if not repo:
        return "invalid_url"

    owner, repository = repo

    response = requests.get(

        f"https://api.github.com/repos/{owner}/{repository}"

    )

    if response.status_code != 200:

        return "not_found"

    data = response.json()

    return {

        "owner": owner,

        "repository": repository,

        "description": data.get("description"),

        "stars": data.get("stargazers_count"),

        "forks": data.get("forks_count"),

        "language": data.get("language"),

        "default_branch": data.get("default_branch"),

        "private": data.get("private")

    }