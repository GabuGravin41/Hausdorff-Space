import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load local env vars when running the Express dev proxy.
dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.options('/api/openrouter', cors());

// OpenRouter proxy endpoint
app.post('/api/openrouter', async (req, res) => {
  try {
    const apiKey = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('OpenRouter API key not found');
      return res.status(500).json({ error: 'API configuration missing' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const contentType = response.headers.get('content-type') || '';
    const rawBody = await response.text();

    if (!response.ok) {
      console.error(`OpenRouter upstream error (${response.status}):`, rawBody || '[empty body]');
    }

    res.status(response.status);

    if (contentType.includes('application/json')) {
      if (!rawBody) {
        return res.json({ error: `Upstream returned empty JSON response (status ${response.status})` });
      }
      try {
        return res.json(JSON.parse(rawBody));
      } catch {
        // If upstream claims JSON but sends invalid payload, forward safely.
        return res.json({ error: 'Invalid JSON response from upstream provider', raw: rawBody });
      }
    }

    return res.send(rawBody || '');
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
