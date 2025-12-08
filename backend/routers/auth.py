from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import save_user, get_user_by_email
from utils.password_hash import hash_password

router = APIRouter(prefix="/auth", tags=["auth"])


class SignupRequest(BaseModel):
    email: str
    name: str
    password: str


@router.post("/signup")
def signup(req: SignupRequest):
    existing = get_user_by_email(req.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    saved_user = save_user(
        {
            "email": req.email,
            "name": req.name,
            "password_hash": hash_password(req.password),
        }
    )

    return {
        "id": saved_user["id"],
        "email": saved_user["email"],
        "name": saved_user["name"],
        "message": "User created successfully",
    }
