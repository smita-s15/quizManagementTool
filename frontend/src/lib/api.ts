// lib/api.ts
const API_BASE = "http://localhost:8000";

export interface Question {
  text: string;
  type: "mcq" | "truefalse" | "text";
  options?: string[];
  answer: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export type CreateQuizPayload = Omit<Quiz, "id">;

export interface SubmitResult {
  score: number;
  total: number;
  percentage: number;
}

// CREATE QUIZ
export const createQuiz = async (payload: CreateQuizPayload): Promise<Quiz> => {
  const res = await fetch(`${API_BASE}/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to create");
  return res.json();
};

// GET ALL QUIZZES
export const getQuizzes = async (): Promise<Quiz[]> => {
  const res = await fetch(`${API_BASE}/quizzes`);
  if (!res.ok) throw new Error("Failed to fetch quizzes");
  return res.json();
};

// SUBMIT QUIZ
export const submitQuiz = async (
  quizId: string,
  answers: string[]
): Promise<SubmitResult> => {
  const res = await fetch(`${API_BASE}/quizzes/${quizId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error("Submission failed");
  return res.json();
};
