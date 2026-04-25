import { useState } from 'react';
import { contingencyRoutes, weatherAlerts } from '../data/mockFlights';

export default function ContingencyPlan() {
  const [generating, setGenerating] = useState(false);
  const [aiPlan, setAiPlan] = useState('');

  const handleGenerate = async () => {
    setGenerating(true);
    setAiPlan('');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'EK215 from Dubai (DXB) to New York (JFK) is delayed due to weather. Generate a brief contingency plan with 2 alternative routes, estimated delays, and fuel impact. Be concise and use aviation terminology.'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiPlan(data.response);
      } else {
        setAiPlan('Contingency generation is available when deployed. Showing pre-configured alternatives below.');
      }
    } catch {
      setAiPlan('Contingency generation is available when deployed. Showing pre-configured alternatives below.');
    }

    setGenerating(false);
  };

  return (
    <div className="glass-card animate-in" id="contingency-panel">
      <div className="card-header">
        <span className="card-title">Contingency Plan</span>
        <span className="card-badge amber">Alert</span>
      </div>

      <div className="contingency-section">
        {weatherAlerts.map((alert, i) => (
          <div className="weather-alert" key={i}>
            <span className="weather-alert-icon">⚠</span>
            <div className="weather-alert-content">
              <div className="weather-alert-type">{alert.type} — {alert.region}</div>
              <div className="weather-alert-desc">{alert.description}</div>
            </div>
          </div>
        ))}

        <div className="contingency-trigger">
          <span className="contingency-trigger-icon">⚡</span>
          EK215 DXB→JFK delayed — weather system over North Atlantic
        </div>

        {contingencyRoutes.map((opt, i) => (
          <div className="contingency-option" key={i}>
            <div className="contingency-option-header">
              <span className="contingency-option-title">{opt.label}</span>
              <span className="contingency-option-time">{opt.addedTime}</span>
            </div>
            <div className="contingency-option-path">{opt.path}</div>
            <div className="contingency-option-reason">{opt.reason}</div>
            <div className="contingency-meta">
              <span>Fuel: {opt.fuelImpact}</span>
              <span>Cost: {opt.costImpact}</span>
            </div>
          </div>
        ))}

        <button
          className="contingency-gen-btn"
          onClick={handleGenerate}
          disabled={generating}
          id="contingency-generate-btn"
        >
          {generating ? 'Generating...' : '✦ Generate AI Contingency'}
        </button>

        {aiPlan && (
          <div className="ai-response">{aiPlan}</div>
        )}
      </div>
    </div>
  );
}
