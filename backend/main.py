from fastapi import FastAPI
from routers import auth, google_auth, profile, chat, history 

app = FastAPI()

app.include_router(auth.router)
app.include_router(google_auth.router)
app.include_router(profile.router)
app.include_router(chat.router)
app.include_router(history.router)

@app.get("/")
def home():
    return {"message": "Groq Multi-Agent Wellness Backend Running"}
