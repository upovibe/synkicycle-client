import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { Toaster } from 'react-hot-toast'

import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { AuthProvider } from '../providers/AuthProvider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const isAuthPage = location.pathname.startsWith('/auth')
  const isNetworkPage = location.pathname.startsWith('/network')

  return (
    <AuthProvider>
      {/* Global Toast Notifications */}
      <Toaster position="top-center" />
      {/* Universal Header - shows on all pages except auth */}
      {!isAuthPage && <Header />}
      <Outlet />
    </AuthProvider>
  )
}
