from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

print("📂 Current directory:", os.getcwd())
print("📁 .env path:", os.path.join(os.getcwd(), '.env'))
print("📄 .env exists:", os.path.exists('.env'))

# Load environment variables from .env file
load_dotenv()

# Debug: List all environment variables
print("🔍 Checking DATABASE_URL...")
DATABASE_URL = os.getenv("DATABASE_URL")
print(f"   DATABASE_URL from os.getenv: {DATABASE_URL}")

# Debug: Check all env vars starting with DATABASE
for key, value in os.environ.items():
    if 'DATABASE' in key or 'POSTGRES' in key:
        print(f"   {key}: {value}")

if not DATABASE_URL:
    print("⚠️  DATABASE_URL not found in .env, using SQLite")
    DATABASE_URL = "sqlite:///./dundalk_market.db"

print(f"🔗 Final Database URL: {DATABASE_URL[:60]}...")

# Create engine
if DATABASE_URL.startswith('sqlite'):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
