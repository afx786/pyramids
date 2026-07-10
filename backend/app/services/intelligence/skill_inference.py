from app.services.intelligence.skill_mappings import (
    SKILL_MAPPINGS
)


def infer_skills(technologies: dict):

    inferred = []

    for skill, mapping in SKILL_MAPPINGS.items():

        evidence = []

        confidence_scores = []

        for category, values in mapping.items():

            detected = technologies.get(
                category,
                []
            )

            # Build lookup from detected technologies
            detected_lookup = {
                tech["name"]: tech
                for tech in detected
            }

            for value in values:

                if value in detected_lookup:

                    tech = detected_lookup[value]

                    evidence.append({
                        "technology": tech["name"],
                        "confidence": tech["confidence"]
                    })

                    confidence_scores.append(
                        tech["confidence"]
                    )

        if evidence:

            confidence = round(
                sum(confidence_scores) /
                len(confidence_scores)
            )

            inferred.append({

                "skill": skill,

                "confidence": confidence,

                "evidence": [
                    item["technology"]
                    for item in evidence
                ]

            })

    inferred.sort(

        key=lambda x: x["confidence"],

        reverse=True

    )

    return inferred