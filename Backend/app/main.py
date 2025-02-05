# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import embeddings, indexer
from fastapi.responses import JSONResponse

app = FastAPI(
    title="Text Embedding API",
    description="API for generating and comparing text embeddings",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow specific HTTP methods if needed
    allow_headers=["*"],  # Allow specific headers if needed
)

# Include the embeddings router
app.include_router(embeddings.router)

app.include_router(indexer.router)

# Optionally, add a root endpoint
@app.get("/", tags=["Root"])
def read_root():
    return JSONResponse(content={"status": "ok"}, status_code=200)
