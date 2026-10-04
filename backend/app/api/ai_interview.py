from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv


load_dotenv()


router = APIRouter(
    prefix="/ai-interview",
    tags=["AI Interview"]
)


class InterviewRequest(BaseModel):
    role: str
    resume_skills: list[str]
    question: str
    answer: str


class InterviewResponse(BaseModel):
    score: int
    feedback: str
    strengths: list[str]
    improvements: list[str]


@router.post(
    "/evaluate",
    response_model=InterviewResponse
)
def evaluate_answer(request: InterviewRequest):

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not configured in the .env file."
        )

    try:
        client = OpenAI(api_key=api_key)

        skills = ", ".join(request.resume_skills)

        prompt = f"""
You are an expert technical interviewer evaluating a candidate.

Candidate role:
{request.role}

Candidate resume skills:
{skills}

Interview question:
{request.question}

Candidate answer:
{request.answer}

Evaluate the candidate's answer using these criteria:

1. Technical correctness
2. Relevance to the question
3. Clarity
4. Depth of explanation
5. Practical understanding

Give a score from 0 to 100.

Also provide:
- Short but useful feedback
- 2 to 4 strengths
- 2 to 4 improvements

Be fair to a student or entry-level candidate.
Do not expect senior-level knowledge from an entry-level candidate.
"""

        response = client.responses.create(
            model="gpt-5.6-luna",
            input=prompt,
            text={
                "format": {
                    "type": "json_schema",
                    "name": "interview_evaluation",
                    "description": "Structured evaluation of a technical interview answer.",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "score": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 100
                            },
                            "feedback": {
                                "type": "string"
                            },
                            "strengths": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "improvements": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        },
                        "required": [
                            "score",
                            "feedback",
                            "strengths",
                            "improvements"
                        ],
                        "additionalProperties": False
                    }
                }
            }
        )

        import json

        evaluation = json.loads(response.output_text)

        score = int(evaluation["score"])

        # Extra safety
        score = max(0, min(100, score))

        strengths = evaluation.get("strengths", [])
        improvements = evaluation.get("improvements", [])

        if not isinstance(strengths, list):
            strengths = []

        if not isinstance(improvements, list):
            improvements = []

        return InterviewResponse(
            score=score,
            feedback=str(evaluation.get("feedback", "")),
            strengths=[str(item) for item in strengths],
            improvements=[str(item) for item in improvements]
        )

    except Exception as error:

        print("========================================")
        print("AI INTERVIEW ERROR")
        print(error)
        print("========================================")

        raise HTTPException(
            status_code=500,
            detail=f"AI evaluation failed: {str(error)}"
        )