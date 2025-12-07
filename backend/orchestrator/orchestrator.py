from agents.intention_classifier import classify_intent
from agents.supervisor_agent import supervisor
from agents.symptom_agent import run_symptom_agent
from agents.diet_agent import run_diet_agent
from agents.fitness_agent import run_fitness_agent
from agents.lifestyle_agent import run_lifestyle_agent
from agents.output_synthesizer import synthesize_output
from database import get_profile


def process_query(user_id: int, message: str):
    """
    Main orchestration function:
    - Loads user profile
    - Classifies intent
    - Uses supervisor LLM to decide which agent to run next
    - Stops when supervisor says FINISH or when max_steps is reached
    """

    profile = get_profile(user_id)

    # 1) Intention classification
    intent = classify_intent(message)
    is_wellness = intent.get("is_wellness", True)

    if not is_wellness:
        return (
            "This message is not related to wellness. I only help with basic health, diet, fitness and lifestyle tips.",
            [],
        )

    # 2) Orchestration loop
    state: dict = {}
    agents_used: list[str] = []

    max_steps = 8  # safety cap so we never loop forever

    for step in range(max_steps):
        # Ask supervisor what to do next, with full context
        next_agent = supervisor(message, profile, state)

        # If supervisor decides we're done, break loop
        if next_agent == "FINISH":
            break
        
        if next_agent in agents_used:
            break
        agents_used.append(next_agent)

        # Call the selected agent
        if next_agent == "SymptomAgent":
            state["symptoms"] = run_symptom_agent(message, profile)

        elif next_agent == "DietAgent":
            state["diet"] = run_diet_agent(state, profile)

        elif next_agent == "FitnessAgent":
            state["fitness"] = run_fitness_agent(state, profile)

        elif next_agent == "LifestyleAgent":
            state["lifestyle"] = run_lifestyle_agent(state, profile)

    else:
        # If we exit the for-loop without break → supervisor never said FINISH
        state["note"] = (
            "The orchestration reached the maximum number of steps and was finished automatically."
        )

    # 3) Final synthesis
    final_response = synthesize_output(state)

    return final_response, agents_used
