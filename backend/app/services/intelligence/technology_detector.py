from app.services.intelligence.technology_patterns import (
    TECHNOLOGY_PATTERNS
)
def contains_any(
    text: str,
    patterns: list[str]
):

    text = text.lower()

    for pattern in patterns:

        if pattern.lower() in text:

            return True

    return False
def detect_category(
    files: dict,
    category: str
):

    detected = []

    technologies = TECHNOLOGY_PATTERNS[
        category
    ]

    for technology, patterns in technologies.items():

        for content in files.values():

            if contains_any(
                content,
                patterns
            ):

                detected.append(
                    technology
                )

                break

    return detected
def detect_technologies(
    files: dict,
    languages: dict
):

    return {

        "languages": list(
            languages.keys()
        ),

        "frameworks": detect_category(
            files,
            "frameworks"
        ),

        "libraries": detect_category(
            files,
            "libraries"
        ),

        "databases": detect_category(
            files,
            "databases"
        ),

        "cloud": detect_category(
            files,
            "cloud"
        ),

        "devops": detect_category(
            files,
            "devops"
        )

    }