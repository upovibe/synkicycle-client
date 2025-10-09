import { io, Socket } from 'socket.io-client';
import type {
  SocketMessageEvent,
  SocketConnectionEvent,
  SocketTypingEvent,
  SocketReadEvent,
} from '@/api/types/chatTypes';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_API_URL;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Re-attach all listeners after reconnection
    this.socket.on('connect', () => {
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((callback) => {
          this.socket?.on(event, callback);
        });
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Message events
  onNewMessage(callback: (data: SocketMessageEvent) => void) {
    this.on('new-message', callback);
  }

  onMessageDelivered(callback: (data: { messageId: string; connectionId: string }) => void) {
    this.on('message-delivered', callback);
  }

  onMessageRead(callback: (data: SocketReadEvent) => void) {
    this.on('message-read', callback);
  }

  // Connection events
  onNewConnection(callback: (data: SocketConnectionEvent) => void) {
    this.on('new-connection', callback);
  }

  onConnectionAccepted(callback: (data: SocketConnectionEvent) => void) {
    this.on('connection-accepted', callback);
  }

  onConnectionDeclined(callback: (data: SocketConnectionEvent) => void) {
    this.on('connection-declined', callback);
  }

  // Typing events
  onUserTyping(callback: (data: SocketTypingEvent) => void) {
    this.on('user-typing', callback);
  }

  onUserStoppedTyping(callback: (data: SocketTypingEvent) => void) {
    this.on('user-stopped-typing', callback);
  }

  // Emit events
  emitTyping(connectionId: string) {
    this.emit('typing', { connectionId });
  }

  emitStopTyping(connectionId: string) {
    this.emit('stop-typing', { connectionId });
  }

  emitJoinConnection(connectionId: string) {
    this.emit('join-connection', { connectionId });
  }

  emitLeaveConnection(connectionId: string) {
    this.emit('leave-connection', { connectionId });
  }

  // Generic event handlers
  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
    this.socket?.on(event, callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    this.listeners.get(event)?.delete(callback);
    this.socket?.off(event, callback);
  }

  emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  // Clean up specific event listeners
  removeAllListeners(event?: string) {
    if (event) {
      this.listeners.delete(event);
      this.socket?.off(event);
    } else {
      this.listeners.clear();
      this.socket?.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();

