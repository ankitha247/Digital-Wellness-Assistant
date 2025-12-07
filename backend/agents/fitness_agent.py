from agents.groq_client import get_llm
llm = get_llm()

def run_fitness_agent(state, profile):
    prompt = f"""
User Profile:
{profile}

State:
{state}

Provide personalized FITNESS recommendations.
"""
    return llm.invoke(prompt).content
