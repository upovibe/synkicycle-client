import { useState, useEffect } from 'react';
import { useChatStore } from '@/api/stores/chatStore';
import type { Connection } from '@/api/types/chatTypes';
import { ChatList } from '@/components/chat/ChatList';
import { ChatBox } from '@/components/chat/ChatBox';
import { LoaderOne } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function MessagesPage() {
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
            <div className="border-b bg-background">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatBox connection={selectedConnection} />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout - Side by side */}
      <div className="hidden md:flex gap-4 w-full h-full">
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
          <ChatBox connection={selectedConnection} />
        </div>
      </div>
    </div>
  );
}

