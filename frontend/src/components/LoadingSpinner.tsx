
const colorScheme = {
  background: '#1E1E2E',
  accent: '#6E56CF',
}

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colorScheme.background }}>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent" style={{ borderColor: colorScheme.accent }}></div>
    </div>
  )
}