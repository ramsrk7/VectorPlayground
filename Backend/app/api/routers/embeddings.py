# app/api/routers/embeddings.py

from fastapi import APIRouter, HTTPException, status
import matplotlib
matplotlib.use('Agg')
from typing import Any
from app.services.embeddings import TextEmbeddingHandler
from app.api.schemas.embeddings import (
    EmbeddingRequest,
    EmbeddingResponse,
    SimilarityRequest,
    SimilarityResponse,
    DistanceResponse,
    PlotResponse,
    EmbeddingCoordinatesRequest,
    EmbeddingCoordinatesResponse,
    Coordinate
)
import base64
import io
import matplotlib.pyplot as plt

router = APIRouter(
    prefix="/embeddings",
    tags=["Embeddings"],
    responses={404: {"description": "Not found"}},
)

# Initialize the handler once
embedding_handler = TextEmbeddingHandler()

@router.post("/embed", response_model=EmbeddingResponse, summary="Generate Text Embedding")
def generate_embedding(request: EmbeddingRequest) -> Any:
    try:
        embedding = embedding_handler.get_embedding(text=request.text, model=request.model)
        return EmbeddingResponse(embedding=embedding)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/cosine-similarity", response_model=SimilarityResponse, summary="Calculate Cosine Similarity")
def cosine_similarity(request: SimilarityRequest) -> Any:
    try:
        similarity = embedding_handler.calculate_cosine_similarity(request.embedding1, request.embedding2)
        return SimilarityResponse(similarity=similarity)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/euclidean-distance", response_model=DistanceResponse, summary="Calculate Euclidean Distance")
def euclidean_distance(request: SimilarityRequest) -> Any:
    try:
        distance = embedding_handler.calculate_euclidean_distance(request.embedding1, request.embedding2)
        return DistanceResponse(distance=distance)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/plot-comparison", response_model=PlotResponse, summary="Plot Embedding Comparison")
def plot_comparison(request: SimilarityRequest) -> Any:
    """
    API endpoint to plot embedding comparison and return a base64-encoded image.
    """
    try:
        # Plot the embeddings and get the base64-encoded image
        image_base64 = embedding_handler.plot_embedding_comparison(
            request.embedding1, 
            request.embedding2, 
            type="base64"  # Use base64 output from the plotting function
        )
        
        return PlotResponse(image_base64=image_base64)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post(
    "/embed-coordinates",
    response_model=EmbeddingCoordinatesResponse,
    summary="Generate Embedding Coordinates from a List of Texts"
)
def embed_coordinates(request: EmbeddingCoordinatesRequest) -> Any:
    """
    API endpoint to generate 2D coordinates for a list of input texts.
    """
    try:
        if not request.texts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The 'texts' list cannot be empty."
            )
        
        embeddings = []
        for text in request.texts:
            embedding = embedding_handler.get_embedding(text=text, model=request.model)
            embeddings.append(embedding)
        
        # Use scatter_plot_embeddings to get 2D coordinates
        coordinates_list = embedding_handler.scatter_plot_embeddings(
            embeddings=embeddings,
            response_type="coordinates"
        )
        
        # Combine texts with their coordinates
        coordinates_response = EmbeddingCoordinatesResponse(
            coordinates=[
                Coordinate(text=text, x=coord["x"], y=coord["y"]) 
                for text, coord in zip(request.texts, coordinates_list)
            ]
        )
        
        return coordinates_response

    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
