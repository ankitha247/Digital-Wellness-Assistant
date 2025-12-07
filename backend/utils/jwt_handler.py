import jwt
from config import JWT_SECRET, JWT_ALGORITHM
from datetime import datetime, timedelta

def create_jwt_token(user_id: int):
    payload = {"user_id": user_id, "exp": datetime.utcnow() + timedelta(hours=8)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt(token: str):
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
