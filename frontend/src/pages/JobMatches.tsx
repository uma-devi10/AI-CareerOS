import { useEffect, useState } from "react"

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

interface ResumeData {
  analysis?: {
    skills?: string[]
  }
}

function JobMatches() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [hasResume, setHasResume] = useState(false)

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true)
        setError("")

        // Get resume from localStorage
        const savedResume = localStorage.getItem("ai_careeros_resume")

        let resumeSkills: string[] = []

        if (savedResume) {
          try {
            const resumeData: ResumeData = JSON.parse(savedResume)

            resumeSkills = resumeData.analysis?.skills || []

            if (resumeSkills.length > 0) {
              setHasResume(true)
            }
          } catch (resumeError) {
            console.error("Resume data error:", resumeError)
          }
        }

        // Backend URL
        let url = "https://ai-careeros-api-r7vs.onrender.com/jobs/matches"

        // Only send skills when resume exists
        if (resumeSkills.length > 0) {
          url = `https://ai-careeros-api-r7vs.onrender.com/jobs/matches?skills=${encodeURIComponent(
            resumeSkills.join(",")
          )}`
        }

        // Get jobs
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Failed to load jobs")
        }

        const data: JobsResponse = await response.json()

        const loadedJobs = data.jobs || []

        setJobs(loadedJobs)

        // Store personalized jobs only when resume exists
        if (resumeSkills.length > 0) {
          localStorage.setItem(
  "ai_careeros_jobs",
  JSON.stringify(loadedJobs)
)
        } else {
          localStorage.removeItem("job_matches")
        }

      } catch (err) {
        console.error("JOB ERROR:", err)
        setError("Unable to load jobs. Please make sure the backend is running.")
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [])

  const handleApply = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 text-lg">
          Loading jobs...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Job Matches
        </h1>

        <p className="text-slate-400 mt-2">
          Discover opportunities that match your career profile.
        </p>
      </div>

      {/* Resume notice */}
      {!hasResume && (
        <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-5">
          <p className="text-blue-300 font-medium">
            Upload your resume to calculate personalized job matches.
          </p>

          <p className="text-slate-400 text-sm mt-1">
            You can still browse the available jobs below.
          </p>
        </div>
      )}

      {/* Jobs */}
      <div className="space-y-5">

        {jobs.map((job) => (

          <div
            key={job.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >

            <div className="flex flex-col lg:flex-row gap-6">

              {/* Job information */}
              <div className="flex-1">

                <h2 className="text-xl font-bold text-white">
                  {job.title}
                </h2>

                <p className="text-blue-400 mt-1 font-medium">
                  {job.company}
                </p>

                <div className="flex flex-wrap gap-3 mt-4">

                  <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm">
                    📍 {job.location}
                  </span>

                  <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm">
                    💼 {job.type}
                  </span>

                  <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-sm">
                    🎓 {job.experience}
                  </span>

                </div>

                <p className="text-slate-400 mt-4">
                  Salary:{" "}
                  <span className="text-slate-300">
                    {job.salary}
                  </span>
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-4">

                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-900/30 text-blue-300 border border-blue-800 px-2 py-1 rounded-md text-xs"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

              {/* Match */}
              <div className="lg:w-64 flex flex-col justify-center">

                <div className="bg-slate-800 rounded-xl p-6 text-center">

                  {hasResume && job.match !== null ? (
                    <>
                      <p className="text-slate-400">
                        Profile Match
                      </p>

                      <p className="text-4xl font-bold text-green-400 mt-2">
                        {job.match}%
                      </p>

                      <p className="text-slate-500 text-sm mt-2">
                        Based on your resume
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-400">
                        Profile Match
                      </p>

                      <p className="text-slate-500 text-lg font-medium mt-3">
                        Upload your resume
                      </p>

                      <p className="text-slate-500 text-sm mt-1">
                        to calculate your match
                      </p>
                    </>
                  )}

                  <button
                    onClick={() => handleApply(job.apply_url)}
                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition"
                  >
                    Apply Now
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {jobs.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400">
            No jobs available right now.
          </p>
        </div>
      )}

    </div>
  )
}

export default JobMatches