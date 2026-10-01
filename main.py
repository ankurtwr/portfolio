"""
Ankur Tiwari — Portfolio Backend
FastAPI + SQLAlchemy + SQLite
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
    """Fetches detailed LeetCode stats (including topics/languages) via GraphQL."""
    url = 'https://leetcode.com/graphql'
    query = '''
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        languageProblemCount {
          languageName
          problemsSolved
        }
        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }
          intermediate {
            tagName
            problemsSolved
          }
          fundamental {
            tagName
            problemsSolved
          }
        }
      }
    }
    '''
    data = json.dumps({'query': query, 'variables': {'username': 'ankur_twr'}}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
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
