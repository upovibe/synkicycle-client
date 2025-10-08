import { createFileRoute } from '@tanstack/react-router'
import { AuthGuard } from '@/providers/AuthGuard'
import NetworkHubLayout from '@/components/layout/NetworkHubLayout'

export const Route = createFileRoute('/network')({
  component: NetworkPage,
})

function NetworkPage() {
  return (
    <AuthGuard requireAuth={true} redirectTo="/auth/login">
      <NetworkHubLayout>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Your Professional Network
          </h2>
          <p className="text-gray-600">
            This is your AI-powered networking hub. Here you can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Discover new professional connections</li>
            <li>Get AI-powered networking suggestions</li>
            <li>Manage your networking profile</li>
            <li>Track your networking goals</li>
            <li>Join relevant professional groups</li>
            <li>Schedule networking events</li>
          </ul>
        </div>
      </NetworkHubLayout>
    </AuthGuard>
  )
}