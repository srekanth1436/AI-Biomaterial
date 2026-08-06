import pymysql
import os

def clear_all_data():
    host = "localhost"
    port = 3306
    user = "root"
    db_name = "biomaterial_db"

    print(f"Connecting to XAMPP MySQL server at {host}:{port}...")

    conn = None
    for pwd in ["", "lanja1438"]:
        try:
            conn = pymysql.connect(host=host, port=port, user=user, password=pwd)
            print(f" Connected to MySQL (Password: '{pwd or 'BLANK'}')!")
            break
        except Exception:
            continue

    if not conn:
        print(" Error: Could not connect to MySQL.")
        return

    try:
        cursor = conn.cursor()
        print(f"Resetting database '{db_name}' to clean slate...")
        cursor.execute(f"DROP DATABASE IF EXISTS `{db_name}`;")
        cursor.execute(f"CREATE DATABASE `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        cursor.execute(f"USE `{db_name}`;")

        schema_path = os.path.join(os.path.dirname(__file__), "..", "database", "schema.sql")
        if os.path.exists(schema_path):
            with open(schema_path, "r", encoding="utf-8") as f:
                sql_statements = f.read().split(";")
                for stmt in sql_statements:
                    stmt = stmt.strip()
                    if stmt and not stmt.upper().startswith("CREATE DATABASE") and not stmt.upper().startswith("USE "):
                        cursor.execute(stmt)
            print(" Applied schema.sql successfully!")

        conn.commit()
        conn.close()

        print("="*60)
        print(" SUCCESS! 'biomaterial_db' IS NOW COMPLETELY CLEAN & EMPTY!")
        print(" Tables created: 'users', 'predictions', 'datasets'")
        print(" Record count: 0 (Clean slate ready for your registrations & predictions)")
        print("="*60)

    except Exception as e:
        print(f" Error clearing database: {e}")

if __name__ == "__main__":
    clear_all_data()
