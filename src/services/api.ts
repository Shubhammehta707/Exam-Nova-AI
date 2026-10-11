import { Question, QuizConfig } from '../types/quiz';

export interface QuizGenerationResult {
  questions: Question[];
  isFallback: boolean;
  message?: string;
  meta?: {
    subject: string;
    chapter: string;
    difficulty: string;
    count: number;
    model: string;
  };
}

/**
 * Invokes the server-side Gemini API endpoint to generate fresh, original,
 * NCERT-aligned multiple-choice questions for CBSE Class 12.
 *
 * Supports both local dev (/api/generate-quiz) and Netlify serverless functions
 * (/.netlify/functions/generate-quiz), while keeping the GEMINI_API_KEY secure.
 */
export async function fetchQuizQuestions(config: QuizConfig): Promise<QuizGenerationResult> {
  const payload = {
    subject: config.subject,
    chapter: config.chapter,
    difficulty: config.difficulty,
    count: config.questionCount,
    mode: config.mode,
  };

  const endpoints = ['/api/generate-quiz', '/.netlify/functions/generate-quiz'];
  let lastError: Error | null = null;
  let response: Response | null = null;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify(payload),
      });

      // If this endpoint returned 404 (e.g. rewrite not matched yet), try next endpoint
      if (res.status === 404 && endpoint === endpoints[0]) {
        continue;
      }

      response = res;
      break;
    } catch (err: any) {
      lastError = err;
      // If network error on primary endpoint, try the direct Netlify function URL
      continue;
    }
  }

  if (!response) {
    throw new Error(
      lastError?.message ||
        'Unable to reach quiz generation API. Please check your internet connection or verify the deployed serverless functions.'
    );
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.error || errorJson.message || '';
    } catch {
      // Body was not JSON
    }

    if (response.status === 404) {
      throw new Error(
        'The quiz generation API endpoint (/api/generate-quiz) was not found (404). If you are on Netlify, ensure netlify/functions/generate-quiz.ts is deployed and netlify.toml is present.'
      );
    }

    if (response.status === 500 && errorDetail.includes('GEMINI_API_KEY')) {
      throw new Error(
        'GEMINI_API_KEY is not configured in Netlify environment variables. Please go to Netlify Site Settings > Environment variables, add GEMINI_API_KEY, and trigger a new deploy.'
      );
    }

    throw new Error(
      errorDetail ||
        `Quiz generation failed with server status ${response.status}. Please check your API quota or retry in a few moments.`
    );
  }

  let data: any;
  try {
    data = await response.json();
  } catch (_e) {
    throw new Error('Received invalid non-JSON response from quiz generation server.');
  }

  if (!data.success || !Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error(
      data.error ||
        data.message ||
        'The AI service could not formulate questions for this topic. Please select a different chapter or try again.'
    );
  }

  // Client-side validation: exactly 4 unique options, valid key 0-3, non-empty questions
  const seen = new Set<string>();
  const validQuestions: Question[] = [];

  for (const q of data.questions) {
    if (
      q &&
      typeof q.question === 'string' &&
      q.question.trim().length > 0 &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.options.every((opt: any) => typeof opt === 'string' && opt.trim().length > 0) &&
      new Set(q.options.map((opt: string) => opt.trim())).size === 4 &&
      typeof q.correctIndex === 'number' &&
      q.correctIndex >= 0 &&
      q.correctIndex <= 3
    ) {
      const norm = q.question.trim().toLowerCase().replace(/\s+/g, ' ');
      if (!seen.has(norm)) {
        seen.add(norm);
        validQuestions.push({
          id: q.id || `q-${Date.now()}-${validQuestions.length + 1}`,
          question: q.question.trim(),
          options: q.options.map((opt: string) => opt.trim()) as [string, string, string, string],
          correctIndex: q.correctIndex,
          conciseExplanation: q.conciseExplanation || 'Aligned with NCERT Class 12 curriculum.',
          detailedSolution: q.detailedSolution || q.conciseExplanation || 'Step-by-step NCERT analysis.',
          subject: q.subject || config.subject,
          chapter: q.chapter || (config.chapter !== 'all' ? config.chapter : 'Comprehensive Practice'),
          difficulty: q.difficulty || config.difficulty,
          sourceNote:
            q.sourceNote ||
            `AI-generated NCERT-aligned practice (CBSE 2026–27 Syllabus • NCERT Class XII ${config.subject})`,
        });
      }
    }
  }

  if (validQuestions.length === 0) {
    throw new Error('The generated questions did not meet standard format requirements. Please retry.');
  }

  return {
    questions: validQuestions,
    isFallback: false,
    message: data.message,
    meta: data.meta,
  };
}
