import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuthContext } from '@/providers/AuthProvider'
import { useStatsStore } from '@/api/stores/statsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoaderOne } from '@/components/ui/loader'
import { Sparkles, UserCheck, MessageSquare, TrendingUp, Users, Network } from 'lucide-react'
import { ProfileViewDialog } from '@/components/layout/ProfileViewDialog'

export function NetworkHomePage() {
  const { user } = useAuthContext()
  const { 
    networkStats, 
    networkStatsLoading, 
    networkStatsError,
    fetchNetworkStats 
  } = useStatsStore()
  
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

  useEffect(() => {
    fetchNetworkStats()
  }, [fetchNetworkStats])

  const quickActions = [
    {
      title: 'AI Matches',
      description: 'Discover connections powered by AI',
      icon: Sparkles,
      link: '/network/matches',
      color: 'bg-primary',
    },
    {
      title: 'Connections',
      description: 'Manage your network requests',
      icon: UserCheck,
      link: '/network/connections',
      color: 'bg-primary',
    },
    {
      title: 'Messages',
      description: 'Chat with your connections',
      icon: MessageSquare,
      link: '/network/messages',
      color: 'bg-primary',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || user?.username}!
        </h1>
        <p className="text-muted-foreground">
          Connect, collaborate, and grow your professional network with AI-powered insights.
        </p>
      </div>

      {/* Profile Card */}
      <Card 
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsProfileDialogOpen(true)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-border">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-xl">
                {user?.name?.[0] || user?.username?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">@{user?.username || 'Not set'}</h3>
              <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.link} to={action.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Network Statistics</h2>
        {networkStatsLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoaderOne />
          </div>
        ) : networkStats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Connections</p>
                    <p className="text-2xl font-bold">{networkStats.connections.total}</p>
                  </div>
                  <Users className="h-10 w-10 text-muted-foreground/20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Messages Sent</p>
                    <p className="text-2xl font-bold">{networkStats.messages.sent}</p>
                  </div>
                  <MessageSquare className="h-10 w-10 text-muted-foreground/20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Match Score</p>
                    <p className="text-2xl font-bold">{networkStats.matchScore}/100</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-muted-foreground/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Failed to load statistics</p>
            {networkStatsError && (
              <p className="text-sm mt-2 text-red-500">{networkStatsError}</p>
            )}
          </div>
        )}
      </div>

      {/* Profile Dialog */}
      <ProfileViewDialog 
        open={isProfileDialogOpen} 
        onOpenChange={setIsProfileDialogOpen} 
      />
    </div>
  )
}

