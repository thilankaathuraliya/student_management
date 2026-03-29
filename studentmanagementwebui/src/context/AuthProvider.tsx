import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../api/endpoints'
import { getStoredToken, setStoredToken } from '../api/client'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(() => getStoredToken())

  useEffect(() => {
    const onUnauthorized = () => {
      setToken(null)
      navigate('/login', { replace: true })
    }
    window.addEventListener('sm-unauthorized', onUnauthorized)
    return () => window.removeEventListener('sm-unauthorized', onUnauthorized)
  }, [navigate])

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiLogin(username, password)
    setStoredToken(res.token)
    setToken(res.token)
    navigate('/students', { replace: true })
  }, [navigate])

  const logout = useCallback(() => {
    setStoredToken(null)
    setToken(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, login, logout],
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}
