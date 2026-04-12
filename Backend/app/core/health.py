"""
Environment validation and startup checks
"""

import structlog
from app.core.config import get_settings

log = structlog.get_logger()


def validate_environment() -> dict[str, bool]:
    """Validate that all required environment variables are set."""
    settings = get_settings()
    issues = {}

    # Critical variables
    if not settings.database_url:
        issues["database_url"] = "DATABASE_URL is required"
        log.error("missing_env_var", var="DATABASE_URL")

    if not settings.google_ai_api_key:
        issues["google_ai_api_key"] = "GOOGLE_AI_API_KEY is required for voice"
        log.warning("missing_env_var", var="GOOGLE_AI_API_KEY")

    if not settings.supabase_url:
        issues["supabase_url"] = "SUPABASE_URL is required"
        log.warning("missing_env_var", var="SUPABASE_URL")

    if not settings.supabase_anon_key:
        issues["supabase_anon_key"] = "SUPABASE_ANON_KEY is required"
        log.warning("missing_env_var", var="SUPABASE_ANON_KEY")

    # Optional but recommended
    if not settings.github_token:
        log.warning("missing_optional_env_var", var="GITHUB_TOKEN")

    if issues:
        log.error("environment_validation_failed", issues=issues)
        return {"valid": False, "issues": issues}

    log.info("environment_validation_passed")
    return {"valid": True}


def check_startup_health() -> dict[str, bool]:
    """Check application health at startup."""
    checks = {
        "environment": validate_environment().get("valid", False),
    }

    if all(checks.values()):
        log.info("startup_health_check_passed", checks=checks)
        return {"healthy": True, "checks": checks}
    else:
        log.error("startup_health_check_failed", checks=checks)
        return {"healthy": False, "checks": checks}
