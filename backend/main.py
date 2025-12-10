# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from routers import auth, google_auth, profile, chat, history

app = FastAPI(title="Wellness AI Assistant")

# Simplified CORS middleware - WORKING VERSION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explicitly list methods
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(chat.router)
app.include_router(history.router)
app.include_router(google_auth.router)

@app.get("/")
def root():
    return {"message": "Wellness AI Assistant API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "jwt": "configured"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)