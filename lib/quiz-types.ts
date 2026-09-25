/** Shared between the quiz UI, the exam UI and the generation route. */

export type QuizOption = { id: string; text: string };

export type QuizQuestion = {
  id: string;
  topic: string;
  prompt: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
};

export type Difficulty = "easy" | "medium" | "hard";

export type GradedAnswer = {
  question: QuizQuestion;
  chosenId?: string;
  correct: boolean;
};

export type QuizResult = {
  mode: "quiz" | "exam";
  topic: string;
  difficulty: Difficulty;
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  answers: GradedAnswer[];
  /** Per-topic accuracy, used for the strong / revise lists. */
  byTopic: { topic: string; correct: number; total: number; percent: number }[];
  seconds: number;
  finishedAt: string;
};

/** Grades a finished run. No network, no AI — pure arithmetic. */
export function gradeQuiz({
  mode,
  topic,
  difficulty,
  questions,
  answers,
  seconds,
  passMark = 80,
}: {
  mode: "quiz" | "exam";
  topic: string;
  difficulty: Difficulty;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  seconds: number;
  passMark?: number;
}): QuizResult {
  const graded: GradedAnswer[] = questions.map((question) => {
    const chosenId = answers[question.id];
    return { question, chosenId, correct: chosenId === question.correctId };
  });

  const score = graded.filter((a) => a.correct).length;
  const total = questions.length;
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);

  const topicMap = new Map<string, { correct: number; total: number }>();
  for (const answer of graded) {
    const key = answer.question.topic;
    const entry = topicMap.get(key) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (answer.correct) entry.correct += 1;
    topicMap.set(key, entry);
  }

  const byTopic = [...topicMap.entries()]
    .map(([name, value]) => ({
      topic: name,
      correct: value.correct,
      total: value.total,
      percent: Math.round((value.correct / value.total) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);

  return {
    mode,
    topic,
    difficulty,
    score,
    total,
    percent,
    passed: percent >= passMark,
    answers: graded,
    byTopic,
    seconds,
    finishedAt: new Date().toISOString(),
  };
}

export function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins} min ${String(secs).padStart(2, "0")} s`;
}
