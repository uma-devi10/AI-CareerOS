import { useEffect, useState } from "react"

interface ResumeAnalysis {
  resume_score?: number
  skills?: string[]
}

interface ResumeResult {
  analysis?: ResumeAnalysis
}

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  experience: string
  skills: string[]
 match: number | null
  salary: string
  apply_url: string
}

interface JobsResponse {
  status: string
  jobs: Job[]
}

function SkillGap() {
  const [resumeSkills, setResumeSkills] = useState<string[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // ============================================================
  // LOAD RESUME SKILLS + REAL JOB REQUIREMENTS
  // ============================================================

  useEffect(() => {
    const loadSkillGapData = async () => {
      try {
        setLoading(true)
        setError("")

        // Get skills from the resume analysis
        const savedResult = localStorage.getItem("ai_careeros_resume")

        if (savedResult) {
          try {
            const data: ResumeResult = JSON.parse(savedResult)

            setResumeSkills(data.analysis?.skills || [])
          } catch (resumeError) {
            console.error(
              "RESUME DATA ERROR:",
              resumeError
            )
          }
        }
if (!savedResult) {
  setLoading(false)
  return
}
        // Get real jobs from backend
        const response = await fetch(
          "https://ai-careeros-api-r7vs.onrender.com/jobs/matches"
        )

        if (!response.ok) {
          throw new Error("Failed to load job requirements.")
        }

        const data: JobsResponse = await response.json()

        setJobs(data.jobs || [])
      } catch (error) {
        console.error("SKILL GAP ERROR:", error)

        setError(
          "Unable to load job requirements. Make sure FastAPI is running."
        )
      } finally {
        setLoading(false)
      }
    }

    loadSkillGapData()
  }, [])

  // ============================================================
  // NORMALIZE SKILLS
  // ============================================================

  const normalizeSkill = (skill: string) => {
    return skill
      .toLowerCase()
      .replace(/[.\-_/]/g, "")
      .replace(/\s+/g, "")
  }

  // ============================================================
  // CURRENT RESUME SKILLS
  // ============================================================

  const normalizedResumeSkills = resumeSkills.map(
    (skill) => normalizeSkill(skill)
  )

  // ============================================================
  // COLLECT REQUIRED SKILLS FROM REAL JOBS
  // ============================================================

  const requiredSkills = Array.from(
    new Map(
      jobs
        .flatMap((job) => job.skills || [])
        .map((skill) => [
          normalizeSkill(skill),
          skill,
        ])
    ).values()
  )

  // ============================================================
  // SKILLS YOU ALREADY HAVE
  // ============================================================

  const haveSkills = requiredSkills.filter((skill) =>
    normalizedResumeSkills.includes(
      normalizeSkill(skill)
    )
  )

  // ============================================================
  // SKILLS YOU ARE MISSING
  // ============================================================

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !normalizedResumeSkills.includes(
        normalizeSkill(skill)
      )
  )

  // ============================================================
  // PRIORITIZE MISSING SKILLS
  // ============================================================

  const prioritizedMissingSkills = missingSkills
    .map((skill) => {
      const numberOfJobs = jobs.filter((job) =>
        (job.skills || []).some(
          (jobSkill) =>
            normalizeSkill(jobSkill) ===
            normalizeSkill(skill)
        )
      ).length

      return {
        skill,
        numberOfJobs,
      }
    })
    .sort(
      (a, b) =>
        b.numberOfJobs - a.numberOfJobs
    )

  // ============================================================
  // CAREER READINESS
  // ============================================================

  const readinessPercentage =
    requiredSkills.length > 0
      ? Math.round(
          (haveSkills.length /
            requiredSkills.length) *
            100
        )
      : 0

  // ============================================================
  // LOADING SCREEN
  // ============================================================

  if (loading) {
    return (
      <div className="max-w-6xl">

        <h1 className="text-3xl font-bold text-white">
          Skill Gap
        </h1>

        <p className="text-slate-400 mt-2">
          Analyzing your skills against real job requirements...
        </p>

      </div>
    )
  }

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <div className="max-w-6xl">

      {/* PAGE HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Skill Gap
        </h1>

        <p className="text-slate-400 mt-2">
          Discover the skills you have and the skills you need
          to improve based on real job requirements.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* NO RESUME */}

      {resumeSkills.length === 0 ? (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-xl font-semibold text-white">
            Analyze your resume first
          </h2>

          <p className="text-slate-400 mt-3">
            Upload and analyze your resume in Resume Analysis
            to see your personalized skill gap.
          </p>

        </div>

      ) : (

        <>

          {/* ==================================================
              OVERVIEW
          ================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

            {/* Skills Found */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <p className="text-slate-400">
                Skills Found
              </p>

              <p className="text-4xl font-bold text-blue-400 mt-2">
                {resumeSkills.length}
              </p>

              <p className="text-slate-500 text-sm mt-2">
                Detected from your resume
              </p>

            </div>

            {/* Skills You Have */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <p className="text-slate-400">
                Skills You Have
              </p>

              <p className="text-4xl font-bold text-green-400 mt-2">
                {haveSkills.length}
              </p>

              <p className="text-slate-500 text-sm mt-2">
                Matching real job requirements
              </p>

            </div>

            {/* Skills To Learn */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <p className="text-slate-400">
                Skills To Learn
              </p>

              <p className="text-4xl font-bold text-orange-400 mt-2">
                {missingSkills.length}
              </p>

              <p className="text-slate-500 text-sm mt-2">
                Found in matching jobs
              </p>

            </div>

          </div>


          {/* ==================================================
              CAREER READINESS
          ================================================== */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

            <div className="flex justify-between items-center mb-4">

              <div>

                <h2 className="text-xl font-semibold text-white">
                  Career Readiness
                </h2>

                <p className="text-slate-400 mt-1">
                  Based on skills required by your matched jobs.
                </p>

              </div>

              <p className="text-3xl font-bold text-blue-400">
                {readinessPercentage}%
              </p>

            </div>

            <div className="w-full bg-slate-800 rounded-full h-4">

              <div
                className="bg-blue-600 h-4 rounded-full transition-all"
                style={{
                  width: `${readinessPercentage}%`,
                }}
              />

            </div>

            <p className="text-slate-500 text-sm mt-3">
              {haveSkills.length} of{" "}
              {requiredSkills.length} required skills
              matched.
            </p>

          </div>


          {/* ==================================================
              REAL JOBS USED
          ================================================== */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

            <h2 className="text-2xl font-semibold text-white">
              Jobs Used For Analysis
            </h2>

            <p className="text-slate-400 mt-2">
              Your skill gap is calculated using these real job
              requirements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

              {jobs.map((job) => (

                <div
                  key={job.id}
                  className="bg-slate-800 rounded-xl p-5"
                >

                  <h3 className="text-white font-semibold">
                    {job.title}
                  </h3>

                  <p className="text-blue-400 mt-1">
                    {job.company}
                  </p>

                  <p className="text-slate-500 text-sm mt-2">
                    📍 {job.location}
                  </p>

                  <p className="text-green-400 text-sm mt-3">
                    {job.match}% profile match
                  </p>

                </div>

              ))}

            </div>

          </div>


          {/* ==================================================
              SKILLS YOU HAVE
          ================================================== */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

            <h2 className="text-2xl font-semibold text-white">
              Skills You Have
            </h2>

            <p className="text-slate-400 mt-2">
              Skills detected from your resume that are also
              requested by the matched jobs.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">

              {haveSkills.length > 0 ? (

                haveSkills.map((skill) => (

                  <span
                    key={skill}
                    className="bg-green-500/10 border border-green-500/30
                    text-green-400 px-4 py-2 rounded-full"
                  >
                    ✓ {skill}
                  </span>

                ))

              ) : (

                <p className="text-slate-400">
                  None of your detected skills currently match
                  the required job skills.
                </p>

              )}

            </div>

          </div>


          {/* ==================================================
              MISSING SKILLS
          ================================================== */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">

            <h2 className="text-2xl font-semibold text-white">
              Skills To Improve
            </h2>

            <p className="text-slate-400 mt-2">
              These skills are requested by the real jobs
              available in your Job Matches section.
            </p>

            {prioritizedMissingSkills.length > 0 ? (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                {prioritizedMissingSkills.map(
                  (item, index) => (

                    <div
                      key={item.skill}
                      className="bg-slate-800 rounded-xl p-5"
                    >

                      <div className="flex items-center gap-4">

                        <div
                          className="w-10 h-10 rounded-full bg-orange-500/10
                          text-orange-400 flex items-center justify-center
                          font-bold"
                        >
                          {index + 1}
                        </div>

                        <div>

                          <h3 className="text-white font-semibold">
                            {item.skill}
                          </h3>

                          <p className="text-slate-400 text-sm mt-1">
                            Required by{" "}
                            {item.numberOfJobs}{" "}
                            {item.numberOfJobs === 1
                              ? "matched job"
                              : "matched jobs"}
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 mt-6">

                <p className="text-green-400 font-semibold">
                  Great! Your current skills match all the
                  skills required by these jobs.
                </p>

              </div>

            )}

          </div>


          {/* ==================================================
              LEARNING ROADMAP
          ================================================== */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h2 className="text-2xl font-semibold text-white">
              Recommended Learning Path
            </h2>

            <p className="text-slate-400 mt-2">
              Prioritize the missing skills that appear most
              frequently in your matched jobs.
            </p>

            <div className="space-y-4 mt-6">

              {prioritizedMissingSkills.length > 0 ? (

                prioritizedMissingSkills
                  .slice(0, 6)
                  .map((item, index) => (

                    <div
                      key={item.skill}
                      className="bg-slate-800 rounded-xl p-5"
                    >

                      <p className="text-blue-400 font-semibold">
                        Step {index + 1}
                      </p>

                      <h3 className="text-white font-semibold mt-1">
                        Learn {item.skill}
                      </h3>

                      <p className="text-slate-400 mt-2">
                        This skill appears in{" "}
                        {item.numberOfJobs}{" "}
                        {item.numberOfJobs === 1
                          ? "of your matched jobs"
                          : "of your matched jobs"}
                        . Learning it can increase the number
                        of roles you qualify for.
                      </p>

                    </div>

                  ))

              ) : (

                <div className="bg-slate-800 rounded-xl p-5">

                  <p className="text-green-400 font-semibold">
                    No immediate skill gaps found.
                  </p>

                  <p className="text-slate-400 mt-2">
                    Continue strengthening your existing skills
                    through projects and practical experience.
                  </p>

                </div>

              )}

            </div>

          </div>

        </>

      )}

    </div>
  )
}

export default SkillGap