import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'

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
      {isAuthPage ? (
        <Outlet />
      ) : (
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      )}
    </AuthProvider>
  )
}
