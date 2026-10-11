import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { generateQuizWithGemini } from '../../src/services/geminiQuizService';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: `Method ${event.httpMethod} Not Allowed. Expected POST.`,
      }),
    };
  }

  try {
    let payload: any = {};
    if (event.body) {
      try {
        payload = JSON.parse(event.body);
      } catch {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            success: false,
            error: 'Invalid JSON request body.',
          }),
        };
      }
    }

    const { subject, chapter, difficulty, count, mode } = payload;

    const result = await generateQuizWithGemini({
      subject,
      chapter,
      difficulty,
      count,
      mode,
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    const isApiKeyError =
      typeof error?.message === 'string' && error.message.includes('GEMINI_API_KEY');

    return {
      statusCode: isApiKeyError ? 500 : 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to generate quiz questions via Gemini AI.',
      }),
    };
  }
};

export default handler;
