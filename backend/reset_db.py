import os
from database import engine
from models import Base

print("Initializing / Resetting Database tables...")

try:
    # Drop all existing tables and recreate fresh schema
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
except Exception as e:
    print(f"Error resetting database: {e}")

import seed_db
