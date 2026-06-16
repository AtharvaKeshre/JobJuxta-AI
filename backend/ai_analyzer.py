import os
from fastapi import HTTPException, status
import json
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set.")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

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
    5.  "keyword_analysis": Identify key skills/technologies from the job description and indicate whether they are present in the resume.

    Respond ONLY with the JSON object. Do not include any other text or markdown formatting.
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error calling Gemini AI SDK: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI analysis service is currently unavailable. Please try again later.",
        )