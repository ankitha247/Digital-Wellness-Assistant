# backend/agents/supervisor_agent.py

import json
from agents.groq_client import get_llm

llm = get_llm()


def _extract_json(text: str):
    """
    Try to extract a JSON object from the LLM output.
    If it fails, return None.
    """
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
    Supervisor LLM:
    - Receives current user message, user profile, and the orchestration state.
    - Uses reasoning (not keyword matching) to decide which ONE agent to call next.
    - Reads conversation_history from LangChain ConversationBufferMemory via state["conversation_history"].
    - Returns: "SymptomAgent" | "DietAgent" | "FitnessAgent" | "LifestyleAgent" | "FINISH"
    """

    conversation_history = state.get("conversation_history", "No previous conversation yet.")
    intent = state.get("intent", {})

    # Remove large or irrelevant fields from state when showing to LLM
    cleaned_state = {k: v for k, v in state.items() if k not in ["conversation_history", "intent"]}

    SUPERVISOR_PROMPT = f"""
You are the SUPERVISOR of a multi-agent Digital Wellness Assistant.

Your role:
- Decide which ONE specialized agent should run NEXT.
- Use deep reasoning, not simple keyword matching.
- You must consider:
  - The current user message
  - The user's stored profile
  - The previous conversation history
  - The outputs of any agents already called in this turn (state)
  - The user's general intent: {intent}

CONVERSATION HISTORY (from LangChain ConversationBufferMemory):
{conversation_history}

CURRENT USER MESSAGE:
\"\"\"{user_message}\"\"\"

USER PROFILE:
{profile}

CURRENT ORCHESTRATION STATE (agent outputs so far in THIS turn):
{cleaned_state}

AVAILABLE AGENTS AND WHAT THEY DO:

1. SymptomAgent
   - Understands physical and mental symptoms.
   - Use when the user talks about pain, discomfort, fatigue, dizziness, headaches, stress, or feeling unwell.

2. DietAgent
   - Handles food, nutrition, digestion, bloating, hydration, weight change, diet plans.
   - Use when diet or eating patterns matter.

3. FitnessAgent
   - Handles exercise, workouts, gym progress, posture, stamina, muscle gain, not seeing results from workouts.

4. LifestyleAgent
   - Handles sleep, stress, habits, routines, burnout, time management, consistency.

SELECTION GUIDELINES (VERY IMPORTANT):

- Use as FEW agents as possible to answer the user well.
- Most questions need ONLY 1 or 2 agents.
- DO NOT call all agents unless the situation really involves many dimensions.
- DO NOT rely on exact keyword matching. Infer the user's real needs from meaning & context.
- NEVER call the same agent twice in this turn.
- If the main concern is already addressed by the agents in the state, choose "FINISH".

OUTPUT FORMAT (STRICT):

You MUST respond with ONLY valid JSON, no extra text, no Markdown, no explanation.

Example:
{{
  "next_agent": "SymptomAgent"
}}

Or:
{{
  "next_agent": "FINISH"
}}
"""

    raw = llm.invoke(SUPERVISOR_PROMPT).content.strip()
    data = _extract_json(raw)

    if not data or "next_agent" not in data:
        # Fallback: if LLM misbehaves, do not break the system.
        return "FINISH"

    return data["next_agent"]
