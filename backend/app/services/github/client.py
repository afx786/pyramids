import os
import requests

from dotenv import load_dotenv

load_dotenv()


class GitHubClient:

    BASE_URL = "https://api.github.com"

    def __init__(self):

        token = os.getenv("GITHUB_TOKEN")

        self.headers = {
            "Accept": "application/vnd.github+json"
        }

        if token:
            self.headers["Authorization"] = f"Bearer {token}"

    def get(
        self,
        endpoint: str
    ):

        response = requests.get(
            f"{self.BASE_URL}{endpoint}",
            headers=self.headers
        )

        if response.status_code == 200:
            return response.json()

        if response.status_code == 403:
            return "rate_limit"

        if response.status_code == 404:
            return "not_found"

        return "github_error"