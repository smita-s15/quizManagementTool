"use client";

import { useState, useEffect } from "react";
import QuestionForm from "../../components/QuestionForm";
import { Question, Quiz } from "../../types/quiz";
import { createQuiz } from "@/lib/api";

export default function AdminPanel() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add a new question and slide to it
  const addQuestion = () => {
    const newQuestion: Question = {
      text: "",
      type: "mcq",
      options: [""],
      answer: "",
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setCurrentIndex(questions.length); // will slide to newly added
  };

  const updateQuestion = (index: number, updated: Question) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (currentIndex >= filtered.length) setCurrentIndex(filtered.length - 1);
      return filtered;
    });
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    if (!quizTitle.trim()) return alert("Quiz title is required.");
    if (questions.length === 0) return alert("Add at least one question.");
    if (questions.some((q) => !q.text.trim() || !q.answer.trim()))
      return alert("All questions must have text and a correct answer.");

    const payload: Omit<Quiz, "id"> = { title: quizTitle, questions };
    try {
      const res = await createQuiz(payload);
      alert(`Quiz created! ID: ${res.id}`);
      setQuizTitle("");
      setQuestions([]);
      setCurrentIndex(0);
    } catch (err) {
      console.error(err);
      alert("Failed to save quiz.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
            Admin Panel – Create Quiz
          </h1>

          {/* Quiz Title */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Quiz Title
            </label>
            <input
              type="text"
              placeholder="e.g., General Knowledge Quiz"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full px-5 py-4 text-xl font-medium border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 transition placeholder-gray-400"
            />
          </div>

          {/* Slider */}
          <div className="relative overflow-hidden mb-8 h-auto max-h-[80vh] transition-all duration-500">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {questions.map((q, idx) => (
                <div key={idx} className="w-full flex-shrink-0 px-2">
                  <QuestionForm
                    question={q}
                    setQuestion={(updated) => updateQuestion(idx, updated)}
                    removeQuestion={() => removeQuestion(idx)}
                  />
                </div>
              ))}
            </div>
            {questions.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-center text-gray-500 py-10 text-lg">
                  No questions yet. Click below to add one.
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          {questions.length > 0 && (
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className={`px-6 py-3 rounded-xl font-medium transition ${
                  currentIndex === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Previous
              </button>

              <span className="text-lg font-semibold text-gray-700">
                Question {currentIndex + 1} of {questions.length}
              </span>

              <button
                onClick={goNext}
                disabled={currentIndex === questions.length - 1}
                className={`px-6 py-3 rounded-xl font-medium transition ${
                  currentIndex === questions.length - 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={addQuestion}
              className="px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition shadow-lg"
            >
              + Add Question
            </button>

            <button
              onClick={handleSubmit}
              disabled={!quizTitle.trim() || questions.length === 0}
              className={`px-8 py-4 font-bold text-lg rounded-xl transition shadow-lg ${
                quizTitle.trim() && questions.length > 0
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Save Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
