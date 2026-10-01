"""
Ankur Tiwari — Portfolio Backend
FastAPI
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
from contextlib import asynccontextmanager
import os

# ──────────────────────────────────────────────
# APP LIFESPAN (startup/shutdown)
# ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("[>>] Portfolio API is live at http://localhost:8000")
    print("[>>] API docs available at http://localhost:8000/docs")
    yield
    # Shutdown
    print("[--] Shutting down...")


# ──────────────────────────────────────────────
# FASTAPI APP
# ──────────────────────────────────────────────
app = FastAPI(
    title="Ankur Tiwari — Portfolio API",
    description="Backend API powering the portfolio contact form and message management.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allows frontend to call API from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



import urllib.request
import json

# --- LeetCode Stats Proxy ---
@app.get("/api/leetcode")
def get_leetcode_stats():
    """Fetches detailed LeetCode stats via alfa-leetcode-api proxy to bypass Cloudflare."""
    username = "ankur_twr"
    base_url = "https://alfa-leetcode-api.onrender.com"
    
    def fetch_json(url):
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                return json.loads(response.read().decode('utf-8'))
        except Exception:
            return {}

    # Fetch data from community proxy endpoints
    profile_data = fetch_json(f"{base_url}/userProfile/{username}")
    lang_data = fetch_json(f"{base_url}/{username}/language")
    skill_data = fetch_json(f"{base_url}/skillStats/{username}")

    try:
        ac_submission_num = profile_data.get("matchedUserStats", {}).get("acSubmissionNum", [])
        
        # Assemble into the EXACT GraphQL format the frontend expects
        return {
            "data": {
                "matchedUser": {
                    "submitStats": {
                        "acSubmissionNum": ac_submission_num
                    },
                    "languageProblemCount": lang_data.get("languageProblemCount", []),
                    "tagProblemCounts": skill_data.get("matchedUser", {}).get("tagProblemCounts", {})
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Health Check ---
@app.get("/api/health")
async def health_check():
    """Simple health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "Ankur Tiwari Portfolio API",
    }


# ──────────────────────────────────────────────
# STATIC FILES (serves the portfolio frontend)
# Must be LAST — catches all unmatched routes
# ──────────────────────────────────────────────
app.mount("/", StaticFiles(directory=".", html=True), name="static")
