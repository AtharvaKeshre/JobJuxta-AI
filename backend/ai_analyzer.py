import os
import json
import google.generativeai as genai
from fastapi import HTTPException, status
from google.generativeai import types

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set.")

genai.configure(api_key=GEMINI_API_KEY)

# 1. Corrected model initialization to 2.5
model = genai.GenerativeModel("gemini-2.5-pro")

async def analyze_resume_with_ai(resume_text: str, job_description: str):
    """
    Analyzes a resume against a job description using the Gemini AI SDK.
    Returns a guaranteed JSON string matching the specified schema.
    """
    
    # 2. Define the exact JSON structure you want returned
    analysis_schema = types.Schema(
        type=types.Type.OBJECT,
        properties={
            "match_score": types.Schema(type=types.Type.INTEGER, description="Estimated matching percentage 0-100"),
            "summary": types.Schema(type=types.Type.STRING, description="2-3 sentence overview of suitability"),
            "strengths": types.Schema(
                type=types.Type.ARRAY, 
                items=types.Schema(type=types.Type.STRING),
                description="Key matching strengths"
            ),
            "areas_for_improvement": types.Schema(
                type=types.Type.ARRAY, 
                items=types.Schema(type=types.Type.STRING),
                description="Gaps or tailoring advice"
            ),
            "keyword_analysis": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "keyword": types.Schema(type=types.Type.STRING),
                        "present": types.Schema(type=types.Type.BOOLEAN)
                    },
                    required=["keyword", "present"]
                ),
                description="List of target keywords found or missing"
            )
        },
        required=["match_score", "summary", "strengths", "areas_for_improvement", "keyword_analysis"]
    )

    # 3. Simplify prompt text since formatting logic is handled by the schema
    prompt = f"""
    You are an expert AI career assistant and technical recruiter. 
    Analyze the following resume explicitly against the provided job description.

    Job Description:
    {job_description}

    Candidate's Resume:
    {resume_text}
    """

    try:
        # Enforce JSON structure via generation_config
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=analysis_schema
            )
        )
        
        # Because we used response_schema, response.text is guaranteed to be clean JSON
        return response.text
        
    except Exception as e:
        print(f"Error calling Gemini AI SDK: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI analysis service is currently unavailable. Please try again later.",
        )