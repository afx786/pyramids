from app.services.github.client import GitHubClient


client = GitHubClient()


def get_languages(
    owner,
    repo
):

    return client.get(
        f"/repos/{owner}/{repo}/languages"
    )