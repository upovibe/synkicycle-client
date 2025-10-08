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
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to your Network Hub
            </h1>
            <p className="text-gray-600">
              Connect, collaborate, and grow your professional network with AI-powered insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Connections</h3>
              <p className="text-gray-600 text-sm">Discover potential connections based on your interests and goals.</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600 text-sm">Get intelligent recommendations for networking opportunities.</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Track your networking progress and engagement metrics.</p>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {user?.name || 'Not set'}</p>
              <p><span className="font-medium">Username:</span> {user?.username || 'Not set'}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
            </div>
          </div>
        </div>
      </NetworkHubLayout>
    </AuthGuard>
  )
}