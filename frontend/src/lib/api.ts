// lib/api.ts
import axios from "axios";

const API_BASE = "https://quizmanagementtool.onrender.com/";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ————————————————————————
// Types
// ————————————————————————
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

// ————————————————————————
// API Functions (Axios)
// ————————————————————————

// 1. CREATE QUIZ
export const createQuiz = async (payload: CreateQuizPayload): Promise<Quiz> => {
  try {
    const res = await api.post<Quiz>("/quizzes", payload);
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.detail || err.message || "Failed to create quiz";
    throw new Error(message);
  }
};

// 2. GET ALL QUIZZES
export const getQuizzes = async (): Promise<Quiz[]> => {
  try {
    const res = await api.get<Quiz[]>("/quizzes");
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.detail || err.message || "Failed to load quizzes";
    throw new Error(message);
  }
};

// 3. GET ONE QUIZ
export const getQuiz = async (quizId: string): Promise<Quiz> => {
  try {
    const res = await api.get<Quiz>(`/quizzes/${quizId}`);
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.detail || err.message || "Quiz not found";
    throw new Error(message);
  }
};

// 4. SUBMIT QUIZ
export const submitQuiz = async (
  quizId: string,
  answers: string[]
): Promise<SubmitResult> => {
  try {
    const res = await api.post<SubmitResult>(`/quizzes/${quizId}/submit`, {
      answers,
    });
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.detail || err.message || "Submission failed";
    throw new Error(message);
  }
};
