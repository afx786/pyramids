def calculate_confidence(
    evidence: dict
):
    """
    Converts raw evidence into confidence scores.
    """

    results = []

    for technology, info in evidence.items():

        results.append({

            "technology": technology,

            "confidence": info["confidence"],

            "evidence": info["sources"]

        })

    results.sort(

        key=lambda x: x["confidence"],

        reverse=True

    )

    return results