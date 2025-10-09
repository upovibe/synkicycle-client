import { useState, useEffect } from 'react';
import { useChatStore } from '@/api/stores/chatStore';
import { useAuthContext } from '@/providers/AuthProvider';
import type { Connection } from '@/api/types/chatTypes';
import { ConnectionsList } from '@/components/chat/ConnectionsList';
import { ConnectionDetails } from '@/components/chat/ConnectionDetails';
import { LoaderOne } from '@/components/ui/loader';

export default function ConnectionsPage() {
  const { user } = useAuthContext();
  const { connections, fetchConnections, connectionsLoading } = useChatStore();
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  // Clear selection if selected connection is no longer in the list (deleted via socket)
  useEffect(() => {
    if (selectedConnection) {
      const stillExists = connections.find(conn => conn && conn._id && conn._id === selectedConnection._id);
      if (!stillExists) {
        setSelectedConnection(null);
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

  if (connectionsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderOne />
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-full">
      {/* Left Section - Connections List */}
      <div className="w-1/3 min-w-[320px]">
        <ConnectionsList
          connections={filteredConnections}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedConnection={selectedConnection}
          onSelectConnection={setSelectedConnection}
        />
      </div>

      {/* Right Section - Connection Details */}
      <div className="flex-1">
        <ConnectionDetails connection={selectedConnection} />
      </div>
    </div>
  );
}
