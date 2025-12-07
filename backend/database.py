from typing import Dict, Any, Optional, List

# -----------------------------
# In-memory "database" storage
# -----------------------------

_users: Dict[int, Dict[str, Any]] = {}
_users_by_email: Dict[str, Dict[str, Any]] = {}

_profiles: Dict[int, Dict[str, Any]] = {}

_message_history: Dict[int, List[Dict[str, str]]] = {}


# -----------------------------
# USER FUNCTIONS
# -----------------------------

def save_user(user: Dict[str, Any]) -> Dict[str, Any]:
    """
    Save a user in memory.
    If 'id' is not present, assign a new one.
    Also index by email for quick lookup.
    """
    user_id = user.get("id")

    if user_id is None:
        user_id = max(_users.keys(), default=0) + 1
        user["id"] = user_id

    _users[user_id] = user

    email = user.get("email")
    if email:
        _users_by_email[email] = user

    return user


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """
    Return user dict if email exists, else None.
    """
    return _users_by_email.get(email)


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """
    Return user dict if user_id exists, else None.
    """
    return _users.get(user_id)


# -----------------------------
# PROFILE FUNCTIONS
# -----------------------------

def save_profile(profile: Dict[str, Any]) -> None:
    """
    Save or update a user's wellness profile in memory.
    Keyed by user_id.
    """
    user_id = profile["user_id"]
    _profiles[user_id] = profile


def get_profile(user_id: int) -> Optional[Dict[str, Any]]:
    """
    Get the wellness profile for a user, or None if missing.
    """
    return _profiles.get(user_id)


# -----------------------------
# MESSAGE HISTORY (optional)
# -----------------------------

def append_message(user_id: int, role: str, content: str) -> None:
    """
    Save one message in the history for a given user.
    role: "user" | "assistant"
    """
    if user_id not in _message_history:
        _message_history[user_id] = []
    _message_history[user_id].append({"role": role, "content": content})


def get_message_history(user_id: int) -> List[Dict[str, str]]:
    """
    Return list of message dicts for the user, or empty list.
    """
    return _message_history.get(user_id, [])
