from app.services.github.client import GitHubClient


client = GitHubClient()


def get_tree(
    owner,
    repo,
    branch
):

    return client.get(
        f"/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
    )