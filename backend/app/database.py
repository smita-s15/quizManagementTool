# app/database.py
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

# Sync MongoDB client
client = MongoClient(os.getenv("MONGODB_URL"))
db = client[os.getenv("DATABASE_NAME", "quizdb")]
quizzes = db.quizzes  # Collection