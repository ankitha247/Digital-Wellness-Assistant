from agents.groq_client import get_llm

llm = get_llm()

def run_symptom_agent(message: str, profile: dict | None) -> str:
    """
    Understand symptoms AND provide short, actionable wellness suggestions.
    No long summaries. No repeating user's message. No medical advice.
    """

    prompt = f"""
You are the SymptomAgent in a wellness assistant.

Your job has two tasks:
1. Understand the user's discomfort or symptom.
2. Give SHORT, actionable tips to feel better (non-medical).

RULES:
- Do NOT repeat or restate the user message.
- Do NOT explain what the symptom "means".
- Do NOT list what the user "needs".
- Give 3–4 practical, helpful tips.
- Keep the response under 5 lines.
- NO diagnosis. NO professional disclaimers.

User message:
\"\"\"{message}\"\"\"

User profile:
{profile}

Now give ONLY actionable tips to reduce the user's discomfort.
"""
    response = llm.invoke(prompt).content
    return response.strip()
