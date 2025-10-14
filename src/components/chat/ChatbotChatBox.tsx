import { useState, useEffect, useRef } from 'react';
import { useChatbotStore } from '@/api/stores/chatbotStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, Users, Lightbulb, Sparkles, ArrowLeft, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage, SuggestedUser } from '@/api/types/chatbotTypes';
import type { MatchUser } from '@/api/types/matchTypes';
import { ConnectionDialog } from '@/components/layout/ConnectionDialog';

interface ChatbotChatBoxProps {
  onBack?: () => void;
}

export function ChatbotChatBox({ onBack }: ChatbotChatBoxProps) {
  const {
    currentMessages,
    currentConversationId,
    isLoading,
    isTyping,
    error,
    sendMessage,
    clearError,
    getConversationHistory,
  } = useChatbotStore();

  const [inputMessage, setInputMessage] = useState('');
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<MatchUser | null>(null);
  const [selectedConnectionType, setSelectedConnectionType] = useState<'professional' | 'social' | 'both'>('both');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversation history when component mounts or conversation changes
  useEffect(() => {
    if (currentConversationId && currentMessages.length === 0) {
      getConversationHistory(currentConversationId);
    }
  }, [currentConversationId, getConversationHistory, currentMessages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const message = inputMessage.trim();
    setInputMessage('');

    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea (only on desktop)
  useEffect(() => {
    if (textareaRef.current && window.innerWidth >= 768) { // 768px is md breakpoint
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  // Convert SuggestedUser to MatchUser format
  const convertToMatchUser = (suggestion: SuggestedUser): MatchUser => {
    return {
      id: suggestion.userId,
      uuid: suggestion.userId, // Use userId as uuid for now
      username: suggestion.username,
      name: suggestion.name,
      profession: suggestion.profession,
      bio: suggestion.bio,
      avatar: suggestion.avatar,
      verified: false, // Default to false since we don't have this info
      createdAt: new Date().toISOString(), // Default to current time
      interests: [], // Default empty array since we don't have this info
    };
  };

  const handleConnectClick = (suggestion: SuggestedUser) => {
    const matchUser = convertToMatchUser(suggestion);
    setSelectedUser(matchUser);
    setSelectedConnectionType(suggestion.connectionType || 'both');
    setShowConnectionDialog(true);
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.senderType === 'user';

    return (
      <div
        key={message._id}
        className={cn(
          'flex items-end gap-2 mb-2',
          isUser ? 'justify-end' : 'justify-start'
        )}
      >
        {!isUser && (
          <Avatar className="h-8 w-8 ring-1 ring-border">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
          </Avatar>
        )}

        <div
          className={cn(
            'max-w-[70%] rounded-2xl px-4 py-2 break-words',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm'
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
          
          <div
            className={cn(
              'flex items-center gap-1 mt-1 text-xs',
              isUser 
                ? 'text-primary-foreground/70 justify-end' 
                : 'text-muted-foreground'
            )}
          >
            <span>
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>

        {isUser && (
          <Avatar className="h-8 w-8 ring-1 ring-border">
            <AvatarFallback className="text-xs">
              U
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-full border-0 rounded-none md:border md:rounded-lg shadow-none md:shadow-sm pb-0 px-0.5 py-0 md:py-0">
      {/* Header */}
      <CardHeader className="border-b p-0 md:p-4 !pb-4 shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Beta
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {isTyping ? 'Typing...' : 'Online'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto px-0.5 md:px-4 chat-scrollbar scroll-smooth min-h-0">
        {currentMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Welcome to AI Assistant!</h3>
                <p className="text-sm mb-4">
                  I'm here to help you with networking, finding connections, and improving your profile.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 justify-center">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Find relevant connections</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span>Get profile improvement tips</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span>Learn networking strategies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {currentMessages.map((message) => (
              <div key={message._id}>
                {renderMessage(message)}
                
                {/* AI Suggestions - Outside message bubble */}
                {message.senderType === 'ai' && message.messageType === 'suggestion' && message.metadata?.suggestedUsers && (
                  <div className="mb-4 space-y-3 ml-10 max-w-full overflow-hidden">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <p className="text-sm font-medium text-muted-foreground">Suggested connections:</p>
                    </div>
                    <div className="space-y-3">
                      {message.metadata.suggestedUsers.map((user: SuggestedUser, userIndex: number) => (
                        <div
                          key={userIndex}
                          className="group relative bg-gradient-to-r from-background to-muted/30 border border-border/50 rounded-xl p-3 hover:shadow-md hover:border-primary/20 transition-all duration-200 max-w-full"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-border group-hover:ring-primary/20 transition-colors flex-shrink-0">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {user.name?.[0] || user.username?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-semibold text-sm truncate text-foreground">
                                    {user.name || user.username}
                                  </h4>
                                  {user.username && user.name && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      @{user.username}
                                    </p>
                                  )}
                                </div>
                                {user.matchScore && (
                                  <Badge variant="secondary" className="text-xs font-medium shrink-0">
                                    {user.matchScore}% match
                                  </Badge>
                                )}
                              </div>
                              
                              {user.profession && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {user.profession}
                                </p>
                              )}
                              
                              {user.bio && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {user.bio}
                                </p>
                              )}
                              
                              {(user.reason || user.matchReason) && (
                                <div className="flex items-center gap-1">
                                  <Sparkles className="h-3 w-3 text-yellow-500" />
                                  <p className="text-xs text-muted-foreground">
                                    {user.reason || user.matchReason}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConnectClick(user);
                              }}
                              className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-2 py-1 h-7"
                            >
                              <UserPlus className="h-3 w-3 mr-1" />
                              Connect
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Profile Analysis - Outside message bubble */}
                {message.senderType === 'ai' && message.messageType === 'profile_analysis' && message.metadata && (
                  <div className="mb-4 space-y-3 ml-10">
                    {/* Profile Score */}
                    {message.metadata.profileScore && (
                      <div className="p-3 bg-background border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Profile Completeness</span>
                          <span className="text-sm font-bold text-primary">
                            {message.metadata.profileScore}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${message.metadata.profileScore}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.metadata.profileSuggestions && (
                      <div className="p-3 bg-background border rounded-lg">
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          Suggestions to improve your profile:
                        </h4>
                        <ul className="space-y-1">
                          {message.metadata.profileSuggestions.map((suggestion, suggestionIndex) => (
                            <li key={suggestionIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-end gap-2 mb-2">
                <Avatar className="h-8 w-8 ring-1 ring-border">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-destructive/10 border-t">
            <div className="flex items-center gap-2 text-destructive text-sm">
              <span>⚠️</span>
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="ml-auto"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Input - Sticky Footer */}
      <div className="border-t px-0.5 md:px-4 py-4 pb-0 md:pb-4 shrink-0 bg-background">
        <div className="border rounded-lg p-3 space-y-2">
          {/* Textarea on top */}
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about networking..."
            disabled={isTyping || isLoading}
            className="min-h-[80px] md:max-h-[120px] max-h-[80px] resize-none w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 shadow-none"
            rows={2}
          />

          {/* Action buttons below */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || isLoading}
              className="shrink-0"
            >
              <Send className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Send</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center hidden md:block">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>

      {/* Connection Dialog */}
      {selectedUser && (
        <ConnectionDialog
          open={showConnectionDialog}
          onOpenChange={setShowConnectionDialog}
          targetUser={selectedUser}
          connectionType={selectedConnectionType}
        />
      )}
    </Card>
  );
}
