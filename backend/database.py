from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import settings

import pymysql

# Auto-create biomaterial_db in XAMPP phpMyAdmin if server is running
for pwd in ["", "lanja1438"]:
    try:
        connection = pymysql.connect(host='localhost', user='root', password=pwd)
        cursor = connection.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS biomaterial_db;")
        connection.close()
        break
    except Exception:
        continue

engine = None
db_urls_to_try = [
    settings.database_url,
    "mysql+pymysql://root:@127.0.0.1:3306/biomaterial_db",
    "mysql+pymysql://root:lanja1438@127.0.0.1:3306/biomaterial_db"
]

for url in db_urls_to_try:
    try:
        tmp_engine = create_engine(url)
        with tmp_engine.connect() as conn:
            pass
        engine = tmp_engine
        print(" Successfully connected to XAMPP phpMyAdmin MySQL Database (biomaterial_db)!")
        break
    except Exception:
        continue

if not engine:
    print(" XAMPP MySQL not started yet. Using SQLite database fallback.")
    sqlite_url = "sqlite:///./biomaterial.db"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
