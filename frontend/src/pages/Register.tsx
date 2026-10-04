import { Link } from "react-router-dom"

function Register() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">
            AI CareerOS
          </h1>

          <p className="text-slate-400 mt-2">
            Create your account and start building your career.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold mb-6">
            Create Account
          </h2>

          <form className="space-y-5">

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition"
            >
              Create Account
            </button>

          </form>

          <p className="text-center text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </div>
  )
}

export default Register