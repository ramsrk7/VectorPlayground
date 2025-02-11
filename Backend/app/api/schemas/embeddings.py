# app/api/schemas/embeddings.py

from pydantic import BaseModel, Field
from typing import List, Optional

class EmbeddingRequest(BaseModel):
    text: str = Field(..., example="Sample text to embed")
    model: Optional[str] = Field("light", example="v3")  # Default to 'light'

class EmbeddingResponse(BaseModel):
    embedding: List[float]

class SimilarityRequest(BaseModel):
    embedding1: List[float] = Field(..., example=[0.1, 0.2, 0.3])
    embedding2: List[float] = Field(..., example=[0.4, 0.5, 0.6])

class SimilarityResponse(BaseModel):
    similarity: float

class DistanceResponse(BaseModel):
    distance: float

class PlotResponse(BaseModel):
    image_base64: str  # Base64 encoded image

class EmbeddingCoordinatesRequest(BaseModel):
    texts: List[str] = Field(..., example=["Hello world", "FastAPI is great"])
    model: Optional[str] = Field("light", description="Model to use for embedding generation. Options: 'v3', 'light', 'v2'.")

class Coordinate(BaseModel):
    text: str
    x: float
    y: float

class EmbeddingCoordinatesResponse(BaseModel):
    coordinates: List[Coordinate]