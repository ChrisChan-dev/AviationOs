import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b'
];

const SYSTEM_PROMPT = 'You are an expert aviation AI flight operations assistant. You help pilots, dispatchers, and aviation professionals with flight tracking, weather analysis, route optimization, contingency planning, and operational decisions. Respond concisely and professionally. User query: ';

async function callGemini(apiKey, prompt, modelIndex = 0, retries = 0) {
  const model = MODELS[modelIndex] || MODELS[0];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: SYSTEM_PROMPT + prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    }
  );

  const data = await response.json();

  if (response.status === 429) {
    const retryMatch = data.error?.message?.match(/retry in ([\d.]+)s/i);
    const waitSec = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 35;

    if (modelIndex + 1 < MODELS.length) {
      return callGemini(apiKey, prompt, modelIndex + 1, 0);
    }

    if (retries < 2) {
      const delay = Math.min(waitSec, 40) * 1000;
      await new Promise(r => setTimeout(r, delay));
      return callGemini(apiKey, prompt, 0, retries + 1);
    }

    return { error: true, message: `Rate limited on all models. Wait ~${waitSec}s and try again.` };
  }

  if (!response.ok) {
    if (modelIndex + 1 < MODELS.length) {
      return callGemini(apiKey, prompt, modelIndex + 1, retries);
    }
    return { error: true, message: data.error?.message || 'Gemini API error' };
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return { error: true, message: 'No response generated.' };
  }

  return { error: false, text, model };
}

function geminiDevProxy() {
  return {
    name: 'gemini-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/gemini', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        const env = loadEnv('', process.cwd(), '');
        const apiKey = env.GEMINI_API_KEY;

        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'GEMINI_API_KEY not found in .env' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { prompt } = JSON.parse(body);
            const result = await callGemini(apiKey, prompt);

            res.setHeader('Content-Type', 'application/json');

            if (result.error) {
              res.statusCode = 429;
              res.end(JSON.stringify({ error: result.message }));
            } else {
              res.statusCode = 200;
              res.end(JSON.stringify({ response: result.text }));
            }
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), geminiDevProxy()],
})
