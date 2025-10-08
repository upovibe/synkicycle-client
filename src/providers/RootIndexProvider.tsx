import { Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/api/stores/authStore'
import { LoaderOne } from '@/components/ui/loader'

export function RootIndexProvider() {
  const { isAuthenticated, loading } = useAuthStore()

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderOne />
      </div>
    )
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Navigate to="/network" replace />
  } else {
    return <Navigate to="/auth/login" replace />
  }
}
