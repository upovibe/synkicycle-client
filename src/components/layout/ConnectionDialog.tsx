// src/components/ui/ConnectionDialog.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageCircle, Sparkles } from 'lucide-react';
import type { MatchUser } from '@/api/types/matchTypes';
import { useMatchStore } from '@/api/stores/matchStore';
import { useChatStore } from '@/api/stores/chatStore';
import toast from 'react-hot-toast';

interface ConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetUser: MatchUser;
  connectionType: 'professional' | 'social' | 'both';
}

export function ConnectionDialog({ 
  open, 
  onOpenChange, 
  targetUser, 
  connectionType 
}: ConnectionDialogProps) {
  const { generateConnectionMessage } = useMatchStore();
  const { sendConnectionRequest } = useChatStore();
  const [aiGeneratedMessage, setAiGeneratedMessage] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Generate AI message when dialog opens
  const handleGenerateMessage = async () => {
    setIsGeneratingMessage(true);
    try {
      const message = await generateConnectionMessage(targetUser.id, connectionType);
      setAiGeneratedMessage(message);
      setCustomMessage(message); // Pre-fill with AI message
    } catch (error) {
      console.error('Failed to generate message:', error);
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const handleSendConnection = async () => {
    if (!customMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);
    try {
      // Send real connection request
      const connection = await sendConnectionRequest({
        receiverId: targetUser.id,
        message: customMessage.trim(),
      });

      if (connection) {
        onOpenChange(false);
        
        // Reset form
        setCustomMessage('');
        setAiGeneratedMessage('');
      }
    } catch (error) {
      console.error('Failed to send connection request:', error);
      toast.error('Failed to send connection request');
    } finally {
      setIsSending(false);
    }
  };

  // Generate message when dialog opens
  React.useEffect(() => {
    if (open && !aiGeneratedMessage) {
      handleGenerateMessage();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Connect with {targetUser.name}
          </DialogTitle>
          <DialogDescription>
            Send a personalized message to start your professional connection
          </DialogDescription>
        </DialogHeader>

        {/* Target User Info */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={targetUser.avatar} alt={targetUser.name} />
            <AvatarFallback className="bg-primary text-white">
              {(targetUser.name || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{targetUser.name}</h4>
            <p className="text-sm text-gray-600">@{targetUser.username}</p>
            {targetUser.profession && (
              <p className="text-xs text-gray-500">{targetUser.profession}</p>
            )}
          </div>
          <Badge variant="outline" className="capitalize">
            {connectionType}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Message Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message">Your Message</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateMessage}
                disabled={isGeneratingMessage}
              >
                {isGeneratingMessage ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    {aiGeneratedMessage ? 'Regenerate' : 'AI Generate'}
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="message"
              placeholder={isGeneratingMessage ? "Generating personalized message..." : "Customize your message or click 'AI Generate' for a new suggestion..."}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[100px]"
              disabled={isGeneratingMessage}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {customMessage.length}/500 characters
              </p>
              {aiGeneratedMessage && (
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Generated
                </Badge>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendConnection}
            disabled={isSending || !customMessage.trim()}
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Connection Request'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
