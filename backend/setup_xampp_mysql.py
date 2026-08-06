import sys, os
import pymysql

print("="*60)
print("     XAMPP phpMyAdmin MySQL Database Setup Tool")
print("="*60)

HOST = "localhost"
USER = "root"
DB_NAME = "biomaterial_db"

print(f"\n1. Connecting to XAMPP MySQL server at {HOST}:3306...")
try:
    conn = None
    PASSWORD = ""
    for pwd in ["", "lanja1438"]:
        try:
            conn = pymysql.connect(host=HOST, user=USER, password=pwd)
            PASSWORD = pwd
            break
        except Exception:
            continue
            
    if not conn:
        raise Exception("Could not connect with default blank password or specified password.")

    cursor = conn.cursor()
    print(f"   Connection established successfully (Password: '{PASSWORD or 'BLANK'}')!")
    
    print(f"\n2. Creating database '{DB_NAME}' if not exists...")
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME};")
    conn.commit()
    conn.close()
    print(f"   Database '{DB_NAME}' is ready in XAMPP phpMyAdmin!")
    
    print("\n3. Seeding tables and initial records into XAMPP MySQL...")
    os.environ["DATABASE_URL"] = f"mysql+pymysql://{USER}:{PASSWORD}@{HOST}:3306/{DB_NAME}"
    
    import seed_db
    seed_db.seed_database()
    
    print("\n Success! XAMPP phpMyAdmin MySQL is fully connected and configured!")
    print(f"   Open phpMyAdmin at: http://localhost/phpmyadmin and select '{DB_NAME}'")
    print("="*60)

except Exception as e:
    print(f"\n Error: Could not connect to XAMPP MySQL server.")
    print(f"Details: {e}")
    print("\n Troubleshooting Steps:")
    print("1. Open XAMPP Control Panel on your PC.")
    print("2. Click 'Start' next to 'MySQL'.")
    print("3. Re-run this script: python setup_xampp_mysql.py")
    print("="*60)
