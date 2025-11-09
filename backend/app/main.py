# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import Quiz, Submission
from app.crud import get_quiz, submit_quiz
from app.database import quizzes

app = FastAPI(title="Quiz API - PyMongo Sync")

# CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed sample quiz on startup
@app.on_event("startup")
def seed_sample_quiz():
    sample_quiz = {
        "id": "1",
        "title": "General Knowledge Quiz",
        "questions": [
            {
                "text": "What is the capital of France?",
                "type": "mcq",
                "options": ["London", "Berlin", "Paris", "Madrid"],
                "answer": "Paris"
            },
            {
                "text": "The Earth is flat.",
                "type": "truefalse",
                "options": ["True", "False"],
                "answer": "False"
            },
            {
                "text": "What is 2 + 2?",
                "type": "text",
                "options": [],
                "answer": "4"
            }
        ]
    }
    quizzes.update_one(
        {"id": "1"},
        {"$set": sample_quiz},
        upsert=True
    )
    print("Sample quiz seeded.")

# GET: Fetch quiz
@app.get("/quizzes/{quiz_id}", response_model=Quiz)
def fetch_quiz(quiz_id: str):
    quiz = get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

# POST: Submit answers
@app.post("/quizzes/{quiz_id}/submit")
def submit_answers(quiz_id: str, submission: Submission):
    result = submit_quiz(quiz_id, submission)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result