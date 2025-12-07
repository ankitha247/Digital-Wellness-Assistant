from agents.groq_client import get_llm

llm = get_llm()

def run_lifestyle_agent(message: str, profile: dict | None) -> str:
    """
    Provides short, actionable lifestyle improvements.
    No long lists, no questionnaires, no generic lectures.
    """

    prompt = f"""
You are the LifestyleAgent in a wellness assistant.

Your job:
Give SHORT, ACTIONABLE lifestyle suggestions related to:
- routine
- sleep
- habits
- consistency
- stress
- time management

RULES:
- Do NOT ask questions.
- Do NOT request more details.
- Do NOT give long paragraphs.
- Do NOT restate the user's message.
- Provide 3–4 practical tips only.
- Keep response under 5 lines.

User message:
\"\"\"{message}\"\"\"

Profile:
{profile}

Give ONLY helpful lifestyle tips.
"""

    response = llm.invoke(prompt).content
    return response.strip()
