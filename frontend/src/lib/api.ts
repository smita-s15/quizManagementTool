// lib/api.ts
import { Quiz } from "../types/quiz";

// Extend Quiz type to include optional id for frontend/demo purposes
export interface QuizWithID extends Quiz {
  id?: string | number;
}

// Mock storage for demo
const mockQuizzes: Record<string, QuizWithID> = {
  "1": {
    id: "1",
    title: "General Knowledge",
    questions: [
      {
        text: "What is the capital of France?",
        type: "mcq",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: "Paris",
      },
      {
        text: "The Earth is flat.",
        type: "truefalse",
        options: ["True", "False"],
        answer: "False",
      },
      {
        text: "What is 2 + 2?",
        type: "text",
        options: [],
        answer: "4",
      },
    ],
  },
};

/**
 * Create a quiz (mock implementation)
 */
export async function createQuiz(quiz: Quiz): Promise<QuizWithID> {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 1000));

  // Generate ID and save to mock storage
  const id = Date.now().toString();
  const savedQuiz: QuizWithID = { id, ...quiz };
  mockQuizzes[id] = savedQuiz;

  console.log("Saved quiz:", savedQuiz);
  return savedQuiz;
}

/**
 * Fetch quiz by ID (mock implementation)
 */
export async function fetchQuiz(id: string): Promise<QuizWithID> {
  await new Promise((res) => setTimeout(res, 600)); // simulate network

  const quiz = mockQuizzes[id];
  if (!quiz) throw new Error("Quiz not found");

  return quiz;
}

// lib/api.ts
export const getQuiz = async (id: string): Promise<Quiz> => {
  const res = await fetch(`/api/quiz/${id}`);
  if (!res.ok) throw new Error("Quiz not found");
  return res.json();
};
