import { Link, NavLink } from 'react-router-dom'
import useUser from '../hooks/useUser'

function Navbar() {
  const { user } = useUser()

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'relative text-gray-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:rounded-full'
      : 'relative text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <svg
              className="w-8 h-8 text-blue-600 group-hover:text-purple-600 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              VacationPlanner
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <NavLink to="/" className={navLinkClass}>
              <span className="px-5 py-2 block">Home</span>
            </NavLink>
            <NavLink to="/explore" className={navLinkClass}>
              <span className="px-5 py-2 block">Explore</span>
            </NavLink>
            <NavLink to="/planner" className={navLinkClass}>
              <span className="px-5 py-2 block">Planner</span>
            </NavLink>
            <NavLink to="/hotels" className={navLinkClass}>
              <span className="px-5 py-2 block">Hotels</span>
            </NavLink>
            <div className="h-8 w-px bg-gray-200 mx-4"></div>
            <NavLink to="/profile" className={navLinkClass}>
              <span className="px-5 py-2 flex items-center gap-2">
                <span>Hi, {user.firstName}</span>
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
