import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateQuizWithGemini } from './src/services/geminiQuizService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  res.json({
    status: 'ok',
    service: 'ExamNova AI Server (Express)',
    hasApiKey,
    timestamp: new Date().toISOString(),
  });
});

// Quiz generation endpoint
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { subject, chapter, difficulty, count, mode } = req.body;
    const result = await generateQuizWithGemini({
      subject,
      chapter,
      difficulty,
      count,
      mode,
    });
    return res.json(result);
  } catch (error: any) {
    const isApiKeyError =
      typeof error?.message === 'string' && error.message.includes('GEMINI_API_KEY');
    return res.status(isApiKeyError ? 500 : 502).json({
      success: false,
      error: error.message || 'Failed to generate quiz questions via Gemini AI.',
    });
  }
});

// Vite middleware in dev or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Exam Nova AI Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
