import { createFileRoute } from '@tanstack/react-router'
import { NetworkHomePage } from '@/components/pages/NetworkHomePage'

export const Route = createFileRoute('/network/')({
  component: NetworkHomePage,
})
