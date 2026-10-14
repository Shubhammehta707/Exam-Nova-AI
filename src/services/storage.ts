import { doc, setDoc, getDocs, collection, query, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
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

export function calculateStudyStreak(attempts: QuizAttemptRecord[]): number {
  if (!attempts || attempts.length === 0) return 0;

  // Extract unique dates in YYYY-MM-DD
  const dateSet = new Set<string>();
  attempts.forEach((att) => {
    try {
      const d = new Date(att.date);
      if (!isNaN(d.getTime())) {
        dateSet.add(d.toISOString().split('T')[0]);
      }
    } catch {
      // Ignore invalid date
    }
  });

  const sortedDates = Array.from(dateSet).sort().reverse();
  if (sortedDates.length === 0) return 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Must have practiced today or yesterday to have an active streak
  if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let expectedDate = new Date(sortedDates[0]);

  for (const dateStr of sortedDates) {
    const curDate = new Date(dateStr);
    const diffDays = Math.round(
      (expectedDate.getTime() - curDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      streak += 1;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
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

// Save quiz attempt directly to Firestore subcollection /users/{userId}/attempts/{attemptId}
export async function saveQuizAttemptToFirestore(
  userId: string,
  attempt: QuizAttemptRecord
): Promise<void> {
  const attemptPath = `users/${userId}/attempts/${attempt.id}`;
  try {
    const attemptRef = doc(db, 'users', userId, 'attempts', attempt.id);
    await setDoc(attemptRef, {
      id: attempt.id,
      userId,
      date: attempt.date,
      subject: attempt.config.subject,
      chapter: attempt.config.chapter,
      difficulty: attempt.config.difficulty,
      mode: attempt.config.mode,
      score: attempt.score,
      total: attempt.total,
      percentage: attempt.percentage,
      timeTakenSeconds: attempt.timeTakenSeconds,
      config: attempt.config,
      answers: attempt.answers,
      questions: attempt.questions,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, attemptPath);
  }
}

// Fetch historical attempts for authenticated user from Firestore
export async function fetchQuizHistoryFromFirestore(
  userId: string
): Promise<QuizAttemptRecord[]> {
  const attemptsCollectionPath = `users/${userId}/attempts`;
  try {
    const attemptsRef = collection(db, 'users', userId, 'attempts');
    const q = query(attemptsRef, orderBy('date', 'desc'), limit(50));
    const querySnapshot = await getDocs(q);

    const records: QuizAttemptRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      records.push({
        id: data.id || docSnap.id,
        date: data.date,
        config: data.config,
        score: data.score,
        total: data.total,
        percentage: data.percentage,
        timeTakenSeconds: data.timeTakenSeconds || 0,
        answers: data.answers || [],
        questions: data.questions || [],
      });
    });

    return records;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, attemptsCollectionPath);
  }
}

// Clear attempts from Firestore
export async function clearQuizHistoryFromFirestore(userId: string): Promise<void> {
  const attemptsCollectionPath = `users/${userId}/attempts`;
  try {
    const attemptsRef = collection(db, 'users', userId, 'attempts');
    const querySnapshot = await getDocs(attemptsRef);
    const deletePromises = querySnapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, attemptsCollectionPath);
  }
}

