import { useState } from 'react';

const MOCK_RESPONSES = {
  track: `PR112 (PAL112) is currently en route from Manila (MNL) to Los Angeles (LAX).\n\n▸ Position: 28.4°N, 162.7°W (mid-Pacific)\n▸ Altitude: FL380 | GS: 487 kts | M0.84\n▸ ETA: 06:45 UTC | On schedule\n▸ Aircraft: A350-941 (RP-C3508)\n\nWeather along route: Clear skies ahead. Minor CAT reported FL350-FL390 near 170°W. No significant weather systems impacting the arrival corridor at LAX. ATIS LAX reports VFR conditions, winds 250/12.`,
  weather: `Current weather conditions along active routes:\n\n▸ MNL→LAX (PR112): CAVOK en route. Minor turbulence near 170°W FL350-FL390. LAX: VFR, SCT025, winds 250/12, vis 10SM.\n▸ DXB→JFK (EK215): SIGMET for moderate turbulence over North Atlantic FL350-FL410. Convective activity near 40°W. JFK: MVFR, BKN018, winds 190/15G22.\n▸ SIN→LHR (SQ321): Clear conditions. LHR: VFR, FEW030, winds 270/08.\n▸ SYD→DXB (QF1): Favorable conditions. Tailwinds 45kts at FL400.`,
  contingency: `Contingency analysis for EK215 (DXB→JFK):\n\nPrimary delay: Weather system over North Atlantic\nEstimated delay: 45-90 minutes\n\nOption A — Northern route via Iceland:\n▸ DXB → IST → KEF → JFK | +2h 35m | Fuel: +9,400 kg\n▸ Avoids turbulence corridor entirely\n\nOption B — Southern route via Azores:\n▸ DXB → TER → JFK | +1h 50m | Fuel: +6,200 kg\n▸ Moderate turbulence possible near Azores\n\nRecommendation: Option B preferred for fuel economy. Monitor SIGMET updates for 40°W corridor.`,
  default: `Flight operations status summary:\n\n▸ PR112 MNL→LAX: En route, on schedule, FL380\n▸ SQ321 SIN→LHR: On time, departure in 2h 15m\n▸ EK215 DXB→JFK: DELAYED — weather advisory active\n▸ QF1 SYD→DXB: Boarding at Gate 52, T1\n\nActive alerts: 2 (SIGMET North Pacific, NOTAM LAX RWY 25L)\nAll other systems nominal. Fuel reserves adequate across all flights.`
};

function getMockResponse(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('track') || lower.includes('pr112') || lower.includes('pal')) return MOCK_RESPONSES.track;
  if (lower.includes('weather') || lower.includes('turbulence') || lower.includes('wind')) return MOCK_RESPONSES.weather;
  if (lower.includes('contingency') || lower.includes('delay') || lower.includes('alternative') || lower.includes('ek215')) return MOCK_RESPONSES.contingency;
  return MOCK_RESPONSES.default;
}

export default function AIAgentInput() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setResponse('');
    setSource('');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      if (!res.ok) {
        setResponse(getMockResponse(query));
        setSource('mock');
      } else {
        const data = await res.json();
        setResponse(data.response);
        setSource('gemini');
      }
    } catch {
      setResponse(getMockResponse(query));
      setSource('mock');
    }

    setLoading(false);
  };

  return (
    <div className="glass-card animate-in" id="ai-agent-panel">
      <div className="card-header">
        <span className="card-title">AI Flight Agent</span>
        <span className={`card-badge ${source === 'mock' ? 'amber' : ''}`}>
          {source === 'mock' ? 'Offline' : 'Gemini'}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="ai-input-wrapper">
          <input
            className="ai-input-field"
            type="text"
            placeholder='Track PR112 to LAX and monitor for bad weather'
            value={query}
            onChange={e => setQuery(e.target.value)}
            id="ai-agent-input"
          />
          <button
            className="ai-send-btn"
            type="submit"
            disabled={loading || !query.trim()}
            id="ai-agent-submit"
          >
            ➤
          </button>
        </div>
      </form>

      {loading && (
        <div className="ai-typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {response && !loading && (
        <div className="ai-response" style={{ whiteSpace: 'pre-wrap' }}>{response}</div>
      )}
    </div>
  );
}
