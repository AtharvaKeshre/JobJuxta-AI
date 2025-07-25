import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

mongo_url = os.environ.get("DB_URL", "mongodb://localhost:27017/")

def check_connection():
    try:
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
        print("MongoDB connection successful!")
        print("Databases:", client.list_database_names())
    except Exception as e:
        print("MongoDB connection failed:", e)

if __name__ == "__main__":
    check_connection() 