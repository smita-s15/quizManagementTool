// app/quiz/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getQuiz, submitQuiz } from "@/lib/api";
import Link from "next/link";

export default function PublicQuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch quiz
  useEffect(() => {
    getQuiz(id as string)
      .then((data) => {
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(""));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const updateAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = value;
    setAnswers(newAnswers);
  };

  const goNext = () => {
    if (
      currentIndex <
      (quiz?.questions.length || 0) + (isSubmitted ? 1 : 0) - 1
    ) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    try {
      const result = await submitQuiz(id as string, answers);
      setScore(result.score);
      setIsSubmitted(true);
      setCurrentIndex(quiz.questions.length);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-20">Loading quiz...</div>;
  if (error || !quiz)
    return (
      <div className="text-center py-20 text-red-600">
        Error: {error || "Quiz not found"}
      </div>
    );

  const slides = [
    ...quiz.questions.map((q: any, idx: number) => (
      <div key={idx} className="w-full shrink-0 px-4">
        <div className="space-y-6 h-full flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-gray-800">{q.text}</h2>

          {/* MCQ */}
          {q.type === "mcq" && q.options && q.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt: string) => {
                const isSelected = answers[idx] === opt;
                const isCorrect = isSubmitted && opt === q.answer;
                const isWrong = isSubmitted && isSelected && opt !== q.answer;

                return (
                  <label
                    key={opt}
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
                      name={`q-${idx}`}
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
          )}

          {/* True/False */}
          {q.type === "truefalse" && (
            <div className="flex gap-4 justify-center">
              {["True", "False"].map((val) => (
                <button
                  key={val}
                  onClick={() => updateAnswer(val)}
                  disabled={isSubmitted}
                  className={`px-8 py-4 rounded-xl font-medium border-2 transition min-w-[120px]
                    ${
                      isSubmitted
                        ? val === q.answer
                          ? "bg-green-100 border-green-600 text-green-800"
                          : val === answers[idx]
                          ? "bg-red-100 border-red-600 text-red-800"
                          : "bg-gray-50 border-gray-300"
                        : val === answers[idx]
                        ? "bg-indigo-50 border-indigo-600 text-indigo-800"
                        : "bg-gray-50 border-gray-300 hover:bg-indigo-50"
                    }`}
                >
                  {val}
                </button>
              ))}
            </div>
          )}

          {/* Text */}
          {q.type === "text" && (
            <input
              type="text"
              placeholder="Type your answer..."
              value={answers[idx] || ""}
              onChange={(e) => updateAnswer(e.target.value)}
              disabled={isSubmitted}
              className={`w-full p-4 text-lg border-2 rounded-xl transition
                ${
                  isSubmitted
                    ? answers[idx]?.trim().toLowerCase() ===
                      q.answer.trim().toLowerCase()
                      ? "border-green-600 bg-green-50"
                      : "border-red-600 bg-red-50"
                    : "border-gray-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200"
                }`}
            />
          )}
        </div>
      </div>
    )),

    // Result Slide
    <div key="result" className="w-full shrink-0 px-4">
      <div className="h-full flex flex-col justify-center items-center text-center space-y-6">
        <h2 className="text-3xl font-bold text-green-700">Quiz Complete!</h2>
        <p className="text-5xl font-bold text-green-800">
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
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
        >
          Take Again
        </button>
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50 py-10 px-4">
      <Link href="/" className="text-black">
        Home
      </Link>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
            {quiz.title}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {isSubmitted && currentIndex === quiz.questions.length
              ? "Result"
              : `Question ${currentIndex + 1} of ${quiz.questions.length}`}
          </p>

          <div className="relative overflow-hidden mb-8 h-[400px]">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {slides}
            </div>
          </div>

          {!isSubmitted && (
            <div className="flex justify-between items-center">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className={`px-6 py-3 rounded-xl font-medium transition ${
                  currentIndex === 0
                    ? "bg-gray-300 text-gray-500"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Previous
              </button>

              {currentIndex < quiz.questions.length - 1 ? (
                <button
                  onClick={goNext}
                  className="px-6 py-3 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={answers.some((a) => !a.trim())}
                  className={`px-10 py-3 rounded-xl font-medium transition
                    ${
                      answers.every((a) => a.trim())
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500"
                    }`}
                >
                  Submit Quiz
                </button>
              )}
            </div>
          )}

          {isSubmitted && currentIndex === quiz.questions.length && (
            <div className="flex justify-center">
              <button
                onClick={goPrev}
                className="px-6 py-3 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Review Answers
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
