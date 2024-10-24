
const colorScheme = {
  background: '#1E1E2E',
  card: '#2A2A3C',
  text: '#E0E0E0',
  error: '#E74C3C',
}

interface ErrorDisplayProps {
  message: string
}

export default function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colorScheme.background }}>
      <div className="text-center p-8 rounded-lg" style={{ backgroundColor: colorScheme.card }}>
        <h2 className="text-2xl font-semibold mb-4" style={{ color: colorScheme.error }}>Error</h2>
        <p style={{ color: colorScheme.text }}>{message}</p>
      </div>
    </div>
  )
}