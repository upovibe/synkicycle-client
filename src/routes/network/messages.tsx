import { createFileRoute } from '@tanstack/react-router';
import MessagesPage from '@/components/pages/MessagesPage';

export const Route = createFileRoute('/network/messages')({
  component: MessagesPage,
});
