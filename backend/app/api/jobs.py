from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/jobs", tags=["Jobs"])


class Job(BaseModel):
    id: int
    title: str
    company: str
    location: str
    type: str
    experience: str
    skills: List[str]
    match: Optional[int] = None
    salary: str
    apply_url: str


class JobsResponse(BaseModel):
    status: str
    jobs: List[Job]


REAL_JOBS = [
    {
        "id": 1,
        "title": "Solutions Engineer Intern",
        "company": "ClearFeed",
        "location": "Bengaluru / Remote India",
        "type": "Internship",
        "experience": "No experience required",
        "skills": ["Python", "SQL", "REST APIs", "AWS", "Postman"],
        "salary": "₹3.6L–₹4.8L",
        "apply_url": "https://wellfound.com/jobs/4616090-implementation-solutions-engineer-clone"
    },
    {
        "id": 2,
        "title": "DS/ML Intern",
        "company": "epiFi Technologies",
        "location": "Bengaluru",
        "type": "Internship",
        "experience": "Student / Recent Graduate",
        "skills": ["Python", "SQL", "Machine Learning", "Data Science", "LLMs"],
        "salary": "Not specified",
        "apply_url": "https://wellfound.com/jobs/4420206-ds-ml-intern"
    },
    {
        "id": 3,
        "title": "Product Engineer Intern",
        "company": "Mowka",
        "location": "Remote India",
        "type": "Internship",
        "experience": "No experience required",
        "skills": ["Python", "React", "TypeScript", "AI", "Web Development"],
        "salary": "₹10,000–₹20,000",
        "apply_url": "https://wellfound.com/jobs/3821958-2-product-engineer-intern"
    },
    {
        "id": 4,
        "title": "AI Engineer Intern",
        "company": "Abstrabit Technologies",
        "location": "Bengaluru",
        "type": "Internship",
        "experience": "0–1 year",
        "skills": [
            "Machine Learning",
            "Generative AI",
            "RAG",
            "LLMs",
            "Artificial Intelligence"
        ],
        "salary": "₹8L–₹11L",
        "apply_url": "https://wellfound.com/jobs/4584279-ai-engineer-intern"
    },
    {
        "id": 5,
        "title": "AI Engineer Intern",
        "company": "orqum.ai",
        "location": "Bengaluru / Remote India",
        "type": "Internship",
        "experience": "No experience required",
        "skills": [
            "Python",
            "FastAPI",
            "React",
            "MongoDB",
            "PostgreSQL",
            "LLMs"
        ],
        "salary": "₹4.8L–₹6L",
        "apply_url": "https://wellfound.com/jobs/3783438-ai-engineer-intern"
    }
]


def calculate_match(resume_skills: List[str], job_skills: List[str]) -> int:
    if not resume_skills:
        return 0

    resume_set = {
        skill.strip().lower()
        for skill in resume_skills
    }

    job_set = {
        skill.strip().lower()
        for skill in job_skills
    }

    matched_skills = resume_set.intersection(job_set)

    return round(
        (len(matched_skills) / len(job_set)) * 100
    )


@router.get("/matches", response_model=JobsResponse)
def get_job_matches(
    skills: Optional[str] = Query(default=None)
):
    # NO RESUME
    if not skills:
        jobs = [
            {
                **job,
                "match": None
            }
            for job in REAL_JOBS
        ]

        return {
            "status": "success",
            "jobs": jobs
        }

    # RESUME EXISTS
    resume_skills = [
        skill.strip()
        for skill in skills.split(",")
        if skill.strip()
    ]

    jobs = []

    for job in REAL_JOBS:
        match = calculate_match(
            resume_skills,
            job["skills"]
        )

        jobs.append({
            **job,
            "match": match
        })

    jobs.sort(
        key=lambda job: job["match"],
        reverse=True
    )

    return {
        "status": "success",
        "jobs": jobs
    }