# app/main.py

from fastapi import FastAPI
from app.api.routers import embeddings

app = FastAPI(
    title="Text Embedding API",
    description="API for generating and comparing text embeddings",
    version="1.0.0",
)

# Include the embeddings router
app.include_router(embeddings.router)

# Optionally, add a root endpoint
@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Text Embedding API"}
