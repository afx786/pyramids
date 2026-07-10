from app.services.github.client import GitHubClient


client = GitHubClient()


def get_file(
    owner,
    repo,
    path
):

    return client.get(
        f"/repos/{owner}/{repo}/contents/{path}"
    )