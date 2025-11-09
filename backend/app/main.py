
# app/main.py
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uuid

from app.models import Quiz, Question, Submission
from app.database import quizzes
from app.crud import get_quiz, submit_quiz

app = FastAPI(title="Quiz API - User Endpoints")

class CreateQuizPayload(BaseModel):
    title: str
    questions: List[Question]
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ————————————————————————
# 1. GET ALL QUIZZES
# ————————————————————————
@app.get("/quizzes", response_model=List[Quiz])
def list_quizzes():
    """Return all quizzes (title + id + question count)"""
    cursor = quizzes.find({}, {"_id": 0})  # Exclude MongoDB _id
    return list(cursor)


# ————————————————————————
# 2. GET ONE QUIZ BY ID
# ————————————————————————
@app.get("/quizzes/{quiz_id}", response_model=Quiz)
def fetch_quiz(quiz_id: str):
    """Fetch a single quiz by its ID"""
    quiz = get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


# ————————————————————————
# 3. SUBMIT QUIZ & GET SCORE
# ————————————————————————
@app.post("/quizzes/{quiz_id}/submit", response_model=dict)
def submit_answers(quiz_id: str, submission: Submission):
    """Submit answers and receive score"""
    result = submit_quiz(quiz_id, submission)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


# ————————————————————————
# OPTIONAL: Seed Sample Quiz (Keep for testing)
# ————————————————————————
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
@app.post("/quizzes", response_model=Quiz, status_code=status.HTTP_201_CREATED)
def create_quiz(payload: CreateQuizPayload):
    quiz_id = str(uuid.uuid4())[:8] 
    doc = {"id": quiz_id, **payload.dict()}
    quizzes.insert_one(doc)
    return Quiz(**doc)
