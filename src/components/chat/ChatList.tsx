import { useState } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import type { Connection } from '@/api/types/chatTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatListProps {
  connections: Connection[];
  selectedConnection: Connection | null;
  onSelectConnection: (connection: Connection) => void;
}

export function ChatList({
  connections,
  selectedConnection,
  onSelectConnection,
}: ChatListProps) {
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  const userId = user?._id || (user as any)?.id;

  // Filter connections by search query
  const filteredConnections = connections.filter((connection) => {
    // Find the other participant (not the current user)
    const otherParticipant = connection.participants.find(
      (p) => p._id !== userId
    );
    const searchLower = searchQuery.toLowerCase();
    return (
      otherParticipant?.name?.toLowerCase().includes(searchLower) ||
      otherParticipant?.username?.toLowerCase().includes(searchLower) ||
      otherParticipant?.email?.toLowerCase().includes(searchLower)
    );
  });

  // Format time
  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now.getTime() - messageDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <Card className="flex flex-col h-full border-0 rounded-none md:border md:rounded-lg shadow-none md:shadow-sm md:py-0">
      <CardHeader className="border-b p-0 md:p-5">
        <CardTitle className="text-xl">Messages</CardTitle>
        
        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {filteredConnections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
            <MessageSquare className="h-12 w-12 mb-3 text-muted-foreground/50" />
            <p className="text-sm font-medium">No conversations yet</p>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {searchQuery 
                ? 'No conversations match your search' 
                : 'Accept connection requests to start chatting'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredConnections.map((connection) => {
              // Find the other participant (not the current user)
              const otherParticipant = connection.participants.find(
                (p) => p._id !== userId
              );

              if (!otherParticipant) return null;

              const isSelected = selectedConnection?._id === connection._id;
              const hasUnread = false; // TODO: Implement unread count

              return (
                <div
                  key={connection._id}
                  onClick={() => onSelectConnection(connection)}
                  className={cn(
                    'flex items-center p-4 cursor-pointer transition-all duration-200',
                    'hover:bg-muted/50',
                    isSelected && 'bg-primary/10 border-l-4 border-l-primary',
                    hasUnread && 'bg-blue-50/50 dark:bg-blue-950/20'
                  )}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-border">
                      <AvatarImage src={otherParticipant.avatar} />
                      <AvatarFallback className="text-sm font-semibold">
                        {otherParticipant.name?.[0] || otherParticipant.username?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator - TODO: Implement online status */}
                    {/* <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" /> */}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 ml-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">
                        {otherParticipant.name || otherParticipant.username || 'Unknown User'}
                      </h3>
                      {connection.lastMessageAt && (
                        <span className="text-xs text-muted-foreground ml-2 shrink-0">
                          {formatTime(connection.lastMessageAt)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate">
                        {connection.initialMessage || 'Start a conversation...'}
                      </p>
                      {hasUnread && (
                        <Badge className="ml-2 h-5 min-w-5 rounded-full text-xs px-1.5 shrink-0">
                          3
                        </Badge>
                      )}
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

