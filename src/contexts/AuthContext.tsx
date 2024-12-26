import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type AuthContextType = {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

// Usuários de teste para desenvolvimento local
const TEST_USERS = [
  {
    email: 'teste@exemplo.com',
    password: 'senha123'
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verifica se já existe um token salvo
    const token = localStorage.getItem('auth_token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Em desenvolvimento, verifica as credenciais localmente
    const user = TEST_USERS.find(
      u => u.email === email && u.password === password
    )

    if (user) {
      localStorage.setItem('auth_token', 'fake_token_for_development')
      setIsAuthenticated(true)
      return true
    }

    return false
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 