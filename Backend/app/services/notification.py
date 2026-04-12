import httpx
import structlog
from pydantic import BaseModel

log = structlog.get_logger()


class NotificationRequest(BaseModel):
    household_id: str
    dependent_id: str | None = None
    message: str
    message_hi: str | None = None
    channels: list[str] = ["whatsapp"]  # whatsapp, ivr, sms
    priority: str = "normal"  # normal, urgent


class NotificationResult(BaseModel):
    channel: str
    success: bool
    message_id: str | None = None
    error: str | None = None


async def send_notification(req: NotificationRequest) -> list[NotificationResult]:
    """Send notification across multiple channels."""
    results = []

    if "whatsapp" in req.channels:
        result = await _send_whatsapp(req)
        results.append(result)

    if "ivr" in req.channels:
        result = await _send_ivr(req)
        results.append(result)

    if "sms" in req.channels:
        result = await _send_sms(req)
        results.append(result)

    return results


async def _send_whatsapp(req: NotificationRequest) -> NotificationResult:
    """Send WhatsApp message via Twilio or Meta API."""
    import app.core.config as config

    settings = config.get_settings()

    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        log.info("whatsapp_not_configured")
        return NotificationResult(channel="whatsapp", success=False, error="WhatsApp not configured")

    message = req.message_hi or req.message
    to = f"whatsapp:{settings.notification_phone}"  # Configure destination

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.twilio.com/2010-04-01/Accounts/{settings.twilio_account_sid}/Messages.json",
                auth=(settings.twilio_account_sid, settings.twilio_auth_token),
                data={
                    "To": to,
                    "From": f"whatsapp:{settings.twilio_phone_number}",
                    "Body": message,
                },
                timeout=30.0,
            )

            if response.status_code == 201:
                data = response.json()
                log.info("whatsapp_sent", sid=data.get("sid"))
                return NotificationResult(channel="whatsapp", success=True, message_id=data.get("sid"))
            else:
                log.error("whatsapp_failed", status=response.status_code, body=response.text)
                return NotificationResult(
                    channel="whatsapp", success=False, error=f"Twilio error: {response.status_code}"
                )
    except Exception as e:
        log.error("whatsapp_exception", error=str(e))
        return NotificationResult(channel="whatsapp", success=False, error=str(e))


async def _send_ivr(req: NotificationRequest) -> NotificationResult:
    """Send IVR call notification via Vapi."""
    import app.core.config as config

    settings = config.get_settings()

    if not settings.vapi_api_key:
        log.info("vapi_not_configured")
        return NotificationResult(channel="ivr", success=False, error="Vapi not configured")

    message = req.message_hi or req.message

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.vapi.ai/call",
                headers={
                    "Authorization": f"Bearer {settings.vapi_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "assistant_id": settings.vapi_assistant_id,
                    "phone_number_id": settings.vapi_phone_number_id,
                    "message": message,
                },
                timeout=30.0,
            )

            if response.status_code in (200, 201):
                data = response.json()
                log.info("ivr_call_started", call_id=data.get("id"))
                return NotificationResult(channel="ivr", success=True, message_id=data.get("id"))
            else:
                log.error("ivr_failed", status=response.status_code)
                return NotificationResult(channel="ivr", success=False, error=f"Vapi error: {response.status_code}")
    except Exception as e:
        log.error("ivr_exception", error=str(e))
        return NotificationResult(channel="ivr", success=False, error=str(e))


async def _send_sms(req: NotificationRequest) -> NotificationResult:
    """Send SMS notification via Twilio."""
    import app.core.config as config

    settings = config.get_settings()

    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        return NotificationResult(channel="sms", success=False, error="Twilio not configured")

    message = req.message_hi or req.message

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.twilio.com/2010-04-01/Accounts/{settings.twilio_account_sid}/Messages.json",
                auth=(settings.twilio_account_sid, settings.twilio_auth_token),
                data={
                    "To": settings.notification_phone,
                    "From": settings.twilio_phone_number,
                    "Body": message,
                },
                timeout=30.0,
            )

            if response.status_code == 201:
                data = response.json()
                return NotificationResult(channel="sms", success=True, message_id=data.get("sid"))
            else:
                return NotificationResult(channel="sms", success=False, error=f"Twilio error: {response.status_code}")
    except Exception as e:
        return NotificationResult(channel="sms", success=False, error=str(e))
