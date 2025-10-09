import { useState, useEffect } from 'react';
import { useChatStore } from '@/api/stores/chatStore';
import { useAuthContext } from '@/providers/AuthProvider';
import type { Connection } from '@/api/types/chatTypes';
import { ConnectionsList } from '@/components/chat/ConnectionsList';
import { ConnectionDetails } from '@/components/chat/ConnectionDetails';
import { LoaderOne } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ConnectionsPage() {
  const { user } = useAuthContext();
  const { connections, fetchConnections, connectionsLoading } = useChatStore();
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

  useEffect(() => {
    fetchConnections();
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

  // Filter connections based on active tab
  const filteredConnections = connections.filter((connection) => {
    if (!user || !connection || !connection.initiator) return false;
    
    // Try different possible user ID fields
    const userId = user._id || (user as any).id;
    
    if (!userId) return false;
    
    if (activeTab === 'sent') {
      return connection.initiator._id === userId;
    } else {
      return connection.initiator._id !== userId;
    }
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
      {/* Mobile Layout - Toggle between list and details */}
      <div className="md:hidden w-full h-full">
        {!selectedConnection ? (
          // Show list on mobile when no connection selected
          <ConnectionsList
            connections={filteredConnections}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedConnection={selectedConnection}
            onSelectConnection={handleSelectConnection}
          />
        ) : (
          // Show details on mobile when connection selected
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
              <ConnectionDetails connection={selectedConnection} />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout - Side by side */}
      <div className="hidden md:flex gap-4 w-full h-full">
        {/* Left Section - Connections List */}
        <div className="w-1/3 min-w-[320px]">
          <ConnectionsList
            connections={filteredConnections}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedConnection={selectedConnection}
            onSelectConnection={handleSelectConnection}
          />
        </div>

        {/* Right Section - Connection Details */}
        <div className="flex-1">
          <ConnectionDetails connection={selectedConnection} />
        </div>
      </div>
    </div>
  );
}
