"""Password hashing and validation service."""

from passlib.context import CryptContext
import structlog

log = structlog.get_logger()

# Use pbkdf2_sha256 for reliable password hashing
# More portable than bcrypt and doesn't have the 72-byte limit
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


class PasswordService:
    """Centralized password hashing and verification service."""

    @staticmethod
    def hash(password: str) -> str:
        """Hash a plain text password using pbkdf2_sha256.

        Args:
            password: Plain text password to hash

        Returns:
            Hashed password string
        """
        return pwd_context.hash(password)

    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        """Verify a plain text password against a hash.

        Args:
            plain_password: Plain text password to verify
            hashed_password: Hashed password to compare against

        Returns:
            True if password matches, False otherwise
        """
        try:
            # Only verify if it looks like a hash (starts with $pbkdf2)
            if hashed_password.startswith("$pbkdf2"):
                return pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            log.warning("password_verification_failed", error=str(e))
            return False

        # Reject legacy plain text passwords
        return False

    @staticmethod
    def needs_rehash(hashed_password: str) -> bool:
        """Check if a password hash needs to be rehashed with current algorithm.

        Args:
            hashed_password: Hashed password to check

        Returns:
            True if hash should be updated, False otherwise
        """
        try:
            return pwd_context.needs_update(hashed_password)
        except Exception:
            return True


