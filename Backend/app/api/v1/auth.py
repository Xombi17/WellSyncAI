import structlog
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app.core.auth import create_access_token, get_current_household, verify_password
from app.core.database import get_session
from app.models.household import Household

log = structlog.get_logger()
router = APIRouter(tags=["Authentication"])


def _normalize_username(username: str) -> str:
    normalized = username.strip()
    # Treat email-style usernames case-insensitively.
    if "@" in normalized:
        normalized = normalized.lower()
    return normalized

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    """
    Standard OAuth2 compatible token login.
    Used by the demo login system and manual logins.
    """
    normalized_username = _normalize_username(form_data.username)
    stmt = select(Household).where(Household.username == normalized_username)
    result = await session.execute(stmt)
    household = result.scalar_one_or_none()

    password_ok = False
    if household and household.password_hash:
        try:
            password_ok = verify_password(form_data.password, household.password_hash)
        except Exception:
            password_ok = False

    if not household or not password_ok:
        log.warning("login_failed", username=normalized_username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": household.username})
    
    log.info("login_success", username=household.username, household_id=household.id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "household_id": household.id
    }

@router.post("/auth/sync", response_model=dict[str, Any])
async def sync_supabase_auth(current_household: Household = Depends(get_current_household)):
    """
    Ensures the authenticated Supabase user has a corresponding household profile.
    The auth dependency verifies the bearer token and auto-creates the household
    from token metadata when it is missing.
    """
    return {
        "status": "success",
        "household_id": str(current_household.id),
        "username": current_household.username,
    }
