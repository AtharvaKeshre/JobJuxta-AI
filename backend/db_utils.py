import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

mongo_url = os.environ.get("DB_URL", "mongodb://localhost:27017/")

# Configure SSL options for cloud deployment
client = MongoClient(
    mongo_url,
    tls=True,
    tlsAllowInvalidCertificates=True  # Only for development/testing
)

mongo_db = client["jobjuxta"]
users_collection = mongo_db["users"]

def get_the_user_collection():
    return users_collection