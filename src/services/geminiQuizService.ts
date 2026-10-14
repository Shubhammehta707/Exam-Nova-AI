import { GoogleGenAI, Type } from '@google/genai';
import { Question, Subject, Difficulty, Language } from '../types/quiz';

export interface QuizGenerationRequest {
  subject: Subject | string;
  chapter?: string;
  difficulty?: Difficulty | string;
  count?: number;
  mode?: string;
  language?: Language;
}

export interface QuizGenerationResponse {
  success: boolean;
  questions: Question[];
  meta: {
    subject: string;
    chapter: string;
    difficulty: string;
    count: number;
    model: string;
    language: Language;
  };
}

export async function generateQuizWithGemini(
  params: QuizGenerationRequest,
  apiKeyOverride?: string
): Promise<QuizGenerationResponse> {
  const apiKey = apiKeyOverride || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error(
      'GEMINI_API_KEY is not configured in the server environment. On Netlify, please add GEMINI_API_KEY under Site configuration > Environment variables, then re-deploy.'
    );
  }

  const validSubjects = ['Physics', 'Chemistry', 'Mathematics'];
  const subject = validSubjects.includes(String(params.subject)) ? String(params.subject) : 'Physics';
  const questionCount = Math.min(Math.max(Number(params.count) || 5, 5), 15);
  const selectedDifficulty = ['Easy', 'Medium', 'Hard'].includes(String(params.difficulty))
    ? String(params.difficulty)
    : 'Medium';
  const targetChapter =
    params.chapter && params.chapter !== 'all'
      ? String(params.chapter).trim()
      : `Comprehensive Practice (${subject} Syllabus)`;

  const language: Language = params.language === 'hi' ? 'hi' : 'en';

  const aiClient = new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const languageInstruction =
    language === 'hi'
      ? `CRITICAL LANGUAGE REQUIREMENT (HINDI):
The student has selected HINDI (हिन्दी) medium.
1. All question statements, 4 answer options, conciseExplanation, and detailedSolution MUST be written in natural, fluent, grammatically correct Hindi suitable for CBSE Class 12 examinations.
2. Use accurate NCERT Class 12 Hindi educational terminology (e.g. विद्युत क्षेत्र, संधारित्र, अपवाह वेग, नाभिकरागी, समाकलन, अवकलज, आव्यूह, सारणिक, इत्यादि).
3. Strictly preserve standard scientific and mathematical notation, formulas, equations (e.g., E = mc², F = q(v × B), ∫ sin x dx), chemical formulas (e.g., KMnO₄, CH₃COOH), standard SI units (e.g., m/s, J, N, Ω, μF), and numbers.
4. Keep the question phrasing natural, dignified, and academically rigorous for board exams. Avoid unnecessary mixing of English slang.`
      : `CRITICAL LANGUAGE REQUIREMENT (ENGLISH):
The student has selected English medium. Generate all questions, options, conciseExplanation, and detailedSolution in clear, fluent, academic English.`;

  const systemInstruction = `You are a premier senior teacher and curriculum specialist for Indian CBSE Class 12 Board Examinations, strictly adhering to the official CBSE 2026–27 syllabus (Physics Subject Code 042, Chemistry Subject Code 043, Mathematics Subject Code 041) and prescribed NCERT Class XII textbooks.
Your mission is to generate original, fresh, board-standard practice multiple-choice questions (MCQs) for Indian Class 12 students.

${languageInstruction}

CRITICAL RULES:
1. Strict CBSE 2026–27 & NCERT Alignment:
   - Content must 100% match the official CBSE 2026–27 course structure.
   - For Physics (042): 14 chapters (Units I to IX: Electric Charges & Fields, Electrostatic Potential, Current Electricity, Moving Charges, Magnetism, Electromagnetic Induction, AC, EM Waves, Ray Optics, Wave Optics, Dual Nature, Atoms, Nuclei, Semiconductor Electronics).
   - For Chemistry (043): 10 theory units (Solutions, Electrochemistry, Chemical Kinetics, d- and f-Block Elements, Coordination Compounds, Haloalkanes & Haloarenes, Alcohols Phenols & Ethers, Aldehydes Ketones & Carboxylic Acids, Amines, Biomolecules).
   - For Mathematics (041): 13 chapters across Units I to VI (Relations & Functions, Inverse Trigonometric Functions, Matrices, Determinants, Continuity & Differentiability, Applications of Derivatives, Integrals, Applications of Integrals, Differential Equations, Vectors, Three Dimensional Geometry, Linear Programming, Probability).
2. Question Format: Exactly 4 distinct options per question. One and only one unambiguously correct option.
3. Randomize Correct Option: Distribute the correct answer across indices 0, 1, 2, 3 (do NOT always make option A or index 0 the answer).
4. Question Typology: Mix conceptual reasoning, NCERT-based numerical calculations, and application problems typical of CBSE 1-mark section (Remembering, Understanding, Applying, Analysing).
5. Accuracy & Step-by-Step Numerical Solutions:
   - For Physics: Include proper SI units, verified formulas, and explicit values for constants.
   - For Chemistry: Use correct chemical names, balanced reaction conditions, and IUPAC nomenclature.
   - For Mathematics: Show clean step-by-step logic, verified algebra/calculus, and standard notation.
   - For ALL numerical questions, provide detailed step-by-step solutions with numbered steps.
6. Attribution & Transparency:
   - Set sourceNote strictly as: "AI-generated NCERT-aligned practice (CBSE 2026–27 Syllabus • NCERT Class XII ${subject} Ch: ${targetChapter})".`;

  const userPrompt =
    language === 'hi'
      ? `सीबीएसई कक्षा 12 के लिए ठीक ${questionCount} नए, मौलिक बहुविकल्पीय प्रश्न (MCQ) हिन्दी में बनाएं।
विषय: ${subject}
अध्याय / टॉपिक: ${targetChapter}
कठिनाई स्तर: ${selectedDifficulty}

आवश्यकताएं:
- प्रत्येक प्रश्न के लिए ठीक 4 विकल्प (options) हिन्दी में।
- "correctIndex" सही विकल्प से मेल खाता 0 से 3 के बीच एक पूर्णांक है।
- "conciseExplanation" 1-2 वाक्यों में तुरंत मुख्य अवधारणा समझाता है।
- "detailedSolution" चरण-दर-चरण विस्तृत हल, सूत्र और गणना प्रदान करता है।
- "chapter" specifies "${targetChapter}".
- "difficulty" specifies "${selectedDifficulty}".
- "sourceNote" specifies "AI-generated NCERT-aligned practice (CBSE 2026–27 Syllabus • NCERT Class XII ${subject}: ${targetChapter})".
- सभी प्रश्न प्रामाणिक रूप से अध्याय "${targetChapter}" और सीबीएसई पाठ्यक्रम 2026-27 से संबंधित होने चाहिए।`
      : `Generate exactly ${questionCount} fresh, non-repetitive multiple-choice questions for CBSE Class 12 in English.
Subject: ${subject}
Chapter/Topic: ${targetChapter}
Difficulty Level: ${selectedDifficulty}

Requirements:
- Exactly 4 options for each question.
- "correctIndex" is an integer between 0 and 3 matching the correct option.
- "conciseExplanation" gives an immediate 1-2 sentence core reason.
- "detailedSolution" gives a step-by-step solution with calculation steps, relevant formulas, and SI units where applicable.
- "chapter" specifies "${targetChapter}".
- "difficulty" specifies "${selectedDifficulty}".
- "sourceNote" specifies "AI-generated NCERT-aligned practice (CBSE 2026–27 Syllabus • NCERT Class XII ${subject}: ${targetChapter})".
- All questions must be strictly relevant to the chapter "${targetChapter}".`;

  // Candidate models: high throughput, resilient fallback chain
  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-flash-latest'];
  let rawQuestions: any[] = [];
  let usedModel = 'gemini-3.1-flash-lite';
  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`AI generation timed out after 25s on ${modelName}.`)), 25000)
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
                description: `List of exactly ${questionCount} NCERT-aligned questions in ${language === 'hi' ? 'Hindi' : 'English'}`,
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
    } catch (err: any) {
      lastError = err;
      // Continue to next model in fallback chain
    }
  }

  if (rawQuestions.length === 0) {
    const errorDetails = lastError?.message || 'The AI model could not return questions within the time limit.';
    throw new Error(`Failed to generate fresh quiz questions with Gemini: ${errorDetails}`);
  }

  // Validate questions: exactly 4 distinct options, valid correctIndex 0-3, no empty fields
  const seenStatements = new Set<string>();
  const validatedQuestions: Question[] = [];

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
          id: `ai-${Date.now()}-${validatedQuestions.length + 1}-${Math.random().toString(36).substring(2, 7)}`,
          question: q.question.trim(),
          options: q.options.map((opt: string) => opt.trim()) as [string, string, string, string],
          correctIndex: q.correctIndex,
          conciseExplanation:
            q.conciseExplanation ||
            (language === 'hi' ? 'कक्षा 12 एनसीईआरटी पाठ्यक्रम के अनुसार।' : 'Aligned with NCERT Class 12 curriculum.'),
          detailedSolution:
            q.detailedSolution ||
            q.conciseExplanation ||
            (language === 'hi' ? 'चरण-दर-चरण एनसीईआरटी हल।' : 'Step-by-step NCERT analysis.'),
          subject: subject as Subject,
          chapter: q.chapter || targetChapter,
          difficulty: (['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : selectedDifficulty) as Difficulty,
          sourceNote:
            q.sourceNote ||
            `AI-generated NCERT-aligned practice (CBSE 2026–27 Syllabus • NCERT Class XII ${subject} Ch: ${targetChapter})`,
          language,
        });
      }
    }
  }

  if (validatedQuestions.length === 0) {
    throw new Error('AI generated response could not be validated into the required 4-choice MCQ format. Please retry.');
  }

  return {
    success: true,
    questions: validatedQuestions.slice(0, questionCount),
    meta: {
      subject,
      chapter: targetChapter,
      difficulty: selectedDifficulty,
      count: validatedQuestions.slice(0, questionCount).length,
      model: usedModel,
      language,
    },
  };
}
