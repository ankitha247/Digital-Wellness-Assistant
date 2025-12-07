import json
from agents.groq_client import get_llm

llm = get_llm()


def _extract_json(text: str):
    if not text:
        return None

    text = text.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None

    try:
        return json.loads(text[start : end + 1])
    except json.JSONDecodeError:
        return None


def supervisor(user_message: str, profile: dict | None, state: dict) -> str:
    """
    Pure reasoning LLM supervisor.
    No keywords. No rule-based logic.
    LLM must output only JSON: {"next_agent": "..."}
    """

    SUPERVISOR_PROMPT = f"""
        You are the SUPERVISOR of a multi-agent Digital Wellness Assistant.

Your task:
Decide which ONE agent should run NEXT using pure reasoning based on:
- the user's message
- the user's profile
- information already collected in state

Think like a wellness expert who understands problems holistically.

AGENT SPECIALIZATIONS:

1. SymptomAgent  
   - When the user expresses discomfort, fatigue, stress, pain, dizziness, or low energy.

2. DietAgent  
   - When the concern involves food, nutrition, weight change, appetite, digestion,
     or when weight-loss/gain goals are mentioned.

3. FitnessAgent  
   - When the concern includes exercise, physical activity, gym progress, stamina, or posture.

4. LifestyleAgent  
   - When the issue involves sleep, motivation, consistency, stress, routine,
     productivity, or daily habits.

REASONING RULES:

- Do NOT use keyword matching.
- Infer the underlying needs from the meaning of the user's message.
- Choose ONLY ONE agent at a time.
- Never repeat an agent already in the state.
- Use the minimum number of agents needed to solve the problem.
- Multi-dimensional problems may require 2–4 agents in sequence.
- If all relevant agents have contributed → return FINISH.

WHEN TO STOP:
Return FINISH when:
- Enough insights have been gathered OR
- No remaining agent can add meaningful value.

OUTPUT FORMAT:
Return ONLY valid JSON:

{{
  "next_agent": "DietAgent"
}}

or:

{{
  "next_agent": "FINISH"
}}

No explanations. No markdown.

USER MESSAGE:
\"\"\"{user_message}\"\"\"

PROFILE:
{profile}

STATE:
{state}
"""

    # Run LLM
    raw = llm.invoke(SUPERVISOR_PROMPT).content

    # Extract JSON safely
    data = _extract_json(raw)
    if not data or "next_agent" not in data:
        raise ValueError(
            f"Supervisor did not return valid JSON with 'next_agent'. Raw output:\n{raw}"
        )

    return data["next_agent"]
