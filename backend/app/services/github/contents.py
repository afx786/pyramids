import base64

from app.services.github.client import (
    GitHubClient
)

client = GitHubClient()


def get_file(
    owner: str,
    repo: str,
    path: str
):
    """
    Returns the decoded contents of a file
    from a GitHub repository.
    """

    data = client.get(
        f"/repos/{owner}/{repo}/contents/{path}"
    )

    if data is None:
        return None

    if "content" not in data:
        return None

    try:

        content = base64.b64decode(
            data["content"]
        ).decode(
            "utf-8",
            errors="ignore"
        )

        return content

    except Exception:

        return None