import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db
from app.sample_data.samples import SAMPLE_INCIDENT_TEXT_1

# Ensure tables exist
init_db()

with TestClient(app) as client:
    print("=== TEST 1: Health Check ===", flush=True)
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    print("Health response:", res.json(), flush=True)

    print("\n=== TEST 2: Sample Endpoint ===", flush=True)
    res = client.get("/api/v1/sample")
    assert res.status_code == 200
    sample_data = res.json()
    state = sample_data["state"]
    print("Loaded sample incident:", state["incident_details"]["title"], flush=True)

    print("\n=== TEST 3: Chat Extraction ===", flush=True)
    chat_payload = {
        "message": "Extract deviation: " + SAMPLE_INCIDENT_TEXT_1,
        "current_state": state
    }
    res = client.post("/api/v1/chat", json=chat_payload)
    assert res.status_code == 200
    chat_res = res.json()
    print("Extraction tool used:", chat_res["tool_used"], flush=True)

    print("\n=== TEST 4: State Preservation on Edit ===", flush=True)
    edit_payload = {
        "message": "Change batch number to ATC-26-099",
        "current_state": state
    }
    res = client.post("/api/v1/chat", json=edit_payload)
    assert res.status_code == 200
    updated_state = res.json()["updated_state"]
    assert updated_state["incident_details"]["batch_lot_no"] == "ATC-26-099"
    # Verify unmentioned fields were strictly preserved!
    assert updated_state["incident_details"]["incident_id"] == "DEV-2026-0881"
    print("State preserved! Batch:", updated_state["incident_details"]["batch_lot_no"], flush=True)

    print("\n=== TEST 5: Confirm Root Cause ===", flush=True)
    confirm_payload = {
        "message": "Confirm cause 1 by Dr. Anita Desai (Director QA)",
        "current_state": updated_state
    }
    res = client.post("/api/v1/chat", json=confirm_payload)
    assert res.status_code == 200
    rc_state = res.json()["updated_state"]
    rc1 = next(rc for rc in rc_state["root_cause_candidates"] if rc["id"] == "RC-01")
    assert rc1["status"] == "Confirmed"
    print("RC-01 confirmed by:", rc1["confirmed_by"], flush=True)

    print("\n=== TEST 6: Save and Retrieve Investigation ===", flush=True)
    save_payload = {
        "title": "Automated Test API Investigation",
        "status": "UNDER_REVIEW",
        "state": rc_state
    }
    res = client.post("/api/v1/investigations", json=save_payload)
    assert res.status_code == 200
    inv_id = res.json()["id"]
    print("Saved investigation with ID:", inv_id, flush=True)

    # List
    res = client.get("/api/v1/investigations")
    assert res.status_code == 200
    inv_list = res.json()
    assert any(it["id"] == inv_id for it in inv_list)
    print("Listed investigations count:", len(inv_list), flush=True)

    # Retrieve
    res = client.get(f"/api/v1/investigations/{inv_id}")
    assert res.status_code == 200
    retrieved = res.json()
    assert retrieved["id"] == inv_id
    assert retrieved["state"]["incident_details"]["batch_lot_no"] == "ATC-26-099"
    print("Retrieved saved investigation correctly!", flush=True)

    print("\nALL 6 BACKEND & RCA TESTS PASSED 100%!", flush=True)
