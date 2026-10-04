import { useEffect, useState } from "react"

interface ResumeAnalysis {
  skills?: string[]
}

interface ResumeResult {
  analysis?: ResumeAnalysis
}

interface Question {
  question: string
  type: string
}

const interviewQuestions: Record<string, Question[]> = {
  "Software Engineer": [
    {
      question:
        "Tell me about yourself and your experience with software development.",
      type: "Introduction",
    },
    {
      question:
        "Explain a project you have worked on and the technical decisions you made.",
      type: "Project",
    },
    {
      question:
        "How would you design a REST API for a simple application?",
      type: "Technical",
    },
    {
      question:
        "What is the difference between a list and a tuple in Python?",
      type: "Technical",
    },
    {
      question:
        "How do you debug a problem when your application is not working as expected?",
      type: "Problem Solving",
    },
  ],

  "AI / ML Engineer": [
    {
      question:
        "Tell me about yourself and your interest in Artificial Intelligence and Machine Learning.",
      type: "Introduction",
    },
    {
      question:
        "Explain a Machine Learning or AI project you have worked on.",
      type: "Project",
    },
    {
      question:
        "What is the difference between supervised and unsupervised learning?",
      type: "Technical",
    },
    {
      question:
        "What is overfitting in Machine Learning and how can you reduce it?",
      type: "Technical",
    },
    {
      question:
        "How would you evaluate whether an AI model is performing well?",
      type: "Problem Solving",
    },
  ],

  "Backend Developer": [
    {
      question:
        "Tell me about yourself and your experience with backend development.",
      type: "Introduction",
    },
    {
      question:
        "Describe a backend project you have built.",
      type: "Project",
    },
    {
      question:
        "What is a REST API and how does it work?",
      type: "Technical",
    },
    {
      question:
        "How would you connect a FastAPI application to a database?",
      type: "Technical",
    },
    {
      question:
        "How would you troubleshoot a slow API endpoint?",
      type: "Problem Solving",
    },
  ],

  "Full Stack Developer": [
    {
      question:
        "Tell me about yourself and your experience with frontend and backend development.",
      type: "Introduction",
    },
    {
      question:
        "Describe a full-stack project you have worked on.",
      type: "Project",
    },
    {
      question:
        "What is the difference between frontend and backend responsibilities?",
      type: "Technical",
    },
    {
      question:
        "How does a React frontend communicate with a backend API?",
      type: "Technical",
    },
    {
      question:
        "How would you debug a problem occurring between a frontend and backend?",
      type: "Problem Solving",
    },
  ],
}

function AIInterview() {
  const [selectedRole, setSelectedRole] =
    useState("Software Engineer")

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState("")
  const [answers, setAnswers] = useState<string[]>([])
  const [interviewStarted, setInterviewStarted] =
    useState(false)
  const [interviewFinished, setInterviewFinished] =
    useState(false)

  const [resumeSkills, setResumeSkills] = useState<string[]>([])

  useEffect(() => {
    const savedResume =
      localStorage.getItem("resume_analysis")

    if (savedResume) {
      try {
        const data: ResumeResult =
          JSON.parse(savedResume)

        setResumeSkills(
          data.analysis?.skills || []
        )
      } catch (error) {
        console.error(
          "INTERVIEW RESUME ERROR:",
          error
        )
      }
    }
  }, [])

  const startInterview = () => {
    const selectedQuestions =
      interviewQuestions[selectedRole]

    setQuestions(selectedQuestions)
    setCurrentQuestion(0)
    setAnswer("")
    setAnswers([])
    setInterviewFinished(false)
    setInterviewStarted(true)
  }

  const submitAnswer = () => {
    if (!answer.trim()) {
      return
    }

    const updatedAnswers = [
      ...answers,
      answer.trim(),
    ]

    setAnswers(updatedAnswers)
    setAnswer("")

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setInterviewFinished(true)
    }
  }

  const restartInterview = () => {
    setInterviewStarted(false)
    setInterviewFinished(false)
    setQuestions([])
    setCurrentQuestion(0)
    setAnswer("")
    setAnswers([])
  }

  const calculateScore = () => {
    if (answers.length === 0) {
      return 0
    }

    let score = 0

    answers.forEach((answer) => {
      const words = answer
        .trim()
        .split(/\s+/)
        .filter(Boolean)

      if (words.length >= 50) {
        score += 20
      } else if (words.length >= 30) {
        score += 16
      } else if (words.length >= 15) {
        score += 12
      } else if (words.length >= 8) {
        score += 8
      } else {
        score += 4
      }
    })

    return Math.min(
      100,
      Math.round(
        score / questions.length * 5
      )
    )
  }

  const getFeedback = () => {
    const score = calculateScore()

    if (score >= 80) {
      return "Strong interview performance. Your answers show good detail and communication."
    }

    if (score >= 60) {
      return "Good start. Try adding more technical detail, examples, and measurable results."
    }

    return "Keep practicing. Try giving longer, structured answers with specific examples from your projects."
  }

  // Interview completed
  if (interviewFinished) {
    const score = calculateScore()

    return (
      <div className="max-w-5xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            AI Interview
          </h1>

          <p className="text-slate-400 mt-2">
            Interview completed successfully.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="text-center">

            <p className="text-slate-400">
              Interview Score
            </p>

            <p className="text-6xl font-bold text-blue-400 mt-3">
              {score}%
            </p>

            <p className="text-white text-xl font-semibold mt-6">
              {selectedRole}
            </p>

          </div>

          <div className="mt-8 bg-slate-800 rounded-xl p-6">

            <h2 className="text-xl font-semibold text-white">
              AI Feedback
            </h2>

            <p className="text-slate-300 mt-3 leading-7">
              {getFeedback()}
            </p>

          </div>

          <div className="mt-6 bg-slate-800 rounded-xl p-6">

            <h2 className="text-xl font-semibold text-white">
              Interview Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

              <div className="bg-slate-900 rounded-xl p-5">
                <p className="text-slate-400">
                  Questions
                </p>

                <p className="text-2xl font-bold text-white mt-2">
                  {questions.length}
                </p>
              </div>

              <div className="bg-slate-900 rounded-xl p-5">
                <p className="text-slate-400">
                  Answers
                </p>

                <p className="text-2xl font-bold text-white mt-2">
                  {answers.length}
                </p>
              </div>

              <div className="bg-slate-900 rounded-xl p-5">
                <p className="text-slate-400">
                  Resume Skills
                </p>

                <p className="text-2xl font-bold text-white mt-2">
                  {resumeSkills.length}
                </p>
              </div>

            </div>

          </div>

          <button
            onClick={restartInterview}
            className="mt-8 w-full px-6 py-4 rounded-xl
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold
            transition"
          >
            Start New Interview
          </button>

        </div>

      </div>
    )
  }

  // Interview in progress
  if (interviewStarted) {
    const question = questions[currentQuestion]

    return (
      <div className="max-w-5xl">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-white">
            AI Interview
          </h1>

          <p className="text-slate-400 mt-2">
            {selectedRole} Interview
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex justify-between items-center mb-6">

            <div>
              <p className="text-blue-400 font-semibold">
                {question.type}
              </p>

              <p className="text-slate-400 text-sm mt-1">
                Question {currentQuestion + 1} of{" "}
                {questions.length}
              </p>
            </div>

            <p className="text-slate-400">
              {Math.round(
                ((currentQuestion + 1) /
                  questions.length) *
                  100
              )}
              %
            </p>

          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 mb-8">

            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />

          </div>

          <div className="bg-slate-800 rounded-xl p-6">

            <h2 className="text-2xl font-semibold text-white leading-9">
              {question.question}
            </h2>

          </div>

          <div className="mt-6">

            <label className="text-slate-300 font-medium">
              Your Answer
            </label>

            <textarea
              value={answer}
              onChange={(event) =>
                setAnswer(event.target.value)
              }
              placeholder="Type your answer here..."
              rows={8}
              className="mt-3 w-full bg-slate-950
              border border-slate-700 rounded-xl
              p-5 text-white placeholder-slate-600
              focus:outline-none focus:border-blue-500
              resize-none"
            />

          </div>

          <button
            onClick={submitAnswer}
            disabled={!answer.trim()}
            className="mt-5 w-full px-6 py-4 rounded-xl
            bg-blue-600 hover:bg-blue-700
            disabled:bg-slate-700
            disabled:text-slate-500
            text-white font-semibold
            transition"
          >
            {currentQuestion === questions.length - 1
              ? "Finish Interview"
              : "Submit Answer"}
          </button>

        </div>

      </div>
    )
  }

  // Interview setup
  return (
    <div className="max-w-5xl">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          AI Interview
        </h1>

        <p className="text-slate-400 mt-2">
          Practice role-specific interviews based on
          your career profile.
        </p>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Interview setup */}

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold text-white">
            Start Your Interview
          </h2>

          <p className="text-slate-400 mt-2">
            Select a role and begin your interview practice.
          </p>

          <div className="mt-8">

            <label className="text-slate-300 font-medium">
              Select Role
            </label>

            <select
              value={selectedRole}
              onChange={(event) =>
                setSelectedRole(event.target.value)
              }
              className="mt-3 w-full bg-slate-950
              border border-slate-700 rounded-xl
              px-4 py-4 text-white
              focus:outline-none focus:border-blue-500"
            >

              <option>
                Software Engineer
              </option>

              <option>
                AI / ML Engineer
              </option>

              <option>
                Backend Developer
              </option>

              <option>
                Full Stack Developer
              </option>

            </select>

          </div>

          <div className="mt-8 bg-slate-800 rounded-xl p-6">

            <h3 className="text-white font-semibold">
              Interview Format
            </h3>

            <ul className="text-slate-400 mt-4 space-y-3">

              <li>
                ✓ 5 role-specific questions
              </li>

              <li>
                ✓ Technical and project questions
              </li>

              <li>
                ✓ Written answer practice
              </li>

              <li>
                ✓ Final performance score
              </li>

              <li>
                ✓ Personalized improvement feedback
              </li>

            </ul>

          </div>

          <button
            onClick={startInterview}
            className="mt-8 w-full px-6 py-4 rounded-xl
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold
            transition"
          >
            Start Interview
          </button>

        </div>

        {/* Career profile */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-xl font-semibold text-white">
            Your Career Profile
          </h2>

          {resumeSkills.length > 0 ? (
            <>
              <p className="text-slate-400 mt-2">
                Skills detected from your resume.
              </p>

              <div className="flex flex-wrap gap-2 mt-5">

                {resumeSkills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-500/10
                    border border-blue-500/30
                    text-blue-400 px-3 py-2
                    rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}

              </div>
            </>
          ) : (
            <>
              <p className="text-slate-400 mt-2">
                No analyzed resume found yet.
              </p>

              <p className="text-slate-500 text-sm mt-4">
                Analyze your resume first to make your
                interview practice more personalized.
              </p>
            </>
          )}

        </div>

      </div>

    </div>
  )
}

export default AIInterview