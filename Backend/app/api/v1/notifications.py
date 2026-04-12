from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from app.services.notification import NotificationRequest, send_notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])


class SendNotificationRequest(BaseModel):
    household_id: str
    dependent_id: str | None = None
    message: str
    message_hi: str | None = None
    channels: list[str] = ["whatsapp"]
    priority: str = "normal"


class NotificationResponse(BaseModel):
    success: bool
    results: list[dict]


@router.post("/send", response_model=NotificationResponse)
async def send(
    req: SendNotificationRequest,
):
    """Send notification via WhatsApp, IVR, or SMS."""
    try:
        notification_req = NotificationRequest(
            household_id=req.household_id,
            dependent_id=req.dependent_id,
            message=req.message,
            message_hi=req.message_hi,
            channels=req.channels,
            priority=req.priority,
        )

        results = await send_notification(notification_req)

        return NotificationResponse(
            success=any(r.success for r in results),
            results=[r.model_dump() for r in results],
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to send notification: {str(e)}"
        )
