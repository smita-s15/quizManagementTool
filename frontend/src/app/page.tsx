// app/page.tsx
export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Available Quizzes</h1>
      <a
        href="/take/1"
        className="inline-block px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700"
      >
        Take General Knowledge Quiz
      </a>
    </div>
  );
}
