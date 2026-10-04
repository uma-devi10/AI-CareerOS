import { NavLink, Outlet } from "react-router-dom"

function AppLayout() {
  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: "🏠",
    },
    {
      to: "/resume",
      label: "Resume Analysis",
      icon: "📄",
    },
    {
      to: "/jobs",
      label: "Job Matches",
      icon: "💼",
    },
    {
      to: "/skills",
      label: "Skill Gap",
      icon: "🎯",
    },
    {
      to: "/interview",
      label: "AI Interview",
      icon: "🤖",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6">

        <h1 className="text-2xl font-bold text-blue-400 mb-10">
          AI CareerOS
        </h1>

        <nav className="space-y-3">

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        <Outlet />

      </main>

    </div>
  )
}

export default AppLayout