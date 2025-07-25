from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
import bcrypt
from db_utils import get_the_user_collection
import jwt
from datetime import datetime, timedelta
from fastapi import Header, Request
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# User schema for request validation
class UserSignup(BaseModel):
    firstName: str
    lastName: str
    phone: str
    email: EmailStr
    password: str
    accountType: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

auth_router = APIRouter()

# JWT Config
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY environment variable not set. Please check your .env file.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token.")

def get_current_user(Authorization: str = Header(...)):
    if not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header.")
    token = Authorization.split(" ", 1)[1]
    payload = verify_token(token)
    return payload

@auth_router.post("/signup")
def signup(user: UserSignup):
    users = get_the_user_collection()
    if users.find_one({"email": user.email}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")
    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    user_dict = user.dict()
    user_dict["password"] = hashed_pw.decode('utf-8')
    users.insert_one(user_dict)
    return {"message": "User signed up successfully!"}

@auth_router.post("/login")
def login(user: UserLogin):
    users = get_the_user_collection()
    db_user = users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    if not bcrypt.checkpw(user.password.encode('utf-8'), db_user["password"].encode('utf-8')):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    # Create JWT token
    token_data = {
        "sub": db_user["email"],
        "user_id": str(db_user.get("_id")),
        "accountType": db_user.get("accountType"),
        "firstName": db_user.get("firstName"),
        "lastName": db_user.get("lastName")
    }
    access_token = create_access_token(token_data)
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.get("/me")
def read_users_me(current_user: dict = Depends(get_current_user)):
    return {"user": current_user} 