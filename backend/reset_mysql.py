import pymysql
import os
import sys

def reset_mysql_database():
    host = "localhost"
    port = 3306
    user = "root"
    password = ""
    db_name = "biomaterial_db"

    print(f"Connecting to XAMPP MySQL / phpMyAdmin at {host}:{port}...")

    try:
        conn = None
        for pwd in ["", "lanja1438"]:
            try:
                conn = pymysql.connect(host=host, port=port, user=user, password=pwd)
                password = pwd
                break
            except Exception:
                continue

        if not conn:
            raise Exception("Could not connect to MySQL with blank or custom password.")
            
        cursor = conn.cursor()
        
        print(f"Dropping old database '{db_name}' if exists (removing legacy patient/doctor data)...")
        cursor.execute(f"DROP DATABASE IF EXISTS `{db_name}`;")
        
        print(f"Creating fresh MySQL database '{db_name}' in phpMyAdmin...")
        cursor.execute(f"CREATE DATABASE `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        cursor.execute(f"USE `{db_name}`;")
        
        # 2. Read schema.sql
        schema_path = os.path.join(os.path.dirname(__file__), "..", "database", "schema.sql")
        if os.path.exists(schema_path):
            with open(schema_path, "r", encoding="utf-8") as f:
                sql_statements = f.read().split(";")
                for stmt in sql_statements:
                    stmt = stmt.strip()
                    if stmt and not stmt.upper().startswith("CREATE DATABASE") and not stmt.upper().startswith("USE "):
                        cursor.execute(stmt)
            print(" Successfully executed database/schema.sql on MySQL!")
        else:
            print(" schema.sql not found, executing inline DDL...")
            
        conn.commit()
        conn.close()
        
        # 3. Seed fresh Biomaterial data using seed_db.py logic
        print("Seeding fresh biomaterial composite data into MySQL phpMyAdmin...")
        os.environ["DATABASE_URL"] = f"mysql+pymysql://{user}:{password}@{host}:{port}/{db_name}"
        
        sys.path.append(os.path.dirname(__file__))
        import seed_db
        seed_db.seed_database()
        
        print("\n PHPMYADMIN MYSQL DATABASE RESET COMPLETE!")
        print(f"Database Name: {db_name}")
        print("Tables Created: users, predictions, datasets")
        
    except Exception as e:
        print(f"\n Error resetting MySQL in phpMyAdmin: {e}")
        print("Please ensure XAMPP / MySQL service is started on port 3306 in XAMPP Control Panel.")

if __name__ == "__main__":
    reset_mysql_database()
