import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { useAuth } from './context/useAuth'
import { AppLayout } from './components/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { StudentsPage } from './pages/StudentsPage'
import { SubjectsPage } from './pages/SubjectsPage'
import { TeachersPage } from './pages/TeachersPage'

function ProtectedLayout() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <AppLayout />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<Navigate to="/students" replace />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="teachers" element={<TeachersPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/students" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
