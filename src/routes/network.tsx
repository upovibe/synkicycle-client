import { createFileRoute } from '@tanstack/react-router'
import { AuthGuard } from '@/providers/AuthGuard'
import NetworkHubLayout from '@/components/layout/NetworkHubLayout'
import { useAuthContext } from '@/providers/AuthProvider'

export const Route = createFileRoute('/network')({
  component: NetworkPage,
})

function NetworkPage() {
  const { user } = useAuthContext()

  return (
    <AuthGuard requireAuth={true} redirectTo="/auth/login">
      <NetworkHubLayout>
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Welcome, {user?.name || user?.username || 'User'}!
          </h2>
          <p className="text-gray-600">
            {user?.email}
          </p>
        </div>
      </NetworkHubLayout>
    </AuthGuard>
  )
}