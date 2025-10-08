import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary">
              Synkicycle
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <Button asChild>
              <Link to="/auth/login">
                Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}