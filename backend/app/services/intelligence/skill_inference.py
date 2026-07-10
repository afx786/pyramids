from app.services.intelligence.skill_mappings import (
    SKILL_MAPPINGS
)


def infer_skills(technologies: dict):

    inferred = []

    for skill, mapping in SKILL_MAPPINGS.items():

        evidence = []

        score = 0

        for category, values in mapping.items():

            detected = technologies.get(
                category,
                []
            )

            matches = [
                value
                for value in values
                if value in detected
            ]

            if matches:

                evidence.extend(matches)

                score += len(matches)

        if evidence:

            confidence = min(
                100,
                60 + score * 15
            )

            inferred.append({

                "skill": skill,

                "confidence": confidence,

                "evidence": evidence

            })

    inferred.sort(

        key=lambda x: x["confidence"],

        reverse=True

    )

    return inferred