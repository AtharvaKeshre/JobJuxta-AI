# uvicorn main:app --reload
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from auth import auth_router
from resume_router import resume_router
import check_db

app = FastAPI()


# Load environment variables from .env
load_dotenv()

check_db.check_connection()


# Allow all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGINS")],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(resume_router)



@app.get("/")
def read_root():
    return {"message": "Hello, World with CORS!"}
