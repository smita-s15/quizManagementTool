import { NextRequest, NextResponse } from "next/server";
import { quizzes } from "@/lib/db"; // your in-memory or DB store

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const quiz = quizzes.find((q) => q.id === params.id);
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(quiz);
}
