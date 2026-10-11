import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { CURATED_FALLBACK_QUESTIONS } from './src/data/cbseSyllabus.ts';
import { Subject } from './src/types/quiz.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Quiz generation endpoint
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { subject, chapter, difficulty, count } = req.body;

    const validSubjects = ['Physics', 'Chemistry', 'Mathematics'];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ error: 'Invalid subject specified.' });
    }

    const questionCount = Math.min(Math.max(Number(count) || 5, 5), 15);
    const selectedDifficulty = ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium';
    const targetChapter = chapter && chapter !== 'all' ? chapter : 'Comprehensive Mixed Practice (CBSE Syllabus)';

    if (!aiClient) {
      console.info('[ExamNova AI] API key not present, serving curated NCERT Class 12 questions.');
      const fallbackPool = CURATED_FALLBACK_QUESTIONS[subject as Subject] || CURATED_FALLBACK_QUESTIONS['Physics'];
      return res.json({
        success: true,
        questions: fallbackPool.slice(0, questionCount),
        isFallback: true,
        message: 'Loaded verified NCERT Class 12 practice questions (CBSE 2026–27 Syllabus).',
        meta: {
          subject,
          chapter: targetChapter,
          difficulty: selectedDifficulty,
          count: Math.min(questionCount, fallbackPool.length),
          model: 'curated-ncert-benchmark',
        },
      });
    }

    const systemInstruction = `You are a premier senior teacher and curriculum specialist for Indian CBSE Class 12 Board Examinations, strictly adhering to the official CBSE 2026–27 syllabus (Physics Subject Code 042, Chemistry Subject Code 043, Mathematics Subject Code 041) and prescribed NCERT Class XII textbooks.
Your mission is to generate original, board-standard practice multiple-choice questions (MCQs) for Indian Class 12 students.

CRITICAL RULES:
1. Strict CBSE 2026–27 & NCERT Alignment:
   - Content must 100% match the official CBSE 2026–27 course structure.
   - For Physics (042): 14 chapters (Units I to IX).
   - For Chemistry (043): 10 theory units (Solutions to Biomolecules). Do NOT assess formative-only units (Surface Chemistry, Metallurgy, Polymers, Everyday Life) as summative theory.
   - For Mathematics (041): 13 chapters across Units I to VI (Relations & Functions, Algebra, Calculus, Vectors & 3D, LPP, Probability).
2. Question Format: Exactly 4 distinct options per question. One and only one unambiguously correct option.
3. Randomize Correct Option: Distribute the correct answer across indices 0, 1, 2, 3 (do NOT always make option A or index 0 the answer).
4. Question Typology: Mix conceptual reasoning, NCERT-based numerical calculations, and application problems typical of CBSE 1-mark section (Remembering, Understanding, Applying, Analysing).
5. Accuracy & Step-by-Step Numerical Solutions:
   - For Physics: Include proper SI units, verified formulas, and explicit values for constants.
   - For Chemistry: Use correct chemical names, balanced reaction conditions, and IUPAC nomenclature.
   - For Mathematics: Show clean step-by-step logic, verified algebra/calculus, and standard notation.
   - For ALL numerical questions, provide detailed step-by-step solutions with numbered steps.
6. Attribution & Transparency:
   - Never claim an AI-generated question is an official CBSE past question or guaranteed future board question unless verified.
   - Set sourceNote strictly as: "AI-generated NCERT-aligned practice (CBSE 2026–27 Syllabus • NCERT Class XII <Subject> Ch: <ChapterName>)".`;

    const userPrompt = `Generate exactly ${questionCount} multiple-choice questions for CBSE Class 12.
Subject: ${subject}
Chapter/Topic: ${targetChapter}
Difficulty Level: ${selectedDifficulty}

Ensure:
- Exactly 4 options for each question.
- "correctIndex" is an integer between 0 and 3 matching the correct option.
- "conciseExplanation" gives an immediate 1-2 sentence core reason.
- "detailedSolution" gives a step-by-step solution with calculation steps, relevant formulas, and SI units where applicable.
- "chapter" specifies the relevant NCERT Class XII chapter name.
- "sourceNote" specifies "AI-generated NCERT-aligned practice (CBSE 2026–27 Syllabus • NCERT Class XII ${subject}: ${targetChapter})".
- No duplicate questions.`;

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-flash-latest'];
    let rawQuestions: any[] = [];
    let usedModel = 'gemini-3.1-flash-lite';

    for (const modelName of candidateModels) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timed out.')), 15000)
        );

        const generatePromise = aiClient.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                questions: {
                  type: Type.ARRAY,
                  description: `List of exactly ${questionCount} NCERT-aligned questions`,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: {
                        type: Type.STRING,
                        description: 'The complete question statement with clear context and units',
                      },
                      options: {
                        type: Type.ARRAY,
                        description: 'Exactly four distinct answer choices',
                        items: { type: Type.STRING },
                      },
                      correctIndex: {
                        type: Type.INTEGER,
                        description: 'The 0-based index of the correct option (0, 1, 2, or 3)',
                      },
                      conciseExplanation: {
                        type: Type.STRING,
                        description: 'Immediate key concept explaining why the answer is correct',
                      },
                      detailedSolution: {
                        type: Type.STRING,
                        description: 'Step-by-step solution, formula derivation, or reaction explanation',
                      },
                      chapter: {
                        type: Type.STRING,
                        description: 'The relevant NCERT Class 12 chapter title',
                      },
                      difficulty: {
                        type: Type.STRING,
                        description: 'Difficulty tier: Easy, Medium, or Hard',
                      },
                      sourceNote: {
                        type: Type.STRING,
                        description: 'Provenance note: AI-generated NCERT-aligned practice',
                      },
                    },
                    required: ['question', 'options', 'correctIndex', 'conciseExplanation', 'chapter', 'difficulty'],
                  },
                },
              },
              required: ['questions'],
            },
          },
        });

        const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            rawQuestions = parsed.questions;
            usedModel = modelName;
            break;
          }
        }
      } catch (_err) {
        // Continue to next model in fallback chain
      }
    }

    // Rigorous validation of questions: exactly 4 distinct options, valid key 0-3, no duplicates
    const seenStatements = new Set<string>();
    const validatedQuestions: any[] = [];

    for (const q of rawQuestions) {
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
        const normalizedStatement = q.question.trim().toLowerCase().replace(/\s+/g, ' ');
        if (!seenStatements.has(normalizedStatement)) {
          seenStatements.add(normalizedStatement);
          validatedQuestions.push({
            id: `q-${Date.now()}-${validatedQuestions.length + 1}-${Math.random().toString(36).substring(2, 7)}`,
            question: q.question.trim(),
            options: q.options.map((opt: string) => opt.trim()),
            correctIndex: q.correctIndex,
            conciseExplanation: q.conciseExplanation || 'Aligned with NCERT Class 12 curriculum.',
            detailedSolution: q.detailedSolution || q.conciseExplanation || 'Step-by-step NCERT analysis.',
            subject: subject,
            chapter: q.chapter || (chapter !== 'all' ? chapter : 'Comprehensive Practice'),
            difficulty: selectedDifficulty,
            sourceNote:
              q.sourceNote ||
              `AI-generated NCERT-aligned practice (CBSE 2026–27 Syllabus • NCERT Class XII ${subject} Ch: ${q.chapter || targetChapter})`,
          });
        }
      }
    }

    // If validated questions are fewer than requested, backfill from verified syllabus bank without duplicating
    if (validatedQuestions.length < questionCount) {
      const fallbackPool = CURATED_FALLBACK_QUESTIONS[subject as Subject] || CURATED_FALLBACK_QUESTIONS['Physics'];
      for (const item of fallbackPool) {
        const norm = item.question.trim().toLowerCase().replace(/\s+/g, ' ');
        if (validatedQuestions.length < questionCount && !seenStatements.has(norm)) {
          seenStatements.add(norm);
          validatedQuestions.push({
            ...item,
            id: `backfill-${Date.now()}-${validatedQuestions.length + 1}-${Math.random().toString(36).substring(2, 6)}`,
            difficulty: selectedDifficulty,
          });
        }
      }
    }

    if (validatedQuestions.length === 0) {
      throw new Error('Could not validate generated questions from model.');
    }

    res.json({
      success: true,
      questions: validatedQuestions,
      meta: {
        subject,
        chapter: targetChapter,
        difficulty: selectedDifficulty,
        count: validatedQuestions.length,
        model: usedModel,
      },
    });
  } catch (_error: any) {
    console.info('[ExamNova AI] Providing verified NCERT Class 12 practice questions.');
    const fallbackPool = CURATED_FALLBACK_QUESTIONS[req.body.subject as Subject] || CURATED_FALLBACK_QUESTIONS['Physics'];
    let matched = fallbackPool;
    if (req.body.chapter && req.body.chapter !== 'all') {
      const chapterMatches = fallbackPool.filter(
        (q) => q.chapter.toLowerCase() === String(req.body.chapter).toLowerCase()
      );
      if (chapterMatches.length > 0) {
        matched = chapterMatches;
      }
    }

    const questionCount = Math.min(Math.max(Number(req.body.count) || 5, 5), 15);
    const selectedDifficulty = ['Easy', 'Medium', 'Hard'].includes(req.body.difficulty) ? req.body.difficulty : 'Medium';
    const seenFallback = new Set<string>();
    const fallbackList: any[] = [];

    for (const item of matched) {
      const norm = item.question.trim().toLowerCase().replace(/\s+/g, ' ');
      if (fallbackList.length < questionCount && !seenFallback.has(norm)) {
        seenFallback.add(norm);
        fallbackList.push({
          ...item,
          id: `fb-${Date.now()}-${fallbackList.length + 1}-${Math.random().toString(36).substring(2, 6)}`,
          difficulty: selectedDifficulty,
        });
      }
    }

    if (fallbackList.length < questionCount) {
      for (const item of fallbackPool) {
        const norm = item.question.trim().toLowerCase().replace(/\s+/g, ' ');
        if (fallbackList.length < questionCount && !seenFallback.has(norm)) {
          seenFallback.add(norm);
          fallbackList.push({
            ...item,
            id: `fb-${Date.now()}-${fallbackList.length + 1}-${Math.random().toString(36).substring(2, 6)}`,
            difficulty: selectedDifficulty,
          });
        }
      }
    }

    res.json({
      success: true,
      questions: fallbackList.length > 0 ? fallbackList : fallbackPool,
      isFallback: true,
      message: 'Loaded verified NCERT Class 12 practice questions (CBSE 2026–27 Syllabus).',
      meta: {
        subject: req.body.subject,
        chapter: req.body.chapter || 'All Chapters',
        difficulty: selectedDifficulty,
        count: fallbackList.length,
        model: 'curated-ncert-benchmark',
      },
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
