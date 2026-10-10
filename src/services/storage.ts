import { QuizAttemptRecord, QuizConfig, Subject, UserStats } from '../types/quiz';

const STORAGE_KEY = 'examnova_quiz_history_v1';
const LEGACY_STORAGE_KEY = 'boardace_quiz_history_v1';

export function getQuizHistory(): QuizAttemptRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as QuizAttemptRecord[];
  } catch (err) {
    console.error('Failed to parse quiz history from localStorage:', err);
    return [];
  }
}

export function saveQuizAttempt(attempt: QuizAttemptRecord): QuizAttemptRecord[] {
  try {
    const history = getQuizHistory();
    const updated = [attempt, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save quiz attempt:', err);
    return [];
  }
}

export function clearQuizHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear quiz history:', err);
  }
}

export function calculateUserStats(history?: QuizAttemptRecord[]): UserStats {
  const attempts = history || getQuizHistory();

  let totalAttempted = 0;
  let totalCorrect = 0;
  const topicMap: Record<string, { correct: number; total: number; subject: Subject }> = {};

  attempts.forEach((att) => {
    att.answers.forEach((ans) => {
      // Find matching question
      const q = att.questions.find((question) => question.id === ans.questionId);
      if (q) {
        totalAttempted += 1;
        if (ans.isCorrect) {
          totalCorrect += 1;
        }

        const topicKey = `${q.subject}::${q.chapter}`;
        if (!topicMap[topicKey]) {
          topicMap[topicKey] = {
            correct: 0,
            total: 0,
            subject: q.subject,
          };
        }
        topicMap[topicKey].total += 1;
        if (ans.isCorrect) {
          topicMap[topicKey].correct += 1;
        }
      }
    });
  });

  const averageScorePercentage =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, item) => sum + item.percentage, 0) / attempts.length
        )
      : 0;

  return {
    totalAttempted,
    totalCorrect,
    averageScorePercentage,
    totalQuizzesCompleted: attempts.length,
    recentAttempts: attempts.slice(0, 5),
    topicPerformances: topicMap,
  };
}

export function getWeakTopics(stats: UserStats, limit: number = 4) {
  const list = Object.entries(stats.topicPerformances).map(([key, data]) => {
    const [subject, chapter] = key.split('::');
    const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    const incorrect = data.total - data.correct;
    return {
      subject: subject as Subject,
      chapter,
      incorrectCount: incorrect,
      totalCount: data.total,
      accuracy,
    };
  });

  // Topics with incorrect answers or lowest accuracy
  return list
    .filter((item) => item.totalCount >= 1 && item.accuracy < 80)
    .sort((a, b) => {
      // lowest accuracy first, then highest incorrect count
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
      return b.incorrectCount - a.incorrectCount;
    })
    .slice(0, limit);
}
