import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthStore } from '@/api/stores/authStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import { BackgroundGradient } from '@/components/ui/background-gradient'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await login(formData)
    if (result.success) {
      toast.success('Login successful! Welcome back!')
      navigate({ to: '/network' })
    } else {
      toast.error(result.error || 'Login failed. Please try again.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left side - Form (mobile: centered, md: 1/2, lg+: 1/3) */}
      <div className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center bg-gray-50 py-12 px-5 sm:px-6 lg:px-8">
        <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
          <div className="w-full">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Welcome to Synkicycle
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
              Sign in to your account to access your AI networking hub
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleChange}
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-8">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                />
              </LabelInputContainer>

              <button
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in →'}
                <BottomGradient />
              </button>

              <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

              <div className="text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Don't have an account?{' '}
                  <Link
                    to="/auth/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Create one here
                  </Link>
                </p>
                <Link
                  to="/"
                  className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  ← Back to home
                </Link>
              </div>
            </form>
          </div>
        </BackgroundGradient>
      </div>
      
      {/* Right side - Background (hidden on mobile, md: 1/2, lg+: 2/3) */}
      <div className="hidden md:block md:w-1/2 lg:w-2/3 overflow-hidden">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(59, 7, 100)"
          gradientBackgroundEnd="rgb(125, 29, 163)"
          firstColor="59, 7, 100"
          secondColor="125, 29, 163"
          thirdColor="255, 119, 48"
          fourthColor="255, 255, 255"
          fifthColor="0, 255, 255"
          pointerColor="140, 100, 255"
          size="80%"
          blendingValue="hard-light"
          interactive={true}
          containerClassName="h-full w-full"
        >
          <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
            <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
              Welcome Back!
            </p>
          </div>
        </BackgroundGradientAnimation>
      </div>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  )
}