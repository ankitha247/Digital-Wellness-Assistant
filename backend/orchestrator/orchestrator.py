# backend/orchestrator/orchestrator.py

from typing import Dict
from langchain_classic.memory import ConversationBufferMemory
from agents.intention_classifier import classify_intent
from agents.supervisor_agent import supervisor
from agents.symptom_agent import run_symptom_agent
from agents.diet_agent import run_diet_agent
from agents.fitness_agent import run_fitness_agent
from agents.lifestyle_agent import run_lifestyle_agent
from agents.output_synthesizer import synthesize_output
from database import get_profile, append_conversation_turn


# -------------------------------------------------------------------
# OFFICIAL CHAT MEMORY (LangChain ConversationBufferMemory per user)
# -------------------------------------------------------------------

_memory_store: Dict[int, ConversationBufferMemory] = {}


def get_memory(user_id: int) -> ConversationBufferMemory:
    """
    Get or create a LangChain ConversationBufferMemory instance for this user.
    This is the ONLY chat memory used by the LLM for context.
    """
    if user_id not in _memory_store:
        _memory_store[user_id] = ConversationBufferMemory(
            return_messages=False  # we want a text 'history', not message objects
        )
    return _memory_store[user_id]


# -------------------------------------------------------------------
# MAIN ORCHESTRATION FUNCTION
# -------------------------------------------------------------------

def process_query(user_id: int, message: str):
    """
    Main orchestration function:
    - Loads user profile
    - Uses LangChain ConversationBufferMemory for chat context
    - Classifies intent
    - Uses supervisor LLM to decide which agent to run next
    - Stops when supervisor says FINISH or when max_steps is reached
    - Logs each turn for /history API (user_message, assistant_response, agents_used)
    """

    # 1) Load user profile (long-term memory)
    profile = get_profile(user_id)

    # 2) Get LangChain memory for this user (short-term conversation memory)
    memory = get_memory(user_id)
    memory_vars = memory.load_memory_variables({})
    chat_history = memory_vars.get("history", "No previous conversation yet.")

    # 3) Intention classification
    intent = classify_intent(message)
    is_wellness = intent.get("is_wellness", True)

    if not is_wellness:
        response_text = (
            "This message is not related to wellness. "
            "I only help with basic health, diet, fitness and lifestyle tips."
        )

        # Save to LangChain memory so context is preserved
        memory.save_context({"input": message}, {"output": response_text})

        # Also log this turn for /history API (for Postman/debugging)
        append_conversation_turn(
            user_id=user_id,
            user_message=message,
            assistant_response=response_text,
            agents_used=[],
        )

        return response_text, []

    # 4) Orchestration state passed to supervisor & agents
    state: dict = {
        "intent": intent,
        "conversation_history": chat_history,  # comes from ConversationBufferMemory
    }
    agents_used: list[str] = []

    max_steps = 8  # safety cap so we never loop forever

    for step in range(max_steps):
        # Ask supervisor what to do next, with full context
        next_agent = supervisor(message, profile, state)

        # If supervisor decides we're done, break loop
        if next_agent == "FINISH":
            break

        # Avoid calling the same agent multiple times in one turn
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

    # 5) Final synthesis of all agent outputs
    final_response = synthesize_output(state)

    # 6) Save to LangChain ConversationBufferMemory (this is the REAL chat memory)
    memory.save_context({"input": message}, {"output": final_response})

    # 7) Also log this turn for /history API (metadata: timestamp, agents_used)
    append_conversation_turn(
        user_id=user_id,
        user_message=message,
        assistant_response=final_response,
        agents_used=agents_used,
    )

    return final_response, agents_used
