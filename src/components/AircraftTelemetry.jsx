import { useState, useEffect, useRef } from 'react';
import { telemetryData } from '../data/mockFlights';

function TrendBars({ data, max }) {
  return (
    <div className="telemetry-trend">
      {data.map((v, i) => (
        <div
          key={i}
          className="trend-bar"
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function AircraftTelemetry() {
  const [telemetry, setTelemetry] = useState(telemetryData);
  const [updating, setUpdating] = useState({});
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTelemetry(prev => {
        const altVar = Math.floor((Math.random() - 0.5) * 200);
        const spdVar = Math.floor((Math.random() - 0.5) * 8);
        const machVar = parseFloat(((Math.random() - 0.5) * 0.01).toFixed(3));
        const hdgVar = Math.floor((Math.random() - 0.5) * 3);

        const newAlt = Math.max(30000, Math.min(42000, prev.altitude.value + altVar));
        const newSpd = Math.max(420, Math.min(520, prev.groundSpeed.value + spdVar));
        const newMach = parseFloat(Math.max(0.78, Math.min(0.88, prev.machNumber.value + machVar)).toFixed(2));
        const newHdg = ((prev.heading.value + hdgVar) + 360) % 360;

        const updatedKeys = {};
        if (newAlt !== prev.altitude.value) updatedKeys.altitude = true;
        if (newSpd !== prev.groundSpeed.value) updatedKeys.groundSpeed = true;
        if (newMach !== prev.machNumber.value) updatedKeys.machNumber = true;
        if (newHdg !== prev.heading.value) updatedKeys.heading = true;

        setUpdating(updatedKeys);
        setTimeout(() => setUpdating({}), 600);

        return {
          ...prev,
          altitude: {
            ...prev.altitude,
            value: newAlt,
            trend: [...prev.altitude.trend.slice(1), newAlt]
          },
          groundSpeed: {
            ...prev.groundSpeed,
            value: newSpd,
            trend: [...prev.groundSpeed.trend.slice(1), newSpd]
          },
          machNumber: {
            ...prev.machNumber,
            value: newMach,
            trend: [...prev.machNumber.trend.slice(1), newMach]
          },
          heading: {
            ...prev.heading,
            value: newHdg,
            trend: [...prev.heading.trend.slice(1), newHdg]
          }
        };
      });
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const metrics = [
    { key: 'altitude', label: 'Altitude', max: 42000 },
    { key: 'groundSpeed', label: 'Ground Speed', max: 520 },
    { key: 'machNumber', label: 'Mach Number', max: 1.0 },
    { key: 'heading', label: 'Heading', max: 360 }
  ];

  return (
    <div className="glass-card animate-in" id="telemetry-panel">
      <div className="card-header">
        <span className="card-title">Aircraft Telemetry</span>
        <span className="card-badge">PR112</span>
      </div>

      <div className="telemetry-grid">
        {metrics.map(({ key, label, max }) => (
          <div className="telemetry-item" key={key}>
            <div className="telemetry-label">{label}</div>
            <div className={`telemetry-value ${updating[key] ? 'updating' : ''}`}>
              {key === 'machNumber'
                ? telemetry[key].value.toFixed(2)
                : telemetry[key].value.toLocaleString()}
              <span className="telemetry-unit">{telemetry[key].unit}</span>
            </div>
            {telemetry[key].trend && (
              <TrendBars data={telemetry[key].trend} max={max} />
            )}
          </div>
        ))}
      </div>

      <div className="telemetry-grid" style={{ marginTop: 10 }}>
        <div className="telemetry-item">
          <div className="telemetry-label">V/S</div>
          <div className="telemetry-value">
            {telemetry.verticalSpeed.value}
            <span className="telemetry-unit">{telemetry.verticalSpeed.unit}</span>
          </div>
        </div>
        <div className="telemetry-item">
          <div className="telemetry-label">Wind</div>
          <div className="telemetry-value">
            {telemetry.windDirection.value}°/{telemetry.windSpeed.value}
            <span className="telemetry-unit">kts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
