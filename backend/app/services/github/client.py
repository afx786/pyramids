import requests


class GitHubClient:

    BASE_URL = "https://api.github.com"

    def __init__(self):

        self.headers = {
            "Accept": "application/vnd.github+json"
        }

    def get(
        self,
        endpoint: str
    ):

        response = requests.get(
            f"{self.BASE_URL}{endpoint}",
            headers=self.headers
        )

        if response.status_code != 200:
            return None

        return response.json()