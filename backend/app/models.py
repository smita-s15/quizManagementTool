# app/models.py
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class QuestionType(str, Enum):
    mcq = "mcq"
    truefalse = "truefalse"
    text = "text"

class Question(BaseModel):
    text: str
    type: QuestionType
    options: Optional[List[str]] = None
    answer: str

class Quiz(BaseModel):
    id: str
    title: str
    questions: List[Question]

class Submission(BaseModel):
    answers: List[str]