import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration from environment variables with fallbacks
const LYZR_AGENT_API_BASE_URL = process.env.LYZR_AGENT_API_BASE_URL || 'https://agent-prod.studio.lyzr.ai/v3/inference';
const LYZR_AGENT_ID = process.env.LYZR_AGENT_ID || '683d443d9bef0c4bbc197a67';
const LYZR_API_KEY = process.env.LYZR_API_KEY || 'sk-default-dqPBaVApdY2aXQ1BOurjzCuCdKDTknpW';
const USER_ID = process.env.USER_ID || 'cvrockers15@gmail.com';
const SESSION_ID = process.env.SESSION_ID || 'undefined-ct62rp22q4a';

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    console.log(`Received message: ${message}`);
    console.log(`Context:`, context);

    // Build the payload for Lyzr API v3
    const payload = {
      user_id: USER_ID,
      agent_id: LYZR_AGENT_ID,
      session_id: SESSION_ID,
      message: message
    };

    // Make actual API call to Lyzr
    const lyzrResponse = await fetch(`${LYZR_AGENT_API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(300000), // 5 minute timeout
    });

    const responseText = await lyzrResponse.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Lyzr API response as JSON:', parseError);
      throw new Error('Invalid response format from Lyzr API');
    }

    if (!lyzrResponse.ok) {
      console.error('Lyzr API Error Response:', data);
      throw new Error(data.detail || data.error || 'Failed to get response from Lyzr API');
    }

    res.json({ message: data.response || data.message });
  } catch (apiError) {
    console.error('Lyzr API Error:', apiError);
    // More detailed error response
    if (apiError.name === 'AbortError') {
      res.status(504).json({ error: 'Request timed out while waiting for Lyzr API response' });
    } else if (apiError.code === 'UND_ERR_HEADERS_TIMEOUT') {
      res.status(504).json({ error: 'Connection timed out while waiting for Lyzr API headers' });
    } else {
      res.status(500).json({ 
        error: apiError.message || 'Failed to communicate with Lyzr API',
        details: apiError.cause || apiError.stack
      });
    }
  }
});

// For any other route, serve the React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Only start the server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel
export default app;