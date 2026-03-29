import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import './AppLayout.css'

export function AppLayout() {
  const { logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Student Management</h1>
        <nav className="app-nav" aria-label="Main">
          <NavLink
            to="/students"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            Students
          </NavLink>
          <NavLink
            to="/subjects"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            Subjects
          </NavLink>
          <NavLink
            to="/teachers"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            Teachers
          </NavLink>
        </nav>
        <button type="button" className="btn btn--ghost" onClick={logout}>
          Sign out
        </button>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
