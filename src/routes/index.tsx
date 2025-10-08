import { createFileRoute } from '@tanstack/react-router'
import { RootIndexProvider } from '../providers/RootIndexProvider'

export const Route = createFileRoute('/')({
  component: RootIndexProvider,
})
