import { useState } from 'react';
import type { Connection } from '@/api/types/chatTypes';
import { useChatStore } from '@/api/stores/chatStore';
import { useAuthContext } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  User, 
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ConnectionDetailsProps {
  connection: Connection | null;
}

export function ConnectionDetails({ connection }: ConnectionDetailsProps) {
  const { user } = useAuthContext();
  const { respondToConnection } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  if (!connection) {
    return (
      <Card className="flex flex-col h-full border-0 rounded-none md:border md:rounded-lg shadow-none md:shadow-sm">
        <CardContent className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
          <User className="h-20 w-20 mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-semibold mb-2">Select a Connection</h3>
          <p className="text-sm text-center max-w-sm text-muted-foreground">
            Choose a connection from the list to view details and manage your request.
          </p>
        </CardContent>
      </Card>
    );
  }

  const otherParticipant = connection.participants.find(
    (p) => p._id !== connection.initiator._id
  );

  if (!otherParticipant) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Invalid connection</p>
      </div>
    );
  }

  const userId = user?._id || (user as any)?.id;
  const isSentByMe = connection.initiator._id === userId;
  const isAccepted = connection.status === 'accepted';
  const isPending = connection.status === 'pending';
  const isDeclined = connection.status === 'declined';

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await respondToConnection(connection._id, 'accepted');
      // Don't call onConnectionUpdate - real-time socket will handle it
    } catch (error) {
      toast.error('Failed to accept connection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      await respondToConnection(connection._id, 'declined');
      // Don't call onConnectionUpdate - real-time socket will handle it
    } catch (error) {
      toast.error('Failed to decline connection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToNetworkHub = () => {
    // Navigate to Network Hub for messaging
    toast.success('Redirecting to Network Hub...');
    // We'll implement navigation later
  };

  return (
    <Card className="flex flex-col h-full border-0 rounded-none md:border md:rounded-lg shadow-none md:shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={otherParticipant.avatar} />
            <AvatarFallback className="text-lg">
              {otherParticipant.name?.[0] || otherParticipant.username?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {otherParticipant.name || otherParticipant.username || 'Unknown User'}
            </h2>
            <p className="text-muted-foreground">
              {otherParticipant.email}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={isAccepted ? 'default' : isPending ? 'secondary' : 'destructive'}>
                {isAccepted ? 'Connected' : isPending ? 'Pending' : 'Declined'}
              </Badge>
              {isAccepted && <CheckCircle className="h-4 w-4 text-green-500" />}
              {isPending && <Clock className="h-4 w-4 text-yellow-500" />}
              {isDeclined && <XCircle className="h-4 w-4 text-red-500" />}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6 overflow-y-auto">
        {isAccepted ? (
          // Accepted State - Show success with check icon
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-6">
              <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-green-600 mb-2">
                Connected Successfully!
              </h3>
              <p className="text-muted-foreground mb-6">
                You can now start messaging with {otherParticipant.name || otherParticipant.username}
              </p>
            </div>

            {/* Connection Info */}
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Connected:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(connection.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {connection.initialMessage && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Original Message:</p>
                  <p className="text-sm text-muted-foreground">
                    {connection.initialMessage}
                  </p>
                </div>
              )}

              <Button 
                onClick={handleGoToNetworkHub}
                className="w-full mt-6"
                size="lg"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Go to Network Hub
              </Button>
            </div>
          </div>
        ) : (
          // Pending/Declined State - Show connection details
          <div className="space-y-6">
            {/* Connection Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={isPending ? 'secondary' : 'destructive'}>
                  {isPending ? 'Pending' : 'Declined'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">
                  {isSentByMe ? 'Sent:' : 'Received:'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(connection.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Separator />

            {/* Message */}
            <div className="space-y-3">
              <h4 className="font-medium">Connection Message:</h4>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  {connection.initialMessage || 'No message provided'}
                </p>
              </div>
            </div>

            {/* Actions */}
            {isPending && !isSentByMe && (
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </Button>
                <Button
                  onClick={handleAccept}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
              </div>
            )}

            {isPending && isSentByMe && (
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Waiting for {otherParticipant.name || otherParticipant.username} to respond...
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDecline}
                  disabled={isLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Connection Request
                </Button>
              </div>
            )}

            {isDeclined && (
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  This connection request was declined.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
