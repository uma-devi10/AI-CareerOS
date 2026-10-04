from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from pypdf import PdfReader
import io
import re

from app.core.database import get_db


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


# ============================================================
# KNOWN SKILLS
# ============================================================

KNOWN_SKILLS = [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C",
    "C++",
    "C#",
    "HTML",
    "CSS",
    "React",
    "React.js",
    "Node.js",
    "Express",
    "FastAPI",
    "Django",
    "Flask",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "SQLite",
    "Git",
    "GitHub",
    "Docker",
    "AWS",
    "Azure",
    "Google Cloud",
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "Data Science",
    "Data Analysis",
    "Power BI",
    "Tableau",
    "Pandas",
    "NumPy",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "REST API",
    "REST APIs",
    "Bootstrap",
    "Tailwind CSS",
    "Linux",
    "Figma",
]


# ============================================================
# PDF TEXT EXTRACTION
# ============================================================

def extract_text_from_pdf(contents: bytes) -> str:
    """Extract readable text from an uploaded PDF."""

    try:
        reader = PdfReader(io.BytesIO(contents))

        pages_text = []

        for page in reader.pages:
            text = page.extract_text()

            if text:
                pages_text.append(text)

        return "\n".join(pages_text).strip()

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read the PDF: {str(exc)}"
        )


# ============================================================
# SKILL EXTRACTION
# ============================================================

def find_skills(text: str) -> list[str]:
    """Find known technical and professional skills."""

    found_skills = []

    text_lower = text.lower()

    for skill in KNOWN_SKILLS:
        if skill.lower() in text_lower:
            found_skills.append(skill)

    return sorted(set(found_skills))


# ============================================================
# SECTION NAME NORMALIZATION
# ============================================================

def normalize_section_name(value: str) -> str:
    """Normalize section headings for easier matching."""

    value = value.lower().strip()

    value = re.sub(r"[^a-z0-9\s&/]", "", value)

    value = re.sub(r"\s+", " ", value)

    return value.strip()


# ============================================================
# SECTION EXTRACTION
# ============================================================

def find_section(text: str, section_names: list[str]) -> str:
    """
    Extract text belonging to a specific resume section.

    The extraction stops when another known resume
    section heading is found.
    """

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    requested_sections = {
        normalize_section_name(name)
        for name in section_names
    }

    known_sections = {
        # Skills
        "skills",
        "technical skills",
        "core skills",

        # Education
        "education",
        "academic background",
        "educational qualifications",

        # Experience
        "experience",
        "work experience",
        "professional experience",
        "employment",

        # Internships
        "internships",
        "internship",
        "training",

        # Projects
        "projects",
        "academic projects",
        "personal projects",
        "project experience",

        # Certifications
        "certifications",
        "certificates",

        # Profile
        "summary",
        "profile",
        "objective",

        # Achievements
        "achievements",
        "awards",

        # Activities
        "activities",
        "positions of responsibility",

        # Personal
        "personal interests",
        "personal interests / hobbies",
        "interests",
        "hobbies",
        "personal details",
        "personal information",

        # Other
        "languages",
        "declaration",
        "references",
    }

    start_index = None

    # Find the requested section
    for index, line in enumerate(lines):

        clean_line = normalize_section_name(line)

        if clean_line in requested_sections:
            start_index = index + 1
            break

    if start_index is None:
        return ""

    section_lines = []

    # Collect lines until another section begins
    for line in lines[start_index:]:

        clean_line = normalize_section_name(line)

        if clean_line in known_sections:
            break

        section_lines.append(line)

    return "\n".join(section_lines).strip()


# ============================================================
# EDUCATION EXTRACTION
# ============================================================

def extract_education(text: str) -> list[str]:
    """Extract education information."""

    section = find_section(
        text,
        [
            "education",
            "academic background",
            "educational qualifications",
        ],
    )

    if not section:
        return []

    lines = [
        line.strip(" •-\t")
        for line in section.splitlines()
        if line.strip()
    ]

    return lines[:15]


# ============================================================
# EXPERIENCE / INTERNSHIP EXTRACTION
# ============================================================

def extract_experience(text: str) -> list[str]:
    """
    Extract work experience and internship information.
    """

    # Try normal experience sections first
    section = find_section(
        text,
        [
            "experience",
            "work experience",
            "professional experience",
            "employment",
        ],
    )

    # If normal experience is not found,
    # check internships.
    if not section:
        section = find_section(
            text,
            [
                "internships",
                "internship",
                "training",
            ],
        )

    if not section:
        return []

    lines = [
        line.strip(" •-\t")
        for line in section.splitlines()
        if line.strip()
    ]

    return lines[:20]


# ============================================================
# PROJECT EXTRACTION
# ============================================================

def extract_projects(text: str) -> list[str]:
    """Extract project information."""

    section = find_section(
        text,
        [
            "projects",
            "academic projects",
            "personal projects",
            "project experience",
        ],
    )

    if not section:
        return []

    lines = [
        line.strip(" •-\t")
        for line in section.splitlines()
        if line.strip()
    ]

    return lines[:20]


# ============================================================
# SCORE CALCULATION
# ============================================================

def calculate_score(
    text: str,
    skills: list[str],
    experience: list[str],
    education: list[str],
    projects: list[str],
) -> int:
    """Calculate a simple resume quality score."""

    score = 0

    # Readable resume text
    if len(text) >= 200:
        score += 15
    elif len(text) >= 100:
        score += 10

    # Skills
    if len(skills) >= 8:
        score += 25
    elif len(skills) >= 5:
        score += 20
    elif len(skills) >= 2:
        score += 12

    # Education
    if education:
        score += 15

    # Experience / Internships
    if experience:
        score += 20

    # Projects
    if projects:
        score += 15

    # Email
    email_pattern = r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b"

    if re.search(email_pattern, text, re.IGNORECASE):
        score += 5

    # Phone number
    digits_only = re.sub(r"\D", "", text)

    if re.search(r"\d{10}", digits_only):
        score += 5

    return min(score, 100)


# ============================================================
# RESUME ANALYZE API
# ============================================================

@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Check filename
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Please select a resume file."
        )

    # Check PDF
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported."
        )

    # Read uploaded file
    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty."
        )

    # Extract PDF text
    text = extract_text_from_pdf(contents)

    if not text:
        raise HTTPException(
            status_code=400,
            detail=(
                "No readable text was found in this PDF. "
                "Please upload a text-based PDF resume."
            )
        )

    # Analyze resume
    skills = find_skills(text)

    education = extract_education(text)

    experience = extract_experience(text)

    projects = extract_projects(text)

    score = calculate_score(
        text=text,
        skills=skills,
        experience=experience,
        education=education,
        projects=projects,
    )

    # Generate suggestions
    suggestions = []

    if len(skills) < 5:
        suggestions.append(
            "Add more relevant technical and professional skills."
        )

    if not education:
        suggestions.append(
            "Add a clearly labeled Education section."
        )

    if not experience:
        suggestions.append(
            "Add work experience, internships, or relevant practical experience."
        )

    if not projects:
        suggestions.append(
            "Add 2-3 relevant projects with technologies and measurable results."
        )

    if len(text) < 500:
        suggestions.append(
            "Add more detail about your achievements, responsibilities, and projects."
        )

    if not suggestions:
        suggestions.append(
            "Your resume has a good structure. Continue adding measurable achievements."
        )

    # Return analysis
    return {
        "status": "success",
        "filename": file.filename,
        "message": "Resume analyzed successfully.",
        "analysis": {
            "resume_score": score,
            "skills": skills,
            "experience": experience,
            "education": education,
            "projects": projects,
            "suggestions": suggestions,
        },
    }