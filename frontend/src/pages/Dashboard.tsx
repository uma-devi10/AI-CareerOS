import { useEffect, useState } from "react"

interface ResumeData {
  analysis?: {
    resume_score?: number
    skills?: string[]
  }
}


function Dashboard() {
  const [resumeScore, setResumeScore] = useState<number | null>(null)
  const [jobCount, setJobCount] = useState<number | null>(null)
  const [skillCount, setSkillCount] = useState<number | null>(null)
  const [interviewCount, setInterviewCount] = useState<number | null>(null)

  useEffect(() => {
    // IMPORTANT:
    // Only use the NEW resume storage key.
    // Old resume data is completely ignored.
    const savedResume = localStorage.getItem("ai_careeros_resume")

    if (savedResume) {
      try {
        const data: ResumeData = JSON.parse(savedResume)

        const score = data.analysis?.resume_score
        const skills = data.analysis?.skills

        if (typeof score === "number") {
          setResumeScore(score)
        }

        if (Array.isArray(skills)) {
          setSkillCount(skills.length)
        }

        const savedJobs = localStorage.getItem("ai_careeros_jobs")

        if (savedJobs) {
          const jobs = JSON.parse(savedJobs)

          if (Array.isArray(jobs)) {
            setJobCount(jobs.length)
          }
        }
      } catch (error) {
        console.error("Dashboard resume data error:", error)
      }
    }

    const savedInterviews = localStorage.getItem(
      "ai_careeros_interviews"
    )

    if (savedInterviews) {
      try {
        const interviews = JSON.parse(savedInterviews)

        if (Array.isArray(interviews) && interviews.length > 0) {
          setInterviewCount(interviews.length)
        }
      } catch (error) {
        console.error("Dashboard interview data error:", error)
      }
    }
  }, [])

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back to AI CareerOS. Let's continue your career journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Resume Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Resume Score
          </p>

          <h2 className="text-4xl font-bold text-blue-400 mt-3">
            {resumeScore !== null ? `${resumeScore}%` : "—"}
          </h2>

          <p className="text-slate-500 mt-2">
            {resumeScore !== null
              ? "Resume analyzed"
              : "Upload your resume"}
          </p>
        </div>

        {/* Job Matches */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Job Matches
          </p>

          <h2 className="text-4xl font-bold text-green-400 mt-3">
            {jobCount !== null ? jobCount : "—"}
          </h2>

          <p className="text-slate-500 mt-2">
            {jobCount !== null
              ? "Matching jobs found"
              : "Upload your resume first"}
          </p>
        </div>

        {/* Skills */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Skills
          </p>

          <h2 className="text-4xl font-bold text-purple-400 mt-3">
            {skillCount !== null ? skillCount : "—"}
          </h2>

          <p className="text-slate-500 mt-2">
            {skillCount !== null
              ? "Skills analyzed"
              : "Upload your resume first"}
          </p>
        </div>

        {/* Interviews */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Interviews
          </p>

          <h2 className="text-4xl font-bold text-orange-400 mt-3">
            {interviewCount !== null ? interviewCount : "—"}
          </h2>

          <p className="text-slate-500 mt-2">
            {interviewCount !== null
              ? "Interviews completed"
              : "No interviews completed"}
          </p>
        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-white mb-6">
          Get Started
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="bg-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold text-lg">
              📄 Resume Analysis
            </h3>

            <p className="text-slate-400 mt-2">
              Upload your resume to analyze your skills and resume score.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold text-lg">
              💼 Job Matching
            </h3>

            <p className="text-slate-400 mt-2">
              Find jobs that match your resume skills.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold text-lg">
              🎯 Skill Gap
            </h3>

            <p className="text-slate-400 mt-2">
              Identify the skills you need to improve.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold text-lg">
              🤖 AI Interview
            </h3>

            <p className="text-slate-400 mt-2">
              Practice interviews and receive AI feedback.
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Dashboard