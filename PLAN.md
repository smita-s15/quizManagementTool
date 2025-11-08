# 🧠 Quiz Management System — PLAN.md

## ⏱ Duration

2 hours continuous session

---

## 🎯 Objective

To design and implement a small but production-ready **Quiz Management System** consisting of:

- **Admin Panel** — for quiz creation and management
- **Public Page** — for users to take quizzes and view results

---

## 🧩 Assumptions

1. Single admin (no authentication for simplicity).
2. Quizzes are public — anyone can access via URL.
3. Question types: MCQ, True/False, and Short Text.
4. Only objective questions are auto-scored.
5. Text answers are stored but not evaluated automatically.
6. A working deployment link is optional but preferred.

---

## 🚀 Scope

### In Scope

- Create quiz with title and multiple questions
- Take quiz and view results instantly
- FastAPI backend with MongoDB Atlas
- Next.js frontend with TailwindCSS styling
- Reliable CRUD APIs and error handling

### Out of Scope

- Authentication or roles
- Timer and advanced question logic
- Leaderboard or analytics
- AI-based grading

---

## 🧱 Approach Overview

### **1. Planning & Setup**

- Decide minimal but complete features (create → take → result).
- Set up FastAPI backend and Next.js frontend in parallel.
- Connect both via REST APIs with CORS enabled.

---

### **2. Backend (FastAPI + MongoDB)**

- Define clear data models for `Quiz` and `Submission`.
- Use async operations via Motor (MongoDB driver).
- Implement APIs for:
  - Creating quizzes (admin)
  - Fetching quiz data (public)
  - Submitting answers and computing score
  - Fetching result summary
- Focus on correctness and reliability rather than features.

---

### **3. Frontend (Next.js + TailwindCSS)**

- Keep UI simple and fast:
  - **Admin Page:** Form to create quiz with dynamic question types.
  - **Quiz Page:** Fetch quiz data and render questions.
  - **Result Page:** Show total score and correct answers.
- Use React hooks for state and API interaction.

---

### **4. Integration**

- Test end-to-end:
  - Create a quiz
  - Take it through public link
  - Verify score and data saved in DB
- Adjust backend responses for frontend needs.

---

### **5. Production-Readiness Focus**

- Minimal dependencies and clean folder structure.
- Consistent API design (REST standards).
- Proper error messages and loading states.
- Environment variables for config (DB URL, API base).
- Scalable design — easy to extend later.

---

## ⚙️ Architecture Diagram (Conceptual)
