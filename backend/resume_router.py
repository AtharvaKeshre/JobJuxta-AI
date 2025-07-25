from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
import pypdf
import io
import json
from auth import get_current_user
from ai_analyzer import analyze_resume_with_ai

resume_router = APIRouter()

@resume_router.post("/resume/analyze", tags=["AI Analysis"])
async def analyze_resume(
    job_description: str = Form(...),
    resume_file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Analyzes a resume against a job description.

    - **job_description**: The full text of the job description.
    - **resume_file**: The user's resume file (PDF recommended).
    """
    if resume_file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload a PDF.",
        )

    try:
        # Read the PDF file in memory
        pdf_content = await resume_file.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(pdf_content))
        
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text() or ""

        if not resume_text.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Could not extract text from the provided PDF. The file might be an image-based PDF or corrupted."
            )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to process the PDF file: {e}",
        )

    ai_response = await analyze_resume_with_ai(resume_text, job_description)

    try:
        # Remove markdown code block formatting if present
        if ai_response.strip().startswith("```"):
            # Remove triple backticks and optional 'json' label
            ai_response = ai_response.strip()
            ai_response = ai_response.lstrip("`")
            # Remove 'json' label if present
            if ai_response.lower().startswith("json"):
                ai_response = ai_response[4:]
            # Remove any remaining backticks
            ai_response = ai_response.strip("`").strip()
        analysis_content = json.loads(ai_response)
        return analysis_content
    except (json.JSONDecodeError) as e:
        print(f"Error parsing AI response: {e}\nRaw AI response: {ai_response}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse the analysis from the AI service."
        )