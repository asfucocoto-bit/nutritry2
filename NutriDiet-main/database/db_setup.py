import sqlite3
import os

def init_db():
    os.makedirs("database", exist_ok=True)
    conn = sqlite3.connect("database/diet_users.db")
    cursor = conn.cursor()

    # Create table for storing user info and recommendations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        gender TEXT,
        age INTEGER,
        height REAL,
        weight REAL,
        diet_goal TEXT,
        food_preference TEXT,
        breakfast TEXT,
        lunch TEXT,
        dinner TEXT
    )
    """)

    conn.commit()
    conn.close()
    print("✅ Database initialized successfully!")

if __name__ == "__main__":
    init_db()
