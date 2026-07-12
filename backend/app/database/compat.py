from sqlalchemy import inspect, text


def ensure_project_verification_columns(engine):
    inspector = inspect(engine)

    if "projects" not in inspector.get_table_names():
        return

    existing_columns = {
        column["name"]
        for column in inspector.get_columns("projects")
    }

    required_columns = {
        "github_url": "VARCHAR",
        "repository_score": "INTEGER",
        "repository_analysis": "JSON",
        "verified_skills": "JSON"
    }

    with engine.begin() as connection:
        for name, column_type in required_columns.items():
            if name not in existing_columns:
                connection.execute(
                    text(
                        f"ALTER TABLE projects ADD COLUMN {name} {column_type}"
                    )
                )
