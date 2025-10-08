import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AuthGuard } from '@/providers/AuthGuard'

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-100">
        <Outlet />
      </div>
    </AuthGuard>
  )
}