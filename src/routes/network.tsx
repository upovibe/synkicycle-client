import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '@/providers/AuthGuard'
import NetworkHubLayout from '@/components/layout/NetworkHubLayout'

export const Route = createFileRoute('/network')({
  component: NetworkLayout,
})

function NetworkLayout() {
  return (
    <AuthGuard requireAuth={true} redirectTo="/auth/login">
      <NetworkHubLayout>
        <Outlet />
      </NetworkHubLayout>
    </AuthGuard>
  )
}