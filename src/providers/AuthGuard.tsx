import { useEffect, useState } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuthContext } from '@/providers/AuthProvider'
import { LoaderOne } from '@/components/ui/loader'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export const AuthGuard = ({ 
  children, 
  requireAuth = false, 
  redirectTo = "/" 
}: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuthContext()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Only show loading on initial app load, not on navigation
  useEffect(() => {
    if (!loading) {
      setIsInitialLoad(false)
    }
  }, [loading])

  // Show loading only on initial app load
  if (loading && isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderOne />
      </div>
    )
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // If authentication is NOT required but user IS authenticated (e.g., login page)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/network" replace />
  }

  // For all other cases, render the children
  return <>{children}</>
}
