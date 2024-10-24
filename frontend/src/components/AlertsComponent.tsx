const colorScheme = {
  background: '#1E1E2E',
  card: '#2A2A3C',
  accent: '#6E56CF',
  text: '#E0E0E0',
  textSecondary: '#A0A0A0',
  highlight: '#F1C40F',
  error: '#E74C3C',
}

interface AlertsComponentProps {
  alerts: string[]
}

export default function AlertsComponent({ alerts }: AlertsComponentProps) {
  return (
    <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colorScheme.card }}>
      <h2 className="text-2xl font-semibold mb-4" style={{ color: colorScheme.highlight }}>Weather Alerts</h2>
      {alerts.length > 0 ? (
        <ul className="space-y-2">
          {alerts.map((alert, index) => (
            <li key={index} className="p-2 rounded" style={{ backgroundColor: colorScheme.background }}>
              {alert}
            </li>
          ))}
        </ul>
      ) : (
        <p>No active alerts at this time.</p>
      )}
    </div>
  )
}