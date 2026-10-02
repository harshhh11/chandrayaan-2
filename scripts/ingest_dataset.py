import sys
from pathlib import Path

# Forward to backend ingestion script
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from backend.ingestion.ingest_dataset import ingest_all_datasets

if __name__ == "__main__":
    ingest_all_datasets()
