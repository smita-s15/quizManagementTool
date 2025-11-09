from app.database import client, db

try:
    client.admin.command("ping")
    print("✅ Connected to MongoDB Atlas!")
    print("Database:", db.name)
    print("Collections:", db.list_collection_names())
except Exception as e:
    print("❌ Connection failed:", e)
