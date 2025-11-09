"use client";

import { Question, QuestionType } from "../types/quiz";

interface Props {
  question: Question;
  setQuestion: (q: Question) => void;
  removeQuestion?: () => void;
}

export default function QuestionForm({
  question,
  setQuestion,
  removeQuestion,
}: Props) {
  const updateOption = (idx: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[idx] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const addOption = () => {
    setQuestion({ ...question, options: [...question.options, ""] });
  };

  const removeOption = (idx: number) => {
    setQuestion({
      ...question,
      options: question.options.filter((_, i) => i !== idx),
    });
  };

  const setAnswer = (answer: string) => {
    setQuestion({ ...question, answer });
  };

  return (
    <div className="space-y-6 p-5 bg-white rounded-xl border-2 border-gray-300">
      {/* Question Text */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Question
        </label>
        <input
          type="text"
          placeholder="e.g., What is the capital of France?"
          value={question.text}
          onChange={(e) => setQuestion({ ...question, text: e.target.value })}
          className="w-full px-4 py-3 text-base font-medium border-2 border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-600 transition placeholder-gray-400"
        />
      </div>

      {/* Question Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Type
        </label>
        <select
          value={question.type}
          onChange={(e) => {
            const typeType = e.target.value as QuestionType;
            setQuestion({
              ...question,
              type: e.target.value as QuestionType,
              options: e.target.value === "truefalse" ? ["True", "False"] : [],
              answer: "",
            });
          }}
          className="w-full px-4 py-3 text-base border-2 border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-600 transition"
        >
          <option value="mcq">Multiple Choice (MCQ)</option>
          <option value="truefalse">True / False</option>
          <option value="text">Short Text Answer</option>
        </select>
      </div>

      {/* Options - Only for MCQ */}
      {question.type === "mcq" && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-800">
            Options
          </label>
          {question.options.map((opt, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                placeholder={`Option ${idx + 1}`}
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-600 rounded-md focus:ring-4 focus:ring-blue-500 focus:border-blue-600 transition placeholder-gray-400"
              />
              {question.options.length > 1 && (
                <button
                  onClick={() => removeOption(idx)}
                  className="px-3 text-red-600 hover:text-red-800 font-bold"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addOption}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            + Add Option
          </button>
        </div>
      )}

      {/* Correct Answer */}
      <div>
        <label className="block text-sm font-semibold text-green-700 mb-2">
          Correct Answer
        </label>

        {/* MCQ: Radio Selection */}
        {question.type === "mcq" && question.options.length > 0 && (
          <div className="space-y-2">
            {question.options.map((opt, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition border"
              >
                <input
                  type="radio"
                  name={`answer-${question.text}`}
                  checked={question.answer === opt}
                  onChange={() => setAnswer(opt)}
                  className="w-5 h-5 text-green-600 focus:ring-green-500"
                />
                <span className="font-medium">
                  {opt || `(Option ${idx + 1})`}
                </span>
              </label>
            ))}
          </div>
        )}

        {/* True/False: Buttons */}
        {question.type === "truefalse" && (
          <div className="flex gap-4 justify-center">
            {["True", "False"].map((val) => (
              <button
                key={val}
                onClick={() => setAnswer(val)}
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition ${
                  question.answer === val
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        )}

        {/* Text: Input */}
        {question.type === "text" && (
          <input
            type="text"
            placeholder="e.g., Paris"
            value={question.answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-3 text-base font-medium bg-green-50 border-2 border-green-600 rounded-lg focus:ring-4 focus:ring-green-500 focus:border-green-700 transition placeholder-green-500"
          />
        )}
      </div>

      {removeQuestion && (
        <button
          onClick={removeQuestion}
          className="mt-4 w-full py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
        >
          Remove Question
        </button>
      )}
    </div>
  );
}
