# app/api/routers/indexer.py

from fastapi import APIRouter, HTTPException, status
from typing import Any
from app.services.indexer import NaiveIndexer
from app.api.schemas.indexer import (
    QueryRequest,
    QueryResponse
)


router = APIRouter(
    prefix="/rag",
    tags=["RAG"],
    responses={404: {"description": "Not found"}},
)

# Initialize the handler once
indexer = NaiveIndexer()
indexer.persist()

@router.post("/query", response_model=QueryResponse, summary="Generate Text Embedding")
def generate_embedding(request: QueryRequest) -> Any:
    try:
        answer = indexer.query(question=request.question)
        return QueryResponse(answer=str(answer))
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    

@router.post("/persist", response_model=QueryResponse, summary="Generate Text Embedding")
def generate_embedding(request: QueryRequest) -> Any:
    try:
        indexer.persist()
        return QueryResponse(answer='DONE')
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
