from app.services.intelligence.ignore_patterns import (
    IGNORE_DIRECTORIES,
    IGNORE_FILES
)


def should_ignore(
    path: str
):

    parts = path.split("/")

    for part in parts:

        if part in IGNORE_DIRECTORIES:

            return True

    filename = parts[-1]

    if filename in IGNORE_FILES:

        return True

    return False