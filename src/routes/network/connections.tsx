import { createFileRoute } from '@tanstack/react-router';
import ConnectionsPage from '@/components/pages/ConnectionsPage';

export const Route = createFileRoute('/network/connections')({
  component: ConnectionsPage,
});