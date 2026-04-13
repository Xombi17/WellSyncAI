import pytest
from app.core.password_service import PasswordService


class TestPasswordService:
    """Test PasswordService for password hashing and verification."""

    def test_hash_password(self):
        """Hash a plain text password."""
        password = "test_password_123"
        hashed = PasswordService.hash(password)

        # Hash should not be the same as plain text
        assert hashed != password
        # Hash should start with pbkdf2 prefix
        assert hashed.startswith("$pbkdf2")

    def test_verify_correct_password(self):
        """Verify a correct password against its hash."""
        password = "correct_password"
        hashed = PasswordService.hash(password)

        assert PasswordService.verify(password, hashed) is True

    def test_verify_incorrect_password(self):
        """Verify an incorrect password against a hash."""
        password = "correct_password"
        wrong_password = "wrong_password"
        hashed = PasswordService.hash(password)

        assert PasswordService.verify(wrong_password, hashed) is False

    def test_verify_rejects_plain_text(self):
        """Verify rejects plain text passwords (legacy fallback removed)."""
        plain_password = "plain_text_password"

        # Should reject plain text (not a pbkdf2 hash)
        assert PasswordService.verify(plain_password, plain_password) is False

    def test_verify_rejects_invalid_hash(self):
        """Verify rejects invalid hash formats."""
        password = "test_password"
        invalid_hash = "not_a_valid_hash"

        assert PasswordService.verify(password, invalid_hash) is False

    def test_hash_different_each_time(self):
        """Hash should produce different output each time (due to salt)."""
        password = "same_password"
        hash1 = PasswordService.hash(password)
        hash2 = PasswordService.hash(password)

        # Hashes should be different (different salts)
        assert hash1 != hash2
        # But both should verify the same password
        assert PasswordService.verify(password, hash1) is True
        assert PasswordService.verify(password, hash2) is True

    def test_needs_rehash_pbkdf2(self):
        """PBKDF2 hashes should not need rehashing."""
        password = "test_password"
        hashed = PasswordService.hash(password)

        # PBKDF2 hash should not need update
        assert PasswordService.needs_rehash(hashed) is False

    def test_needs_rehash_invalid(self):
        """Invalid hashes should need rehashing."""
        invalid_hash = "not_a_valid_hash"

        # Invalid hash should need rehashing
        assert PasswordService.needs_rehash(invalid_hash) is True

    def test_password_length_variations(self):
        """Test password hashing with various lengths."""
        passwords = [
            "short",  # 5 chars
            "medium_password",  # 15 chars
            "a" * 100,  # 100 chars (no limit with pbkdf2)
            "special!@#$%^&*()",  # special chars
            "unicode_пароль_密码",  # unicode
        ]

        for password in passwords:
            hashed = PasswordService.hash(password)
            assert PasswordService.verify(password, hashed) is True
            assert PasswordService.verify("wrong", hashed) is False

    def test_empty_password_handling(self):
        """Test handling of empty passwords."""
        empty_password = ""
        hashed = PasswordService.hash(empty_password)

        # Empty password should still hash and verify
        assert PasswordService.verify(empty_password, hashed) is True
        assert PasswordService.verify("not_empty", hashed) is False

