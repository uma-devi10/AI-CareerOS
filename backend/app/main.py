from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.ai_interview import router as ai_interview_router
from app.api.auth import router as auth_router
from app.api.resumes import router as resume_router
from app.api.jobs import router as jobs_router
from app.core.database import Base, engine
from app.models.user import User


app = FastAPI(
    title="AI CareerOS API",
    description="AI-powered career and job matching platform",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(jobs_router)
app.include_router(ai_interview_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ai-careeros-4s63.onrender.com",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI CareerOS backend is running",
        "status": "success"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }