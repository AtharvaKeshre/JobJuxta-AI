# JobJuxta-AI

JobJuxta AI is a smart, lightweight Applicant Tracking System that automates resume analysis and job fit evaluation. Applicants can submit their details and upload a resume, and the system matches their profile against a job description using NLP and scoring algorithms.

---

## Features
- User signup and login with JWT authentication
- Resume upload and analysis
- Job fit scoring using NLP
- Modern Next.js frontend
- FastAPI backend with MongoDB

---

## Project Structure

```
JobJuxta-AI/
  backend/      # FastAPI backend
  frontend/     # Next.js frontend
```

---

## Backend Setup (FastAPI)

1. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn pymongo bcrypt pyjwt
   ```
2. **Configure MongoDB:**
   - Ensure MongoDB is running and update connection details in `backend/db_utils.py` if needed.
3. **Run the backend server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
4. **API Endpoints:**
   - `POST /signup` — Register a new user
   - `POST /login` — Login and receive JWT token
   - `GET /me` — Get current user info (requires JWT in `Authorization` header)

---

## Frontend Setup (Next.js)

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Run the frontend:**
   ```bash
   npm run dev
   ```
3. **Login Flow:**
   - On login, the JWT token is stored in `localStorage`.
   - Use this token for authenticated API requests by setting the `Authorization: Bearer <token>` header.

---

## Authentication (JWT)
- After login, the backend returns a JWT token.
- Store this token securely (e.g., `localStorage`).
- For protected endpoints, include the token in the `Authorization` header:
  ```http
  Authorization: Bearer <your_token>
  ```

---

## Environment Variables
- For production, set your secret keys and database URIs in environment variables (not in code).
- Example for backend:
  - `SECRET_KEY`
  - `MONGODB_URI`

---

## License
MIT
