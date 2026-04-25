import { useState, useEffect } from 'react';

export default function TopBar({ timeLapse, onTimeLapseToggle }) {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().slice(11, 19) + ' UTC'
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="topbar-logo">A</div>
        <div>
          <div className="topbar-title">AviationOS</div>
          <div className="topbar-subtitle">Command Center</div>
        </div>
      </div>

      <div className="topbar-center">
        <div className="topbar-status">
          <span className="status-dot"></span>
          Systems Operational
        </div>
        <div className="topbar-status">
          4 Active Flights
        </div>
        <div className="topbar-status">
          2 Alerts
        </div>
      </div>

      <div className="topbar-right">
        <div className="time-display">{utcTime}</div>
        <div
          className={`timelapse-toggle ${timeLapse ? 'active' : ''}`}
          onClick={onTimeLapseToggle}
          id="timelapse-toggle"
        >
          <span className="timelapse-label">Time-Lapse</span>
          <div className="toggle-track">
            <div className="toggle-thumb"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
