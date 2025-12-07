Digital Wellness Assistant – Backend (FastAPI + Groq + Multi-Agent System)

This backend powers an AI-driven Digital Wellness Assistant that provides personalized wellness guidance using a hands-off multi-agent architecture built with FastAPI, LangChain, Groq LLM, and MySQL.

The system helps users with:

Symptoms (fatigue, dizziness, headache, etc.)

Diet guidance

Fitness improvements

Lifestyle habits (sleep, routine, stress)

The backend automatically chooses which agent to use based on LLM reasoning, NOT rule-based or keyword matching.

🚀 Features
✔ User Authentication

Signup (email + password)

Login with JWT authentication

Secure password hashing

Google Auth ready

✔ User Profile

Each user can set:

Age

Gender

Weight + Height

Diet Type (Veg / Non-Veg / Vegan / Eggitarian)

Activity Level

Sleep Hours

Health Conditions

This stored profile helps the system give personalized suggestions.

✔ Hands-Off Multi-Agent Architecture

The assistant uses four specialized agents:

Agent	Purpose
SymptomAgent	Understand physical/mental symptoms & give relief tips
DietAgent	Provide diet, nutrition, hydration, protein suggestions
FitnessAgent	Fix workout issues, gym routines, muscle gain problems
LifestyleAgent	Manage sleep, stress, habits, routine

A Supervisor LLM decides:

Which agent should run

How many agents are needed

When to stop (FINISH)

No keyword-based logic is used — everything is decided through LLM reasoning.

🧠 How It Works (Backend Flow)
1️⃣ User signs up / logs in

Auth system creates a user in the database.

2️⃣ User creates their profile

Stored in MySQL and used in all future responses.

3️⃣ User sends a wellness query

Example:

“I feel dizzy during workouts.”

4️⃣ Supervisor LLM decides which agent to call

For example:

SymptomAgent (dizziness)

DietAgent (pre-workout food)

FitnessAgent (intensity issues)

5️⃣ Agents generate short, practical suggestions

Then the supervisor may call another agent if needed.

6️⃣ Chat API returns final JSON
{
  "response": "Your advice here...",
  "agents_used": ["SymptomAgent", "DietAgent"]
}

API Endpoints
Auth

POST /auth/signup

POST /auth/login

Profile

POST /profile/setup – Create or update user profile

Chat

POST /chat

Accepts user message

Returns multi-agent processed response

 Technologies Used

FastAPI – Backend framework

LangChain – Agent & orchestration layer

Groq (Llama 3.x models) – Supervisor + agent reasoning

MySQL – User & profile database

JWT Tokens – Authentication

bcrypt/passlib – Password hashing

Uvicorn – ASGI server

Folder Structure
backend/
│── agents/
│   ├── symptom_agent.py
│   ├── diet_agent.py
│   ├── fitness_agent.py
│   ├── lifestyle_agent.py
│   └── supervisor_agent.py
│
│── orchestrator/
│   └── orchestrator.py
│
│── models/
│   ├── user.py
│   ├── profile.py
│   └── message_history.py
│
│── routers/
│   ├── auth.py
│   ├── profile.py
│   ├── chat.py
│
│── utils/
│   ├── password_hash.py
│   ├── token.py
│   └── db_connection.py
│
│── main.py
│── requirements.txt
│── .env (ignored)

🔐 Environment Variables (.env)
GROQ_API_KEY=your_key_here
JWT_SECRET=your_secret_here
DATABASE_URL=mysql+pymysql://username:password@host/database_name

▶️ Running the Server
1. Create a virtual environment
python -m venv venv

2. Activate it
venv\Scripts\activate   (Windows)

3. Install dependencies
pip install -r requirements.txt

4. Run the app
uvicorn main:app --reload
