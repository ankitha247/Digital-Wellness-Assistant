from agents.groq_client import get_llm

llm = get_llm()

def synthesize_output(state: dict) -> str:
    """
    Generate a SHORT, SIMPLE, USER-FRIENDLY summary.
    Each section should be 2–3 lines only.
    If a category is not in state, skip it.
    Combine the agent outputs into ONE concise answer.
    Do not exceed 7 sentences total.
    Remove repetition.
    Keep only the most important 3–6 ideas.

    """

    output = []

    if "symptoms" in state:
        output.append(f"**Symptoms Summary:** {state['symptoms']}")

    if "diet" in state:
        output.append(f"**Diet Tip:** {state['diet']}")

    if "fitness" in state:
        output.append(f"**Fitness Tip:** {state['fitness']}")

    if "lifestyle" in state:
        output.append(f"**Lifestyle Tip:** {state['lifestyle']}")

    return "\n\n".join(output)
