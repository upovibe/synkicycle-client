import { Link } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { useAuthContext } from '@/providers/AuthProvider'
import { useChatStore } from '@/api/stores/chatStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sparkles, UserCheck, MessageSquare, TrendingUp, Users, Network } from 'lucide-react'

export function NetworkHomePage() {
  const { user } = useAuthContext()
  const { connections, messages, fetchConnections } = useChatStore()

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  // Calculate statistics
  const stats = useMemo(() => {
    const userId = user?._id || (user as any)?.id
    
    // Count accepted connections
    const acceptedConnections = connections.filter(conn => conn.status === 'accepted')
    const totalConnections = acceptedConnections.length

    // Count total messages sent by the user
    let totalMessagesSent = 0
    Object.values(messages).forEach(conversationMessages => {
      totalMessagesSent += conversationMessages.filter(msg => msg.sender._id === userId).length
    })

    return {
      totalConnections,
      totalMessagesSent,
    }
  }, [connections, messages, user])

  const quickActions = [
    {
      title: 'AI Matches',
      description: 'Discover connections powered by AI',
      icon: Sparkles,
      link: '/network/matches',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Connections',
      description: 'Manage your network requests',
      icon: UserCheck,
      link: '/network/connections',
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Messages',
      description: 'Chat with your connections',
      icon: MessageSquare,
      link: '/network/messages',
      color: 'from-purple-500 to-violet-600',
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
      <Card>
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
              <h3 className="text-xl font-semibold">{user?.name || 'Not set'}</h3>
              <p className="text-sm text-muted-foreground">@{user?.username || 'Not set'}</p>
              <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            </div>
            <Button variant="outline">Edit Profile</Button>
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
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Connections</p>
                  <p className="text-2xl font-bold">{stats.totalConnections}</p>
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
                  <p className="text-2xl font-bold">{stats.totalMessagesSent}</p>
                </div>
                <MessageSquare className="h-10 w-10 text-muted-foreground/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Messages</p>
                  <p className="text-2xl font-bold">
                    {Object.values(messages).reduce((acc, msgs) => acc + msgs.length, 0)}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-muted-foreground/20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

