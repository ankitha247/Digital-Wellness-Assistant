from agents.groq_client import get_llm

llm = get_llm()

def run_symptom_agent(message: str, profile: dict | None) -> str:
    """
    Understand symptoms AND provide short, actionable wellness suggestions.
    No long summaries. No repeating user's message. No medical advice.
    """

    prompt = f"""
You are the SymptomAgent in a wellness assistant.

Your job:
- Understand what the user is physically or mentally feeling.
- Extract the main symptoms or discomfort.
- Give helpful, practical suggestions to feel better.

User message:
\"\"\"{message}\"\"\"

User profile (may be None):
{profile}

RESPONSE RULES:
- Use the FEWEST number of sentences needed to help the user.
- Many answers will be only 3-4 short bullet points.
- NEVER exceed 6 short sentences in total.
- Avoid long paragraphs.
- Do NOT repeat the user's message.
- Do NOT ask questions unless absolutely necessary.

Write a concise response now.
"""
    response = llm.invoke(prompt).content
    return response.strip()