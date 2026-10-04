import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"

import Dashboard from "./pages/Dashboard"
import ResumeAnalysis from "./pages/ResumeAnalysis"
import JobMatches from "./pages/JobMatches"
import SkillGap from "./pages/SkillGap"
import AIInterview from "./pages/AIInterview"

import AppLayout from "./layouts/AppLayout"


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("access_token")

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public pages */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Protected pages */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/resume"
            element={<ResumeAnalysis />}
          />

          <Route
            path="/jobs"
            element={<JobMatches />}
          />

          <Route
            path="/skills"
            element={<SkillGap />}
          />

          <Route
            path="/interview"
            element={<AIInterview />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App