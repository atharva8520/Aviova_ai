import sys
import os
import io
import json

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.sample_data.samples import SAMPLE_INCIDENT_TEXT_1

with TestClient(app) as client:
    print("=== TEST 7: Document File Upload (TXT / Incident Report) ===", flush=True)
    res_sample = client.get("/api/v1/sample")
    state = res_sample.json()["state"]

    file_bytes = SAMPLE_INCIDENT_TEXT_1.encode("utf-8")
    files = {
        "file": ("deviation_report_0881.txt", io.BytesIO(file_bytes), "text/plain")
    }
    data = {
        "state_json": json.dumps(state)
    }

    res = client.post("/api/v1/upload", files=files, data=data)
    assert res.status_code == 200, f"Upload failed: {res.text}"
    upload_res = res.json()
    assert upload_res["tool_used"] == "Extraction"
    print("Upload response tool:", upload_res["tool_used"], flush=True)
    print("Reply:", upload_res["reply"][:150], flush=True)
    print("\nDOCUMENT UPLOAD TEST PASSED 100%!", flush=True)
