"use client";

import { useState } from "react";
import { Quiz, Question } from "@/types/quiz";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  quiz: Quiz;
}

export default function QuizTaker({ quiz }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const q = quiz.questions[current];

  const setAnswer = (value: string) => {
    setAnswers({ ...answers, [current]: value });
  };

  const next = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setSubmitted(true);
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i]?.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
        correct++;
      }
    });
    return { correct, total: quiz.questions.length };
  };

  const { correct, total } = showResult
    ? calculateScore()
    : { correct: 0, total: 0 };

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          Quiz Complete!
        </h2>
        <div className="text-center mb-8">
          <p className="text-5xl font-bold text-indigo-700">
            {correct} / {total}
          </p>
          <p className="text-xl text-gray-600 mt-2">
            {((correct / total) * 100).toFixed(0)}% Correct
          </p>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((q, i) => {
            const userAns = answers[i] || "";
            const isCorrect =
              userAns.trim().toLowerCase() === q.answer.trim().toLowerCase();
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-xl border-2 ${
                  isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <p className="font-semibold text-lg mb-2">{q.text}</p>
                <p className="text-sm">
                  <strong>Your Answer:</strong>{" "}
                  <span
                    className={isCorrect ? "text-green-700" : "text-red-700"}
                  >
                    {userAns || "—"}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="text-sm text-green-700">
                    <strong>Correct:</strong> {q.answer}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-8 w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
        >
          Take Another Quiz
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        key={current}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl"
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>
              Question {current + 1} of {quiz.questions.length}
            </span>
            <span>
              {Math.round(((current + 1) / quiz.questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-indigo-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((current + 1) / quiz.questions.length) * 100}%`,
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Question */}
        <h3 className="text-2xl font-bold text-gray-800 mb-8">{q.text}</h3>

        {/* Answer Input */}
        <div className="space-y-4 mb-8">
          {q.type === "mcq" && (
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt, i) => (
                <label
                  key={i}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${
                    answers[current] === opt
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${current}`}
                    value={opt}
                    checked={answers[current] === opt}
                    onChange={() => setAnswer(opt)}
                    className="w-5 h-5 text-indigo-600"
                  />
                  <span className="ml-3 font-medium text-lg">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === "truefalse" && (
            <div className="flex gap-4 justify-center">
              {["True", "False"].map((val) => (
                <button
                  key={val}
                  onClick={() => setAnswer(val)}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition ${
                    answers[current] === val
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          )}

          {q.type === "text" && (
            <input
              type="text"
              placeholder="Type your answer..."
              value={answers[current] || ""}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-5 py-4 text-lg font-medium border-2 border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500 focus:border-indigo-600 transition placeholder-gray-400"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          <button
            onClick={next}
            disabled={!answers[current]}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {current === quiz.questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>

        {submitted && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowResult(true)}
              className="px-8 py-4 bg-green-600 text-white font-bold text-xl rounded-xl hover:bg-green-700 transition shadow-lg"
            >
              Show Results
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
