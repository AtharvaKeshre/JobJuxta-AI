# uvicorn main:app --reload

import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import bcrypt
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr
from auth import auth_router
import check_db
from db_utils import get_the_user_collection

app = FastAPI()


# Load environment variables from .env
load_dotenv()

check_db.check_connection()


# Allow all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)



@app.get("/")
def read_root():
    return {"message": "Hello, World with CORS!"}
