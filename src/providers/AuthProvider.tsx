import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuthStore } from '@/api/stores/authStore'

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  user: any
  checkAuth: () => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Get auth state from Zustand store
  const { 
    isAuthenticated, 
    loading, 
    user, 
    getProfile,
    logout,
    accessToken 
  } = useAuthStore()
  
  const [hasInitialized, setHasInitialized] = useState(false)

  // Initialize auth status once on mount
  useEffect(() => {
    if (!hasInitialized && accessToken) {
      setHasInitialized(true)
      // Only check auth if we have a token stored
      getProfile()
    } else if (!hasInitialized) {
      setHasInitialized(true)
    }
  }, [hasInitialized, accessToken, getProfile])

  const contextValue: AuthContextType = {
    isAuthenticated,
    loading,
    user,
    checkAuth: getProfile,
    logout
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
