import { createFileRoute, Navigate } from '@tanstack/react-router'
import { HomePage } from '@/components/pages/HomePage'
import { useAuthContext } from '@/providers/AuthProvider'
import { LoaderOne } from '@/components/ui/loader'

function RootIndex() {
  const { isAuthenticated, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderOne />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/network" replace />
  }

  return <HomePage />
}

export const Route = createFileRoute('/')({
  component: RootIndex,
})
