import { useState } from "react"

function ResumeAnalysis() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a resume first.")
      return
    }

    setError("")
    setResult(null)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(
        "http://127.0.0.1:8000/resume/analyze",
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          typeof data.detail === "string"
            ? data.detail
            : "Resume analysis failed."
        )
        return
      }

      setResult(data)
      localStorage.setItem("ai_careeros_resume", JSON.stringify(data))
    } catch (error) {
      console.error("RESUME ERROR:", error)

      setError(
        "Cannot connect to backend. Make sure FastAPI is running on port 8000."
      )
    } finally {
      setLoading(false)
    }
  }

  const analysis = result?.analysis

  return (
    <div className="max-w-6xl">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Resume Analysis
        </h1>

        <p className="text-slate-400 mt-2">
          Upload your resume and get AI-powered career insights.
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h2 className="text-xl font-semibold text-white mb-2">
          Upload Resume
        </h2>

        <p className="text-slate-400 mb-6">
          Upload your PDF resume to analyze your skills and experience.
        </p>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0] || null

            setFile(selectedFile)
            setError("")
            setResult(null)
          }}
          className="block w-full text-sm text-slate-300
          file:mr-4 file:py-3 file:px-5
          file:rounded-lg file:border-0
          file:bg-blue-600 file:text-white
          file:font-semibold
          hover:file:bg-blue-700"
        />

        {file && (
          <p className="text-slate-300 mt-4">
            Selected file:{" "}
            <span className="text-blue-400">
              {file.name}
            </span>
          </p>
        )}

        {error && (
          <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || !file}
          className="mt-6 px-6 py-3 rounded-lg
          bg-blue-600 hover:bg-blue-700
          disabled:bg-slate-700
          disabled:cursor-not-allowed
          text-white font-semibold transition"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

      </div>

      {/* Analysis Result */}
      {result && analysis && (
        <div className="mt-8 space-y-6">

          {/* Result Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h2 className="text-2xl font-semibold text-white">
              Analysis Result
            </h2>

            <p className="text-slate-400 mt-2">
              Resume analyzed successfully.
            </p>

          </div>

          {/* Resume Score */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <p className="text-slate-400 text-lg">
              Resume Score
            </p>

            <div className="flex items-end gap-2 mt-2">
              <span className="text-6xl font-bold text-blue-400">
                {analysis.resume_score ?? 0}
              </span>

              <span className="text-2xl text-slate-400 mb-2">
                / 100
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3 mt-6">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{
                  width: `${analysis.resume_score ?? 0}%`,
                }}
              />
            </div>

          </div>

          {/* Skills */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h3 className="text-xl font-semibold text-white mb-5">
              Skills Detected
            </h3>

            {analysis.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {analysis.skills.map(
                  (skill: string, index: number) => (
                    <span
                      key={`${skill}-${index}`}
                      className="px-4 py-2 rounded-full
                      bg-blue-500/10
                      border border-blue-500/30
                      text-blue-400"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-slate-400">
                No skills detected.
              </p>
            )}

          </div>

          {/* Experience */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h3 className="text-xl font-semibold text-white mb-5">
              Experience
            </h3>

            {analysis.experience?.length > 0 ? (
              <div className="space-y-3">
                {analysis.experience.map(
                  (item: string, index: number) => (
                    <div
                      key={index}
                      className="bg-slate-800 rounded-lg p-4"
                    >
                      <p className="text-slate-300">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-slate-400">
                No work experience detected.
              </p>
            )}

          </div>

          {/* Education */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h3 className="text-xl font-semibold text-white mb-5">
              Education
            </h3>

            {analysis.education?.length > 0 ? (
              <div className="space-y-3">
                {analysis.education.map(
                  (item: string, index: number) => (
                    <div
                      key={index}
                      className="bg-slate-800 rounded-lg p-4"
                    >
                      <p className="text-slate-300">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-slate-400">
                No education information detected.
              </p>
            )}

          </div>

          {/* Projects */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h3 className="text-xl font-semibold text-white mb-5">
              Projects
            </h3>

            {analysis.projects?.length > 0 ? (
              <div className="space-y-3">
                {analysis.projects.map(
                  (item: string, index: number) => (
                    <div
                      key={index}
                      className="bg-slate-800 rounded-lg p-4"
                    >
                      <p className="text-slate-300">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400">
                  No projects detected in your resume.
                </p>
              </div>
            )}

          </div>

          {/* Suggestions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

            <h3 className="text-xl font-semibold text-white mb-5">
              Suggestions
            </h3>

            {analysis.suggestions?.length > 0 ? (
              <div className="space-y-3">
                {analysis.suggestions.map(
                  (suggestion: string, index: number) => (
                    <div
                      key={index}
                      className="flex gap-3 bg-slate-800 rounded-lg p-4"
                    >
                      <span className="text-blue-400 font-bold">
                        {index + 1}.
                      </span>

                      <p className="text-slate-300">
                        {suggestion}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-slate-400">
                No suggestions available.
              </p>
            )}

          </div>

        </div>
      )}

    </div>
  )
}

export default ResumeAnalysis