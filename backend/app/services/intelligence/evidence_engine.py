def add_evidence(
    technology: str,
    filename: str,
    confidence: int,
    evidence: dict
):
    """
    Adds evidence for a detected technology.
    """

    if technology not in evidence:

        evidence[technology] = {

            "confidence": 0,

            "sources": []

        }

    evidence[technology]["confidence"] = max(

        evidence[technology]["confidence"],

        confidence

    )

    evidence[technology]["sources"].append(
        filename
    )