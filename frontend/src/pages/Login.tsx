import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {
      console.log("Sending login request...")

      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      )

      console.log("Login status:", response.status)

      const data = await response.json()

      console.log("Login response:", data)

      if (!response.ok) {
        setError(
          typeof data.detail === "string"
            ? data.detail
            : "Login failed. Check your email and password."
        )
        return
      }

      if (!data.access_token) {
        setError("Login succeeded, but no access token was received.")
        return
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      )

      localStorage.setItem(
        "token_type",
        data.token_type || "bearer"
      )

      console.log("LOGIN SUCCESS")
      console.log("Going to dashboard...")

      navigate("/", { replace: true })

    } catch (error) {
      console.error("LOGIN ERROR:", error)

      setError(
        "Cannot connect to backend. Make sure FastAPI is running on port 8000."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">
            AI CareerOS
          </h1>

          <p className="text-slate-400 mt-2">
            Welcome back. Continue your career journey.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold mb-6 text-white">
            Sign in
          </h2>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-blue-500 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-blue-500 text-white"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed font-semibold transition text-white"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="text-center text-slate-400 mt-6">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300"
            >
              Create one
            </Link>
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login