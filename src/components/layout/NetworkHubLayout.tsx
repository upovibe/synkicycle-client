// import { Outlet } from '@tanstack/react-router'

interface NetworkHubLayoutProps {
  children: React.ReactNode
}

export default function NetworkHubLayout({ children }: NetworkHubLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Network Hub
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome to your AI-powered networking hub! Connect, collaborate, and grow your professional network with intelligent matchmaking.
          </p>
          <div className="border-t pt-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
