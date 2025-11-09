// types/quiz.ts
export type QuestionType = "mcq" | "truefalse" | "text";

export interface Question {
  text: string;
  type: QuestionType;
  options: string[]; // Only for MCQ
  answer: string; // Correct answer
}

export interface Quiz {
  id?: string; // optional, because new quizzes may not have an ID yet
  title: string;
  questions: Question[];
}

export interface Quiz {
  id?: string;
  title: string;
  questions: Question[];
}

export type CreateQuizPayload = Omit<Quiz, "id">; // ← This is required
