# app/api/schemas/indexer.py

from pydantic import BaseModel, Field
from typing import List, Optional

class QueryRequest(BaseModel):
    question: str = Field(..., example="What is self attention?")
    model: Optional[str] = Field("light", example="v3")  # Default to 'light'

class QueryResponse(BaseModel):
    answer: str