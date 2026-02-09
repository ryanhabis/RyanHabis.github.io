from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database
import models

app = FastAPI(title="Dundalk Market API", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
try:
    models.Base.metadata.create_all(bind=database.engine)
    print("✅ Database tables created successfully!")
except Exception as e:
    print(f"❌ Error creating tables: {e}")

@app.get("/")
def root():
    return {
        "message": "🏪 Dundalk Market API",
        "version": "2.0.0",
        "database": "Connected to Supabase" if "supabase" in str(database.engine.url) else "Using SQLite",
        "status": "running"
    }

@app.get("/test-db")
def test_db():
    try:
        with database.engine.connect() as conn:
            result = conn.execute("SELECT 1")
            return {
                "status": "connected",
                "database": str(database.engine.url),
                "test_query": "success"
            }
    except Exception as e:
        return {
            "status": "error",
            "database": str(database.engine.url) if hasattr(database.engine, 'url') else "unknown",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
