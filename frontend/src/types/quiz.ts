// types/quiz.ts
export type QuestionType = "mcq" | "truefalse" | "text";

export interface Question {
  text: string;
  type: QuestionType;
  options: string[]; // Only for MCQ
  answer: string; // Correct answer
}

export interface Quiz {
  title: string;
  questions: Question[];
}
