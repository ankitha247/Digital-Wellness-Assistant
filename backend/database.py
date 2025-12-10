# backend/database.py

from typing import Dict, Any, List, Optional
from datetime import datetime

# ---------------------------------
# In-memory "database" structures
# ---------------------------------

# user_id -> user dict
_mock_users: Dict[int, Dict[str, Any]] = {}

# email -> user_id
_email_to_user_id: Dict[str, int] = {}

# user_id -> profile dict
_mock_profiles: Dict[int, Dict[str, Any]] = {}

# user_id -> list of conversation turns
# each turn: {timestamp, user_message, assistant_response, agents_used}
_conversation_turns: Dict[int, List[Dict[str, Any]]] = {}


# ---------------------------------
# USER FUNCTIONS - UPDATED
# ---------------------------------

def save_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Save a new user and return the full user record (including its id).
    user_data is expected to contain at least: email, password_hash, name
    """
    new_id = len(_mock_users) + 1
    
    # ADD THIS: Ensure profile_complete is in user_data (default to False)
    if "profile_complete" not in user_data:
        user_data["profile_complete"] = False
    
    user_record = {
        "id": new_id,
        **user_data,
    }
    _mock_users[new_id] = user_record

    email = user_data.get("email")
    if email:
        _email_to_user_id[email] = new_id

    return user_record


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """
    Return the user dict for this email, or None if not found.
    """
    user_id = _email_to_user_id.get(email)
    if user_id is None:
        return None
    
    user = _mock_users.get(user_id)
    
    # ADD THIS: Ensure profile_complete field exists (default to True for existing users)
    if user and "profile_complete" not in user:
        user["profile_complete"] = True  # Default existing users to True
    
    return user


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """
    Return the user dict for this user_id, or None if not found.
    """
    user = _mock_users.get(user_id)
    
    # ADD THIS: Ensure profile_complete field exists
    if user and "profile_complete" not in user:
        user["profile_complete"] = True  # Default existing users to True
    
    return user


# ADD THIS NEW FUNCTION: Update user profile_complete status
def update_user_profile_complete(user_id: int, profile_complete: bool) -> bool:
    """
    Update a user's profile_complete status.
    Returns True if successful, False if user not found.
    """
    user = _mock_users.get(user_id)
    if user is None:
        return False
    
    user["profile_complete"] = profile_complete
    return True


# ---------------------------------
# PROFILE FUNCTIONS - UPDATED
# ---------------------------------

def save_profile(user_id: int, profile_data: Dict[str, Any]) -> None:
    """
    Create or update a profile for the given user_id.
    Example fields: age, gender, weight, height, diet_type, activity_level,
    sleep_hours, health_conditions, fitness_goal, etc.
    """
    _mock_profiles[user_id] = {
        "user_id": user_id,
        **profile_data,
    }


def get_profile(user_id: int) -> Dict[str, Any]:
    """
    Return the profile dict for this user_id.
    If no profile exists, return an empty dict.
    """
    return _mock_profiles.get(user_id, {})


# ---------------------------------
# CONVERSATION HISTORY (for /history API)
# ---------------------------------

def append_conversation_turn(
    user_id: int,
    user_message: str,
    assistant_response: str,
    agents_used: List[str],
) -> None:
    """
    Store one conversation turn for this user:
    - timestamp
    - user_message
    - assistant_response
    - agents_used
    """
    if user_id not in _conversation_turns:
        _conversation_turns[user_id] = []

    _conversation_turns[user_id].append(
        {
            "timestamp": datetime.now().isoformat(timespec="seconds"),
            "user_message": user_message,
            "assistant_response": assistant_response,
            "agents_used": agents_used,
        }
    )

    # Optional: keep only the last 20 turns per user
    _conversation_turns[user_id] = _conversation_turns[user_id][-20:]


def get_conversation_history(user_id: int) -> List[Dict[str, Any]]:
    """
    Return all stored conversation turns for this user.
    Each item has: timestamp, user_message, assistant_response, agents_used.
    """
    return _conversation_turns.get(user_id, [])