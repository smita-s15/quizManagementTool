# app/crud.py
from app.database import quizzes
from app.models import Quiz, Submission

def get_quiz(quiz_id: str):
    """Fetch quiz by custom 'id' field"""
    doc = quizzes.find_one({"id": quiz_id})
    return Quiz(**doc) if doc else None

def submit_quiz(quiz_id: str, submission: Submission):
    """Grade the submission"""
    quiz = get_quiz(quiz_id)
    if not quiz:
        return {"error": "Quiz not found"}
    
    score = 0
    for i, q in enumerate(quiz.questions):
        user_ans = submission.answers[i].strip().lower() if i < len(submission.answers) else ""
        correct_ans = q.answer.strip().lower()
        if user_ans == correct_ans:
            score += 1

    total = len(quiz.questions)
    return {
        "score": score,
        "total": total,
        "percentage": round((score / total) * 100, 2) if total > 0 else 0
    }