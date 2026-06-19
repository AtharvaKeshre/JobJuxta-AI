import os
from fastapi import HTTPException, status
import json
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set.")

genai.configure(api_key=GEMINI_API_KEY)

# temperature=0 makes generation (near-)deterministic, so the same resume + job
# description yields a consistent score instead of a different one on each run.
# response_mime_type forces clean JSON output (no markdown fences to strip).
generation_config = genai.types.GenerationConfig(
    temperature=0,
    response_mime_type="application/json",
)
model = genai.GenerativeModel(
    "gemini-2.5-flash",
    generation_config=generation_config,
)

async def analyze_resume_with_ai(resume_text: str, job_description: str):
    """
    Analyzes a resume against a job description using the Gemini AI SDK.
    """
    prompt = f"""
    You are an expert AI career assistant. Your task is to analyze a resume against a job description and provide constructive feedback.

    **Job Description:**
    ---
    {job_description}
    ---

    **Candidate's Resume:**
    ---
    {resume_text}
    ---

    Please provide the following analysis in a structured JSON format:
    1.  "match_score": An estimated percentage (0-100) of how well the resume matches the job description.
    2.  "summary": A brief, 2-3 sentence summary of the candidate's suitability for the role.
    3.  "strengths": A list of key strengths from the resume that align with the job description.
    4.  "areas_for_improvement": A list of suggestions on how the candidate could better tailor their resume for this specific role. This could include missing keywords, skills to highlight, or experience to elaborate on.
    5.  "keyword_analysis": Identify key skills/technologies from the job description and indicate whether they are present in the resume. Extract a thorough list of the most important keywords which are actually relevant and can have an impact with the ATS (No duplicates and no more than 30). For EACH keyword, the value MUST be exactly one of these four labels:
        - "Present": the keyword (or a clear equivalent) is explicitly stated in the resume.
        - "Partially Present": there is partial or related evidence (e.g. a similar tool, or limited experience) but not a full match.
        - "Implied": not stated directly, but reasonably inferable from the candidate's roles, projects, or other skills.
        - "Absent": there is no evidence of it anywhere in the resume.
        Example: {{"Python": "Present", "Kubernetes": "Absent", "CI/CD": "Implied", "AWS": "Partially Present"}}

    Respond ONLY with the JSON object. Do not include any other text or markdown formatting.
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        msg = str(e)
        # Distinguish a quota/rate-limit (HTTP 429) from a genuine outage so the
        # client can show an accurate message instead of "service unavailable".
        is_quota = (
            isinstance(e, google_exceptions.ResourceExhausted)
            or "429" in msg
            or "quota" in msg.lower()
            or "rate limit" in msg.lower()
        )
        if is_quota:
            print(f"Gemini quota/rate limit hit: {e}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    "Gemini API quota exceeded — the free-tier request limit has been "
                    "reached. Please wait and try again later, or upgrade your Gemini plan."
                ),
                headers={"Retry-After": "60"},
            )
        print(f"Error calling Gemini AI SDK: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI analysis service is currently unavailable. Please try again later.",
        )