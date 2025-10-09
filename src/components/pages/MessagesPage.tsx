import { useState, useEffect } from 'react';
import { useChatStore } from '@/api/stores/chatStore';
import { useAuthContext } from '@/providers/AuthProvider';
import type { Connection } from '@/api/types/chatTypes';
import { ChatList } from '@/components/chat/ChatList';
import { LoaderOne } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuthContext();
  const { connections, fetchConnections, connectionsLoading } = useChatStore();
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

  useEffect(() => {
    // Fetch only accepted connections for chat
    fetchConnections({ status: 'accepted' });
  }, [fetchConnections]);

  // Update selected connection when connections change (for real-time updates)
  useEffect(() => {
    if (selectedConnection) {
      const updatedConnection = connections.find(conn => conn && conn._id && conn._id === selectedConnection._id);
      if (!updatedConnection) {
        // Connection was deleted, clear selection
        setSelectedConnection(null);
      } else if (updatedConnection.status !== selectedConnection.status) {
        // Connection status changed, update the selected connection
        setSelectedConnection(updatedConnection);
      }
    }
  }, [connections, selectedConnection]);

  // Filter only accepted connections
  const acceptedConnections = connections.filter((connection) => {
    return connection && connection.status === 'accepted';
  });

  const handleSelectConnection = (connection: Connection) => {
    setSelectedConnection(connection);
  };

  const handleBackToList = () => {
    setSelectedConnection(null);
  };

  if (connectionsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderOne />
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-full">
      {/* Mobile Layout - Toggle between list and chat */}
      <div className="md:hidden w-full h-full">
        {!selectedConnection ? (
          // Show chat list on mobile when no connection selected
          <ChatList
            connections={acceptedConnections}
            selectedConnection={selectedConnection}
            onSelectConnection={handleSelectConnection}
          />
        ) : (
          // Show chat box on mobile when connection selected
          <div className="flex flex-col h-full">
            {/* Back button for mobile */}
            <div className="p-4 border-b bg-background">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Messages
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              {/* TODO: Chat box component will go here */}
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Chat box coming soon...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout - Side by side */}
      <div className="hidden md:flex gap-4 w-full h-full p-4 bg-muted/30">
        {/* Left Section - Chat List */}
        <div className="w-1/3 min-w-[320px]">
          <ChatList
            connections={acceptedConnections}
            selectedConnection={selectedConnection}
            onSelectConnection={handleSelectConnection}
          />
        </div>

        {/* Right Section - Chat Box */}
        <div className="flex-1">
          {/* TODO: Chat box component will go here */}
          {selectedConnection ? (
            <div className="flex items-center justify-center h-full bg-background border rounded-lg text-muted-foreground">
              Chat box coming soon...
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-background border rounded-lg text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

