// src/routes/network/matches.tsx

import { createFileRoute } from '@tanstack/react-router';
import { MatchesPage } from '@/components/pages/MatchesPage';

export const Route = createFileRoute('/network/matches')({
  component: MatchesPage,
});