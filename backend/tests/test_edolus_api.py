import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database import db

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ONLINE"
    assert "OHRC" in data["sensors"]

def test_list_datasets():
    res = client.get("/api/datasets")
    assert res.status_code == 200
    datasets = res.json()
    assert len(datasets) >= 3
    assert any(d["dataset"] == "OHRC" for d in datasets)
    assert any(d["dataset"] == "TMC-2" for d in datasets)
    assert any(d["dataset"] == "IIRS" for d in datasets)

def test_dataset_metadata():
    res = client.get("/api/datasets")
    assert res.status_code == 200
    datasets = res.json()
    first_id = datasets[0]["id"]
    
    meta_res = client.get(f"/api/datasets/{first_id}/metadata")
    assert meta_res.status_code == 200
    meta = meta_res.json()
    assert "geometry" in meta
    assert "sun_elevation" in meta["geometry"]
    assert "sun_azimuth" in meta["geometry"]

def test_candidate_scene_matches():
    res = client.get("/api/candidate-matches")
    assert res.status_code == 200
    matches = res.json()
    assert isinstance(matches, list)
    assert len(matches) > 0

def test_analytics_overview():
    res = client.get("/api/analytics/overview")
    assert res.status_code == 200
    analytics = res.json()
    assert analytics["images_indexed"] >= 3
    assert analytics["ohrc_count"] >= 1
    assert "avg_correspondence_rate" in analytics

def test_search_endpoint():
    res = client.get("/api/search?q=Boguslawsky")
    assert res.status_code == 200
    search_res = res.json()
    assert search_res["total_results"] > 0

def test_manifest_endpoint():
    res = client.get("/api/manifest")
    assert res.status_code == 200
    manifest = res.json()
    assert manifest["total_products"] > 0
    assert "payload_summary" in manifest
