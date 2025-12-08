from fastapi import APIRouter
from database import get_conversation_history

router = APIRouter(prefix="/history", tags=["history"])

@router.get("/{user_id}")
def fetch_history(user_id: int):
    """
    Return the conversation history for a given user_id.
    Each item contains:
    - timestamp
    - user_message
    - assistant_response
    - agents_used
    """
    turns = get_conversation_history(user_id)
    return {
        "user_id": user_id,
        "turns": turns,
        "total_turns": len(turns),
    }
