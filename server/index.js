import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Middleware
app.use(express.json());

// Serve static files with correct MIME types
app.use('/assets', express.static(path.join(__dirname, '../dist/assets'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Constants
const LYZR_AGENT_API_BASE_URL = process.env.LYZR_AGENT_API_BASE_URL || 'https://agent-prod.studio.lyzr.ai';
const LYZR_AGENT_ID = process.env.LYZR_AGENT_ID || '683d443d9bef0c4bbc197a67';
const LYZR_API_KEY = process.env.LYZR_API_KEY || 'sk-default-dqPBaVApdY2aXQ1BOurjzCuCdKDTknpW';
const USER_ID = process.env.USER_ID || 'cvrockers15@gmail.com';
const SESSION_ID = process.env.SESSION_ID || '683d443d9bef0c4bbc197a67-veuqcf131xo';

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    console.log('Received chat request:', { message });

    const response = await fetch(`${LYZR_AGENT_API_BASE_URL}/v3/inference/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LYZR_API_KEY
      },
      body: JSON.stringify({
        user_id: USER_ID,
        agent_id: LYZR_AGENT_ID,
        session_id: SESSION_ID,
        message: message
      })
    });

    if (!response.ok) {
      // Try to parse the error message from the API
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: await response.text() };
      }
      console.error('API Error:', errorData);
      return res.status(response.status).json({ error: errorData.detail || errorData.error || 'Unknown error from Lyzr API' });
    }

    const data = await response.json();
    console.log('API Response:', data);
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Serve the main index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Only start the server if we're not in production (Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the Express app for Vercel
export default app;