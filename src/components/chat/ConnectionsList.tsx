import { useState } from 'react';
import type { Connection } from '@/api/types/chatTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">My Connections</h2>
        
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
      </div>

      {/* Connections List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConnections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <User className="h-8 w-8 mb-2" />
            <p className="text-sm">
              {activeTab === 'sent' ? 'No sent requests' : 'No received requests'}
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
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
                    'flex items-center p-3 rounded-lg cursor-pointer transition-colors',
                    'hover:bg-muted/50',
                    isSelected && 'bg-primary/10 border border-primary/20',
                    isUnread && 'bg-primary/5'
                  )}
                >
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={otherParticipant.avatar} />
                    <AvatarFallback>
                      {otherParticipant.name?.[0] || otherParticipant.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">
                        {otherParticipant.name || otherParticipant.username || 'Unknown User'}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(connection.status)}
                        <span className="text-xs text-muted-foreground">
                          {new Date(connection.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground truncate">
                        {connection.initialMessage || 'No message'}
                      </p>
                      <Badge
                        variant={getStatusBadgeVariant(connection.status)}
                        className="text-xs"
                      >
                        {getStatusText(connection.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
