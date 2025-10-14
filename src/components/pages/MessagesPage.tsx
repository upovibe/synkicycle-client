import { useState, useEffect } from 'react';
import { useChatStore } from '@/api/stores/chatStore';
import { useChatbotStore } from '@/api/stores/chatbotStore';
import type { Connection } from '@/api/types/chatTypes';
import { ChatList } from '@/components/chat/ChatList';
import { ChatBox } from '@/components/chat/ChatBox';
import { ChatbotChatBox } from '@/components/chat/ChatbotChatBox';
import { LoaderOne } from '@/components/ui/loader';

export default function MessagesPage() {
  const { connections, fetchConnections, connectionsLoading } = useChatStore();
  const { createConversation, setCurrentConversation, getUserConversations } = useChatbotStore();
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    // Fetch only accepted connections for chat
    fetchConnections({ status: 'accepted' });
    // Load chatbot conversations
    getUserConversations();
  }, [fetchConnections, getUserConversations]);

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
    setShowChatbot(false);
    // Clear chatbot conversation when selecting regular connection
    setCurrentConversation(null);
  };

  const handleSelectChatbot = async () => {
    setSelectedConnection(null);
    setShowChatbot(true);
    
    // Get existing conversations first
    const { conversations } = useChatbotStore.getState();
    
    // Check if there's an existing AI Assistant conversation
    const existingConversation = conversations.find(conv => 
      conv.title === 'AI Assistant' && conv.isActive
    );
    
    if (existingConversation) {
      // Load existing conversation
      setCurrentConversation(existingConversation.conversationId);
    } else {
      // Create new conversation
      const conversationId = await createConversation('AI Assistant');
      if (conversationId) {
        setCurrentConversation(conversationId);
      }
    }
  };

  const handleBackToList = () => {
    setSelectedConnection(null);
    setShowChatbot(false);
    // Clear current conversation when going back to list
    setCurrentConversation(null);
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
        {!selectedConnection && !showChatbot ? (
          // Show chat list on mobile when no connection selected
          <ChatList
            connections={acceptedConnections}
            selectedConnection={selectedConnection}
            onSelectConnection={handleSelectConnection}
            onSelectChatbot={handleSelectChatbot}
          />
        ) : (
          // Show chat box on mobile when connection or chatbot selected
          <div className="flex-1 overflow-hidden">
            {showChatbot ? (
              <ChatbotChatBox onBack={handleBackToList} />
            ) : (
              <ChatBox connection={selectedConnection} onBack={handleBackToList} />
            )}
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
            onSelectChatbot={handleSelectChatbot}
          />
        </div>

        {/* Right Section - Chat Box */}
        <div className="flex-1">
          {showChatbot ? (
            <ChatbotChatBox onBack={handleBackToList} />
          ) : (
            <ChatBox connection={selectedConnection} onBack={handleBackToList} />
          )}
        </div>
      </div>
    </div>
  );
}

