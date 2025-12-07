from fastapi import APIRouter
import requests
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from utils.jwt_handler import create_jwt_token
from database import save_user

router = APIRouter()

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

@router.post("/auth/google")
def google_auth(code: str, redirect_uri: str):

    # Step 1 → Exchange code for tokens
    token_resp = requests.post(GOOGLE_TOKEN_URL, data={
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    })

    tokens = token_resp.json()
    access_token = tokens.get("access_token")

    # Step 2 → Get user info
    user_resp = requests.get(GOOGLE_USERINFO_URL, headers={
        "Authorization": f"Bearer {access_token}"
    })
    profile = user_resp.json()

    email = profile["email"]
    name = profile["name"]

    # Save user if not exists
    user_id = len(save_user.__globals__["mock_users"]) + 1
    save_user(user_id, {"name": name, "email": email, "password_hash": "GOOGLE_USER"})

    token = create_jwt_token(user_id)

    return {"message": "Google auth success", "token": token, "user_id": user_id}
