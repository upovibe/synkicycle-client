import { useState } from 'react';
import type { Connection } from '@/api/types/chatTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, XCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionsListProps {
  connections: Connection[];
  activeTab: 'sent' | 'received';
  onTabChange: (tab: 'sent' | 'received') => void;
  selectedConnection: Connection | null;
  onSelectConnection: (connection: Connection) => void;
}

export function ConnectionsList({
  connections,
  activeTab,
  onTabChange,
  selectedConnection,
  onSelectConnection,
}: ConnectionsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter connections by search query
  const filteredConnections = connections.filter((connection) => {
    const otherParticipant = connection.participants.find(
      (p) => p._id !== connection.initiator._id
    );
    const searchLower = searchQuery.toLowerCase();
    return (
      otherParticipant?.name?.toLowerCase().includes(searchLower) ||
      otherParticipant?.username?.toLowerCase().includes(searchLower) ||
      otherParticipant?.email?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusIcon = (status: Connection['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'declined':
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Connection['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Connected';
      case 'declined':
        return 'Declined';
      default:
        return status;
    }
  };

  const getStatusBadgeVariant = (status: Connection['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'accepted':
        return 'default';
      case 'declined':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="flex flex-col h-full border-0 rounded-none md:border md:rounded-lg shadow-none md:shadow-sm py-0">
      <CardHeader className="border-b p-0 md:p-5">
        <CardTitle className="text-xl">My Connections</CardTitle>
        
        {/* Search */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Tabs */}
        <div className="flex mt-3 space-x-1">
          <Button
            variant={activeTab === 'sent' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('sent')}
            className="flex-1"
          >
            Sent Requests
          </Button>
          <Button
            variant={activeTab === 'received' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('received')}
            className="flex-1"
          >
            Received Requests
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {filteredConnections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
            <User className="h-12 w-12 mb-3 text-muted-foreground/50" />
            <p className="text-sm font-medium">
              {activeTab === 'sent' ? 'No sent requests' : 'No received requests'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTab === 'sent' 
                ? 'Start connecting with people from AI Matches' 
                : 'You haven\'t received any connection requests yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredConnections.map((connection) => {
              const otherParticipant = connection.participants.find(
                (p) => p._id !== connection.initiator._id
              );

              if (!otherParticipant) return null;

              const isSelected = selectedConnection?._id === connection._id;
              const isUnread = activeTab === 'received' && connection.status === 'pending';

              return (
                <div
                  key={connection._id}
                  onClick={() => onSelectConnection(connection)}
                  className={cn(
                    'flex items-center p-0.5 md:p-4 cursor-pointer transition-all duration-200',
                    'hover:bg-muted/50',
                    isSelected && 'bg-primary/10 border-l-4 border-l-primary',
                    isUnread && 'bg-blue-50/50 dark:bg-blue-950/20'
                  )}
                >
                  {/* Avatar */}
                  <Avatar className="h-12 w-12 mr-3 ring-2 ring-border">
                    <AvatarImage src={otherParticipant.avatar} />
                    <AvatarFallback className="text-sm font-semibold">
                      {otherParticipant.name?.[0] || otherParticipant.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {otherParticipant.name || otherParticipant.username || 'Unknown User'}
                      </h3>
                      <Badge
                        variant={getStatusBadgeVariant(connection.status)}
                        className="text-xs px-2 py-0.5 shrink-0"
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(connection.status)}
                          <span>{getStatusText(connection.status)}</span>
                        </div>
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {connection.initialMessage || 'No message'}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(connection.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
