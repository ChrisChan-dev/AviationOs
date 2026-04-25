import { useState } from 'react';

export default function AIAgentInput() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });

      if (!res.ok) {
        const err = await res.json();
        setResponse(`Error: ${err.error || 'Failed to reach AI agent.'}`);
      } else {
        const data = await res.json();
        setResponse(data.response);
      }
    } catch {
      setResponse('Unable to connect to the AI agent. The serverless function is available when deployed to Vercel.');
    }

    setLoading(false);
  };

  return (
    <div className="glass-card animate-in" id="ai-agent-panel">
      <div className="card-header">
        <span className="card-title">AI Flight Agent</span>
        <span className="card-badge">Gemini</span>
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
        <div className="ai-response">{response}</div>
      )}
    </div>
  );
}
