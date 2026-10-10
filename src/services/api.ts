import { CURATED_FALLBACK_QUESTIONS } from '../data/cbseSyllabus';
import { Question, QuizConfig, Subject } from '../types/quiz';

export interface QuizGenerationResult {
  questions: Question[];
  isFallback: boolean;
  message?: string;
}

function getFallbackQuestions(config: QuizConfig): QuizGenerationResult {
  const curatedPool = CURATED_FALLBACK_QUESTIONS[config.subject] || CURATED_FALLBACK_QUESTIONS['Physics'];
  let matched = curatedPool;
  if (config.chapter !== 'all') {
    const chapterMatches = curatedPool.filter(
      (q) => q.chapter.toLowerCase() === config.chapter.toLowerCase()
    );
    if (chapterMatches.length > 0) {
      matched = chapterMatches;
    }
  }

  const generated: Question[] = [];
  const seenStatements = new Set<string>();

  // 1. Add matching chapter questions first without repetition
  for (const item of matched) {
    const norm = item.question.trim().toLowerCase().replace(/\s+/g, ' ');
    if (generated.length < config.questionCount && !seenStatements.has(norm)) {
      seenStatements.add(norm);
      generated.push({
        ...item,
        id: `curated-${Date.now()}-${generated.length + 1}-${Math.random().toString(36).substring(2, 6)}`,
        difficulty: config.difficulty,
      });
    }
  }

  // 2. If more questions are needed to reach the requested count, backfill from other chapters without duplicate
  if (generated.length < config.questionCount) {
    for (const item of curatedPool) {
      const norm = item.question.trim().toLowerCase().replace(/\s+/g, ' ');
      if (generated.length < config.questionCount && !seenStatements.has(norm)) {
        seenStatements.add(norm);
        generated.push({
          ...item,
          id: `curated-${Date.now()}-${generated.length + 1}-${Math.random().toString(36).substring(2, 6)}`,
          difficulty: config.difficulty,
        });
      }
    }
  }

  return {
    questions: generated.length > 0 ? generated : curatedPool.slice(0, config.questionCount),
    isFallback: true,
    message: 'Loaded verified NCERT Class 12 practice questions (CBSE 2026–27 Syllabus).',
  };
}

export async function fetchQuizQuestions(config: QuizConfig): Promise<QuizGenerationResult> {
  try {
    const response = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(28000),
      body: JSON.stringify({
        subject: config.subject,
        chapter: config.chapter,
        difficulty: config.difficulty,
        count: config.questionCount,
        mode: config.mode,
      }),
    });

    if (!response.ok) {
      console.warn(`Server responded with ${response.status}, providing verified NCERT questions.`);
      return getFallbackQuestions(config);
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.questions) || data.questions.length === 0) {
      console.warn('Server returned empty question set, providing verified NCERT questions.');
      return getFallbackQuestions(config);
    }

    // Client-side safety validation: exactly 4 unique options, valid key 0-3, no duplicate questions
    const seen = new Set<string>();
    const validQuestions: Question[] = [];

    for (const q of data.questions) {
      if (
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
            sourceNote: q.sourceNote || `AI-generated NCERT-aligned practice (CBSE 2026–27 Syllabus • NCERT Class XII ${config.subject})`,
          });
        }
      }
    }

    if (validQuestions.length < config.questionCount) {
      const fallbackSet = getFallbackQuestions(config);
      for (const item of fallbackSet.questions) {
        const norm = item.question.trim().toLowerCase().replace(/\s+/g, ' ');
        if (validQuestions.length < config.questionCount && !seen.has(norm)) {
          seen.add(norm);
          validQuestions.push(item);
        }
      }
    }

    if (validQuestions.length === 0) {
      return getFallbackQuestions(config);
    }

    return {
      questions: validQuestions,
      isFallback: Boolean(data.isFallback),
      message: data.message,
    };
  } catch (error: any) {
    console.warn('AI quiz generation encountered an issue, activating verified NCERT fallback questions:', error);
    return getFallbackQuestions(config);
  }
}
