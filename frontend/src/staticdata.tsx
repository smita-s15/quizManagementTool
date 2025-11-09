import { Quiz } from "./types/quiz";

export const dummyQuiz: Quiz = {
  id: "1",
  title: "General Knowledge Quiz",
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
};
