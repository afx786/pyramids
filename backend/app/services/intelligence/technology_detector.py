from app.services.intelligence.technology_patterns import (
    TECHNOLOGY_PATTERNS
)


def contains_any(
    text: str,
    patterns: list[str]
):
    """
    Checks whether any pattern exists in the text.
    """

    text = text.lower()

    for pattern in patterns:

        if pattern.lower() in text:
            return True

    return False


def get_confidence(
    filepath: str,
    confidence_map: dict
):
    """
    Returns confidence based on the file where
    the technology was detected.
    """

    filename = filepath.split("/")[-1]

    if filename in confidence_map:
        return confidence_map[filename]

    extension = "." + filepath.split(".")[-1]

    if extension in confidence_map:
        return confidence_map[extension]

    return 25


def detect_category(
    files: dict,
    category: str
):

    detected = []

    technologies = TECHNOLOGY_PATTERNS[
        category
    ]

    for technology, config in technologies.items():

        evidence = []

        highest_confidence = 0

        for filepath, content in files.items():

            if contains_any(
                content,
                config["patterns"]
            ):

                confidence = get_confidence(
                    filepath,
                    config["confidence"]
                )

                highest_confidence = max(
                    highest_confidence,
                    confidence
                )

                evidence.append(filepath)

        if evidence:

            detected.append({

                "name": technology,

                "confidence": highest_confidence,

                "evidence": evidence

            })

    detected.sort(
        key=lambda x: x["confidence"],
        reverse=True
    )

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