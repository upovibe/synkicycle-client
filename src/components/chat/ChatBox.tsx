import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';
import { useChatStore } from '@/api/stores/chatStore';
import type { Connection, Message } from '@/api/types/chatTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { LoaderOne } from '@/components/ui/loader';
import { 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

interface ChatBoxProps {
  connection: Connection | null;
}

export function ChatBox({ connection }: ChatBoxProps) {
  const { user } = useAuthContext();
  const { 
    messages, 
    messagesLoading, 
    fetchMessages, 
    sendMessage, 
    setTyping,
    typingUsers,
  } = useChatStore();
  
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const userId = user?._id || (user as any)?.id;
  const connectionMessages = connection ? messages[connection._id] || [] : [];

  // Find the other participant
  const otherParticipant = connection?.participants.find(
    (p) => p._id !== userId
  );

  // Check if other user is typing
  const isOtherUserTyping = connection 
    ? Array.from(typingUsers[connection._id] || []).some(id => id !== userId)
    : false;

  // Fetch messages when connection changes
  useEffect(() => {
    if (connection) {
      fetchMessages(connection._id);
    }
  }, [connection, fetchMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [connectionMessages, isOtherUserTyping]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageInput]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);

    // Emit typing indicator
    if (connection && e.target.value.trim()) {
      setTyping(connection._id, true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(connection._id, false);
      }, 2000);
    } else if (connection) {
      setTyping(connection._id, false);
    }
  };

  const handleSendMessage = async () => {
    if (!connection || !messageInput.trim() || isSending) return;

    setIsSending(true);
    const messageText = messageInput.trim();
    setMessageInput('');

    // Stop typing indicator
    setTyping(connection._id, false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      await sendMessage({
        connectionId: connection._id,
        content: messageText,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message on error
      setMessageInput(messageText);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const formatDateDivider = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  const getMessageStatus = (message: Message) => {
    if (message.sender._id !== userId) return null;

    switch (message.status) {
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case 'sending':
        return <Clock className="h-3 w-3 text-muted-foreground animate-pulse" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  const shouldShowDateDivider = (currentMessage: Message, previousMessage: Message | null) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.createdAt).toDateString();
    const previousDate = new Date(previousMessage.createdAt).toDateString();
    
    return currentDate !== previousDate;
  };

  if (!connection) {
    return (
      <Card className="flex flex-col h-full">
        <CardContent className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <Smile className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold mb-2">No Conversation Selected</h3>
            <p className="text-sm">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!otherParticipant) {
    return (
      <Card className="flex flex-col h-full">
        <CardContent className="flex flex-col items-center justify-center h-full text-destructive">
          <AlertCircle className="h-16 w-16 mb-4" />
          <p>Invalid conversation</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full border-0 rounded-none md:border md:rounded-lg shadow-none md:shadow-sm md:py-0">
      {/* Header */}
      <CardHeader className="border-b p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-border">
              <AvatarImage src={otherParticipant.avatar} />
              <AvatarFallback>
                {otherParticipant.name?.[0] || otherParticipant.username?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-base">
                {otherParticipant.name || otherParticipant.username || 'Unknown User'}
              </h3>
              {isOtherUserTyping && (
                <p className="text-xs text-primary animate-pulse">typing...</p>
              )}
            </div>
          </div>

          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoaderOne />
          </div>
        ) : connectionMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Smile className="h-12 w-12 mb-3 text-muted-foreground/30" />
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <>
            {connectionMessages.map((message, index) => {
              const isMyMessage = message.sender._id === userId;
              const previousMessage = index > 0 ? connectionMessages[index - 1] : null;
              const showDateDivider = shouldShowDateDivider(message, previousMessage);

              return (
                <div key={message._id}>
                  {/* Date Divider */}
                  {showDateDivider && (
                    <div className="flex items-center justify-center my-4">
                      <div className="px-3 py-1 bg-muted rounded-full">
                        <span className="text-xs text-muted-foreground font-medium">
                          {formatDateDivider(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      'flex items-end gap-2 mb-2',
                      isMyMessage ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {!isMyMessage && (
                      <Avatar className="h-8 w-8 ring-1 ring-border">
                        <AvatarImage src={message.sender.avatar} />
                        <AvatarFallback className="text-xs">
                          {message.sender.name?.[0] || message.sender.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        'max-w-[70%] rounded-2xl px-4 py-2 break-words',
                        isMyMessage
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      <div
                        className={cn(
                          'flex items-center gap-1 mt-1 text-xs',
                          isMyMessage 
                            ? 'text-primary-foreground/70 justify-end' 
                            : 'text-muted-foreground'
                        )}
                      >
                        <span>{formatMessageTime(message.createdAt)}</span>
                        {getMessageStatus(message)}
                      </div>
                    </div>

                    {isMyMessage && (
                      <Avatar className="h-8 w-8 ring-1 ring-border">
                        <AvatarImage src={message.sender.avatar} />
                        <AvatarFallback className="text-xs">
                          {message.sender.name?.[0] || message.sender.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {isOtherUserTyping && (
              <div className="flex items-end gap-2 mb-2">
                <Avatar className="h-8 w-8 ring-1 ring-border">
                  <AvatarImage src={otherParticipant.avatar} />
                  <AvatarFallback className="text-xs">
                    {otherParticipant.name?.[0] || otherParticipant.username?.[0] || 'U'}
                  </AvatarFallback>
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
          </>
        )}
      </CardContent>

      {/* Input */}
      <div className="border-t p-4 shrink-0">
        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="shrink-0">
            <Smile className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={messageInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="min-h-[40px] max-h-[120px] resize-none pr-12"
              rows={1}
            />
          </div>

          <Button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSending}
            size="icon"
            className="shrink-0"
          >
            {isSending ? (
              <div className="h-5 w-5 flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
              </div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </Card>
  );
}

