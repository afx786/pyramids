def score_repository_analysis(
    analysis: dict
):
    statistics = analysis.get(
        "repository_statistics",
        {}
    )

    files = [
        path.lower()
        for path in analysis.get("files_analyzed", [])
    ]

    detected_count = sum([
        len(analysis.get("frameworks", [])),
        len(analysis.get("libraries", [])),
        len(analysis.get("databases", [])),
        len(analysis.get("cloud", [])),
        len(analysis.get("devops", []))
    ])

    def has_any(names):
        return any(
            any(name in path for name in names)
            for path in files
        )

    categories = {
        "readme": 100 if has_any(["readme"]) else 0,
        "documentation": 100 if has_any(["docs/", "documentation"]) else 40,
        "tests": 100 if has_any(["test", "spec"]) else 0,
        "ci_cd": 100 if statistics.get("workflow_files", 0) else 0,
        "project_structure": min(
            100,
            statistics.get("total_files", 0) * 2
        ),
        "framework_usage": min(
            100,
            detected_count * 20
        ),
        "dependency_management": 100 if has_any([
            "requirements.txt",
            "package.json",
            "pyproject.toml",
            "pom.xml",
            "build.gradle"
        ]) else 0,
        "docker_support": 100 if statistics.get("docker_files", 0) else 0,
        "github_actions": 100 if statistics.get("workflow_files", 0) else 0,
        "repository_organization": min(
            100,
            40 + len(analysis.get("languages", [])) * 15
        )
    }

    overall = round(
        sum(categories.values()) / len(categories)
    )

    suggestions = []

    if categories["readme"] < 100:
        suggestions.append("Add a README that explains setup, usage, and project goals.")

    if categories["tests"] < 100:
        suggestions.append("Add tests or examples that prove the core workflow works.")

    if categories["ci_cd"] < 100:
        suggestions.append("Add a CI workflow to run checks automatically.")

    if categories["docker_support"] < 100:
        suggestions.append("Add Docker support if the project needs reproducible deployment.")

    if categories["documentation"] < 80:
        suggestions.append("Add docs for architecture, API usage, or contribution steps.")

    return {
        "overall_score": overall,
        "category_scores": categories,
        "improvement_suggestions": suggestions
    }
