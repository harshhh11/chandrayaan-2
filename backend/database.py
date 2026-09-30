import json
import sqlite3
from typing import Dict, List, Optional, Any
from pathlib import Path
from .config import DATA_DIR
from .models.dataset import DatasetItem
from .models.registration import RegistrationJob, ProcessingStage

DB_PATH = DATA_DIR / "lunamatch.db"

class Database:
    def __init__(self):
        self._datasets: Dict[str, DatasetItem] = {}
        self._jobs: Dict[str, RegistrationJob] = {}
        self._init_sqlite()

    def _init_sqlite(self):
        conn = sqlite3.connect(str(DB_PATH))
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS registration_jobs (
                id TEXT PRIMARY KEY,
                source_image_id TEXT,
                reference_image_id TEXT,
                status TEXT,
                progress_pct INTEGER,
                created_at TEXT,
                completed_at TEXT,
                payload_json TEXT
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS datasets (
                id TEXT PRIMARY KEY,
                sensor TEXT,
                title TEXT,
                payload_json TEXT
            )
        """)
        conn.commit()
        conn.close()

    def add_dataset(self, item: DatasetItem):
        self._datasets[item.id] = item
        try:
            conn = sqlite3.connect(str(DB_PATH))
            cursor = conn.cursor()
            cursor.execute(
                "INSERT OR REPLACE INTO datasets (id, sensor, title, payload_json) VALUES (?, ?, ?, ?)",
                (item.id, item.sensor.value, item.title, item.model_dump_json())
            )
            conn.commit()
            conn.close()
        except Exception:
            pass

    def get_dataset(self, dataset_id: str) -> Optional[DatasetItem]:
        return self._datasets.get(dataset_id)

    def list_datasets(self) -> List[DatasetItem]:
        return list(self._datasets.values())

    def save_job(self, job: RegistrationJob):
        self._jobs[job.id] = job
        try:
            conn = sqlite3.connect(str(DB_PATH))
            cursor = conn.cursor()
            cursor.execute(
                "INSERT OR REPLACE INTO registration_jobs (id, source_image_id, reference_image_id, status, progress_pct, created_at, completed_at, payload_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (job.id, job.source_image_id, job.reference_image_id, job.status.value, job.progress_pct, job.created_at, job.completed_at, job.model_dump_json())
            )
            conn.commit()
            conn.close()
        except Exception:
            pass

    def get_job(self, job_id: str) -> Optional[RegistrationJob]:
        return self._jobs.get(job_id)

    def list_jobs(self) -> List[RegistrationJob]:
        return list(self._jobs.values())

db = Database()
