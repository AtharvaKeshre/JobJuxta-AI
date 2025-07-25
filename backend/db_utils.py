import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# MongoDB connection setup
mongo_url = os.environ.get("DB_URL", "mongodb://localhost:27017/")
client = MongoClient(mongo_url)  # Use DB_URL from .env
mongo_db = client["jobjuxta"]  # Database name
users_collection = mongo_db["users"]  # Collection name

def get_the_user_collection():
    return users_collection
