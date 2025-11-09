"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getQuiz } from "@/lib/api";
import { Question, Quiz } from "@/types/quiz";

export default function PublicQuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch quiz on mount
  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getQuiz(id as string);
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(""));
      } catch (err) {
        setError("Failed to load quiz. It may not exist or has been deleted.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [id]);

  // Update answer for current question
  const updateAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);
  };

  // Navigation
  const goNext = () => {
    if (currentIndex < (quiz?.questions.length ?? 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Submit quiz
  const handleSubmit = () => {
    if (!quiz) return;

    const correct = quiz.questions.reduce((acc, q, i) => {
      return (
        acc +
        (answers[i].trim().toLowerCase() === q.answer.trim().toLowerCase()
          ? 1
          : 0)
      );
    }, 0);

    setScore(correct);
    setIsSubmitted(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-xl font-semibold text-indigo-700">
          Loading quiz...
        </div>
      </div>
    );
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-red-600 text-xl font-bold mb-2">Quiz Not Found</p>
          <p className="text-gray-600">{error || "This quiz doesn't exist."}</p>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
            {quiz.title}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Question {currentIndex + 1} of {quiz.questions.length}
          </p>

          {/* === SLIDER === */}
          <div className="relative overflow-hidden mb-8 h-[400px]">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                width: `${quiz.questions.length * 100}%`,
              }}
            >
              {quiz.questions.map((q, idx) => (
                <div
                  key={idx}
                  className="w-full flex-shrink-0 px-4"
                  style={{ width: `${100 / quiz.questions.length}%` }}
                >
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {q.text}
                    </h2>

                    {q.type === "mcq" && q.options?.length ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, i) => {
                          const isSelected = answers[idx] === opt;
                          const isCorrect = isSubmitted && opt === q.answer;
                          const isWrong =
                            isSubmitted && isSelected && opt !== q.answer;

                          return (
                            <label
                              key={i}
                              className={`block p-4 rounded-xl border-2 cursor-pointer transition
                                ${
                                  isSubmitted
                                    ? isCorrect
                                      ? "bg-green-100 border-green-600 text-green-800"
                                      : isWrong
                                      ? "bg-red-100 border-red-600 text-red-800"
                                      : "border-gray-300 bg-gray-50"
                                    : isSelected
                                    ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                                    : "border-gray-300 hover:border-indigo-400"
                                }`}
                            >
                              <input
                                type="radio"
                                name={`question-${idx}`}
                                value={opt}
                                checked={answers[idx] === opt}
                                onChange={() => updateAnswer(opt)}
                                disabled={isSubmitted}
                                className="sr-only"
                              />
                              <span className="font-medium">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Type your answer here..."
                        value={answers[idx] || ""}
                        onChange={(e) => updateAnswer(e.target.value)}
                        disabled={isSubmitted}
                        className={`w-full p-4 text-lg border-2 rounded-xl transition
                          ${
                            isSubmitted
                              ? answers[idx].trim().toLowerCase() ===
                                q.answer.trim().toLowerCase()
                                ? "border-green-600 bg-green-50"
                                : "border-red-600 bg-red-50"
                              : "border-gray-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200"
                          }`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* === NAVIGATION === */}
          {!isSubmitted && quiz.questions.length > 1 && (
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

              <button
                onClick={goNext}
                disabled={currentIndex === quiz.questions.length - 1}
                className={`px-6 py-3 rounded-xl font-medium transition ${
                  currentIndex === quiz.questions.length - 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* === SUBMIT BUTTON === */}
          {!isSubmitted && (
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={answers.some((a) => !a.trim())}
                className={`px-10 py-4 text-lg font-bold rounded-xl transition shadow-lg
                  ${
                    answers.every((a) => a.trim())
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Submit Quiz
              </button>
            </div>
          )}

          {/* === RESULTS === */}
          {isSubmitted && (
            <div className="text-center mt-8 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <h2 className="text-3xl font-bold text-green-700 mb-2">
                Quiz Complete!
              </h2>
              <p className="text-5xl font-bold text-green-800 my-4">
                {score} / {quiz.questions.length}
              </p>
              <p className="text-lg text-gray-700">
                {score === quiz.questions.length
                  ? "Perfect score! You're a genius!"
                  : score >= quiz.questions.length * 0.7
                  ? "Great job!"
                  : "Keep practicing!"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
              >
                Take Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
