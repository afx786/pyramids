TECHNOLOGY_PATTERNS = {

    "frameworks": {

        "FastAPI": {
            "patterns": [
                "fastapi",
                "from fastapi",
                "FastAPI"
            ],
            "confidence": {
                "requirements.txt": 100,
                "pyproject.toml": 100,
                ".py": 95,
                "README.md": 25
            }
        },

        "Flask": {
            "patterns": [
                "flask",
                "from flask"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 95,
                "README.md": 25
            }
        },

        "Django": {
            "patterns": [
                "django",
                "from django"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 95,
                "README.md": 25
            }
        },

        "React": {
            "patterns": [
                "\"react\"",
                "react-dom"
            ],
            "confidence": {
                "package.json": 100,
                ".jsx": 95,
                ".tsx": 95,
                "README.md": 25
            }
        },

        "Next.js": {
            "patterns": [
                "\"next\"",
                "next.config",
                "next/"
            ],
            "confidence": {
                "package.json": 100,
                ".js": 95,
                ".ts": 95,
                "README.md": 25
            }
        }

    },

    "libraries": {

        "SQLAlchemy": {
            "patterns": [
                "sqlalchemy"
            ],
            "confidence": {
                "requirements.txt": 100,
                "pyproject.toml": 100,
                ".py": 95
            }
        },

        "Pandas": {
            "patterns": [
                "pandas",
                "import pandas"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 95
            }
        },

        "NumPy": {
            "patterns": [
                "numpy",
                "import numpy"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 95
            }
        },

        "TensorFlow": {
            "patterns": [
                "tensorflow"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 95
            }
        },

        "PyTorch": {
            "patterns": [
                "torch",
                "pytorch"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 95
            }
        },

        "Scikit-learn": {
            "patterns": [
                "sklearn",
                "scikit-learn"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 95
            }
        }

    },

    "databases": {

        "PostgreSQL": {
            "patterns": [
                "postgresql",
                "psycopg2",
                "postgres"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".env": 95,
                ".py": 90
            }
        },

        "MySQL": {
            "patterns": [
                "mysql"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 90
            }
        },

        "SQLite": {
            "patterns": [
                "sqlite"
            ],
            "confidence": {
                ".py": 90
            }
        },

        "MongoDB": {
            "patterns": [
                "mongodb",
                "pymongo"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 90
            }
        }

    },

    "cloud": {

        "AWS": {
            "patterns": [
                "boto3",
                "aws"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 90,
                "README.md": 25
            }
        },

        "Azure": {
            "patterns": [
                "azure"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 90
            }
        },

        "Google Cloud": {
            "patterns": [
                "google-cloud"
            ],
            "confidence": {
                "requirements.txt": 100,
                ".py": 90
            }
        }

    },

    "devops": {

        "Docker": {
            "patterns": [
                "FROM",
                "docker"
            ],
            "confidence": {
                "Dockerfile": 100,
                "docker-compose.yml": 100,
                "README.md": 20
            }
        },

        "GitHub Actions": {
            "patterns": [
                "name:",
                "on:",
                "jobs:"
            ],
            "confidence": {
                ".yml": 100
            }
        }

    }

}