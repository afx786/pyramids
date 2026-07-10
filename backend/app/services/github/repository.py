from app.services.github.client import GitHubClient


client = GitHubClient()


def get_repository(
    owner: str,
    repo: str
):

    return client.get(
        f"/repos/{owner}/{repo}"
    )