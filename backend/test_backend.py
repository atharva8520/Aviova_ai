import sys
import os
import json

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.sample_data.samples import SAMPLE_INCIDENT_TEXT_1

client = TestClient(app)

def run_all_tests():
    print("=== TEST 1: Health Check ===")
    res = client.get("/api/v1/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    health = res.json()
    print("Health response:", health)
    assert health["status"] == "healthy"

    print("\n=== TEST 2: Sample Endpoint ===")
    res = client.get("/api/v1/sample")
    assert res.status_code == 200
    sample_data = res.json()
    assert "state" in sample_data
    state = sample_data["state"]
    assert state["incident_details"]["batch_lot_no"] == "ATC-26-088"
    print("Loaded sample incident successfully:", state["incident_details"]["title"])

    print("\n=== TEST 3: Chat Extraction ===")
    chat_payload = {
        "message": "Extract deviation: " + SAMPLE_INCIDENT_TEXT_1,
        "current_state": state
    }
    res = client.post("/api/v1/chat", json=chat_payload)
    assert res.status_code == 200, f"Extraction failed: {res.text}"
    chat_res = res.json()
    assert chat_res["tool_used"] in ["Extraction", "RCA Analysis", "Chat"]
    print("Extraction Reply preview:", chat_res["reply"][:150])

    print("\n=== TEST 4: State Preservation on Edit ===")
    edit_payload = {
        "message": "Change batch number to ATC-26-099 and update equipment ID to Crystallizer CR-108",
        "current_state": state
    }
    res = client.post("/api/v1/chat", json=edit_payload)
    assert res.status_code == 200
    edit_res = res.json()
    updated_state = edit_res["updated_state"]
    assert updated_state["incident_details"]["batch_lot_no"] == "ATC-26-099"
    # Verify unmentioned fields were strictly preserved!
    assert updated_state["incident_details"]["incident_id"] == "DEV-2026-0881"
    assert len(updated_state["five_whys"]) == 5
    print("State preserved perfectly! New batch:", updated_state["incident_details"]["batch_lot_no"])

    print("\n=== TEST 5: Confirm Root Cause via Command ===")
    confirm_payload = {
        "message": "Confirm cause 1 by Dr. Anita Desai (Director QA)",
        "current_state": updated_state
    }
    res = client.post("/api/v1/chat", json=confirm_payload)
    assert res.status_code == 200
    confirm_res = res.json()
    rc_state = confirm_res["updated_state"]
    rc1 = next(rc for rc in rc_state["root_cause_candidates"] if rc["id"] == "RC-01")
    assert rc1["status"] == "Confirmed"
    print(f"RC-01 confirmed: status={rc1['status']}, confirmed_by={rc1['confirmed_by']}")

    print("\n=== TEST 6: Save and Retrieve Investigation ===")
    save_payload = {
        "title": "Automated Test API Investigation",
        "status": "UNDER_REVIEW",
        "state": rc_state
    }
    res = client.post("/api/v1/investigations", json=save_payload)
    assert res.status_code == 200, f"Save failed: {res.text}"
    save_res = res.json()
    inv_id = save_res["id"]
    print("Saved investigation with ID:", inv_id)

    # List
    res = client.get("/api/v1/investigations")
    assert res.status_code == 200
    inv_list = res.json()
    assert any(it["id"] == inv_id for it in inv_list)
    print("Listed investigations count:", len(inv_list))

    # Retrieve by ID
    res = client.get(f"/api/v1/investigations/{inv_id}")
    assert res.status_code == 200
    retrieved = res.json()
    assert retrieved["id"] == inv_id
    assert retrieved["state"]["incident_details"]["batch_lot_no"] == "ATC-26-099"
    print("Retrieved saved investigation correctly!")

    print("\nALL 6 BACKEND & RCA TESTS PASSED 100%!")

if __name__ == "__main__":
    run_all_tests()
