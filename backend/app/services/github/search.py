from app.services.github.client import GitHubClient


client = GitHubClient()


def search_code(
    query: str
):

    return client.get(
        f"/search/code?q={query}"
    )