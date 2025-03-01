from fastapi import FastAPI
from pydantic import BaseModel
import anthropic
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS middleware to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY"),
)

# Define the request body format
class ChatRequest(BaseModel):
    message: str

# API endpoint for chat interaction
@app.post("/chat")  # Creates an API endpoint
async def chat(req: ChatRequest):  # Accepts the user's input message
    # Sends the request to Anthropic's API
    response = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=1024,  # Limits response length
        messages=[{"role": "user", "content": req.message}],  # Sends your input message to the AI
    )
    return {"reply": response.content[0].text}  # Returns the AI's response in JSON format
