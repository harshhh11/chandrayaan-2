import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

# Curated data storage directories
RAW_DIR = DATA_DIR / "raw"
RAW_OHRC_DIR = RAW_DIR / "ohrc"
RAW_TMC2_DIR = RAW_DIR / "tmc2"
RAW_IIRS_DIR = RAW_DIR / "iirs"

PROCESSED_DIR = DATA_DIR / "processed"
PROCESSED_OHRC_DIR = PROCESSED_DIR / "ohrc"
PROCESSED_TMC2_DIR = PROCESSED_DIR / "tmc2"
PROCESSED_IIRS_DIR = PROCESSED_DIR / "iirs"

BROWSE_DIR = DATA_DIR / "browse"
THUMBNAILS_DIR = DATA_DIR / "thumbnails"
MANIFESTS_DIR = DATA_DIR / "manifests"
RESULTS_DIR = DATA_DIR / "results"
EXPORTS_DIR = DATA_DIR / "exports"

ALL_DIRS = [
    RAW_DIR, RAW_OHRC_DIR, RAW_TMC2_DIR, RAW_IIRS_DIR,
    PROCESSED_DIR, PROCESSED_OHRC_DIR, PROCESSED_TMC2_DIR, PROCESSED_IIRS_DIR,
    BROWSE_DIR, THUMBNAILS_DIR, MANIFESTS_DIR, RESULTS_DIR, EXPORTS_DIR
]

for d in ALL_DIRS:
    d.mkdir(parents=True, exist_ok=True)

# Parse .env if present
def _load_env_file(env_path: Path):
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if key and key not in os.environ:
                        os.environ[key] = val

_load_env_file(Path(__file__).resolve().parent / ".env")
_load_env_file(BASE_DIR / ".env")

# Secure configuration parameters
PRADAN_USERNAME = os.getenv("PRADAN_USERNAME", "")
PRADAN_PASSWORD = os.getenv("PRADAN_PASSWORD", "")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/edolus")

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "*"
]
