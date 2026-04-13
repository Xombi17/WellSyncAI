from fastapi import APIRouter

router = APIRouter(prefix="/config", tags=["config"])


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
