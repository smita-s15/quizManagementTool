// app/page.tsx
import Link from "next/link";
import { getQuizzes } from "@/lib/api";

export default async function Home() {
  let quizzes: any[] = [];
  let error = null;

  try {
    quizzes = await getQuizzes();
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-700 mb-3">Quiz App</h1>
          <p className="text-xl text-gray-600">
            Choose a quiz and test your knowledge!
          </p>
        </div>

        {error ? (
          <div className="text-center text-red-600 p-6 bg-red-50 rounded-xl max-w-md mx-auto">
            Error: {error}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-xl shadow-lg max-w-md mx-auto">
            <p className="text-lg text-gray-600 mb-4">No quizzes available.</p>
            <Link
              href="/admin"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700"
            >
              Create a Quiz
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/quiz/${quiz.id}`}
                className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-indigo-700 group-hover:text-indigo-800">
                    {quiz.title}
                  </h2>
                  <span className="text-sm text-gray-500">ID: {quiz.id}</span>
                </div>
                <p className="text-gray-600">
                  {quiz.questions.length} question
                  {quiz.questions.length !== 1 ? "s" : ""}
                </p>
                <div className="mt-4 text-sm text-indigo-600 font-medium group-hover:underline">
                  Start Quiz
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/admin"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
          >
            + Create New Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
