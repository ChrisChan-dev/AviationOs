import { flightRoutes } from '../data/mockFlights';

function StatusBadge({ status }) {
  const cls = status.toLowerCase().replace(/\s+/g, '-');
  return <span className={`schedule-status status-${cls}`}>{status}</span>;
}

export default function FlightSchedule() {
  return (
    <div className="glass-card animate-in" id="schedule-panel">
      <div className="card-header">
        <span className="card-title">Flight Schedule</span>
        <span className="card-badge">{flightRoutes.length} Flights</span>
      </div>

      <div className="schedule-list">
        {flightRoutes.map(route => (
          <div
            className={`schedule-item ${route.id === 'PR112' ? 'active' : ''}`}
            key={route.id}
          >
            <div className="schedule-route">
              <div className="schedule-codes">
                {route.departure.code}
                <span className="schedule-arrow">━━━✈</span>
                {route.arrival.code}
              </div>
              <div className="schedule-flight-id">
                {route.id} · {route.aircraft}
              </div>
            </div>
            <div className="schedule-times">
              <div className="schedule-time">
                {route.departure.time} → {route.arrival.time}
              </div>
              <StatusBadge status={route.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
