def collect_evidence(
    technology,
    filepath,
    confidence,
    evidence
):

    if technology not in evidence:

        evidence[technology]={

            "confidence":0,

            "sources":[]

        }

    evidence[technology]["confidence"]=max(

        evidence[technology]["confidence"],

        confidence

    )

    evidence[technology]["sources"].append(

        filepath

    )