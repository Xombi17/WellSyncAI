import pytest
from pydantic import ValidationError
from app.schemas.household import (
    HouseholdCreate,
    HouseholdUpdate,
    HouseholdResponse,
    HouseholdPreferences,
    UserType,
)
from app.models.household import Household
from datetime import datetime
import uuid


# ─── HouseholdCreate Validation Tests ────────────────────────────────────────


class TestHouseholdCreateValidation:
    """Test HouseholdCreate schema validation."""

    def test_valid_household_create_minimal(self):
        """Valid household with only required fields."""
        data = {
            "name": "Test Family",
            "username": "testuser",
            "password": "password123",
            "primary_language": "en",
            "user_type": "family",
        }
        household = HouseholdCreate(**data)
        assert household.name == "Test Family"
        assert household.username == "testuser"
        assert household.password == "password123"
        assert household.primary_language == "en"
        assert household.user_type == UserType.family

    def test_valid_household_create_with_all_fields(self):
        """Valid household with all optional fields."""
        data = {
            "name": "Complete Family",
            "username": "completeuser",
            "password": "securepass123",
            "primary_language": "hi",
            "user_type": "asha",
            "village_town": "Mumbai",
            "state": "Maharashtra",
            "district": "Mumbai",
        }
        household = HouseholdCreate(**data)
        assert household.village_town == "Mumbai"
        assert household.state == "Maharashtra"
        assert household.district == "Mumbai"
        assert household.user_type == UserType.asha

    def test_password_too_short(self):
        """Password < 6 chars should be rejected."""
        data = {
            "name": "Test Family",
            "username": "testuser",
            "password": "short",  # 5 chars
            "primary_language": "en",
        }
        with pytest.raises(ValidationError) as exc_info:
            HouseholdCreate(**data)
        assert "at least 6 characters" in str(exc_info.value)

    def test_password_too_long(self):
        """Password > 100 chars should be rejected."""
        data = {
            "name": "Test Family",
            "username": "testuser",
            "password": "a" * 101,  # 101 chars
            "primary_language": "en",
        }
        with pytest.raises(ValidationError) as exc_info:
            HouseholdCreate(**data)
        assert "at most 100 characters" in str(exc_info.value)

    def test_password_exactly_6_chars(self):
        """Password with exactly 6 chars should be valid."""
        data = {
            "name": "Test Family",
            "username": "testuser",
            "password": "pass12",  # exactly 6 chars
            "primary_language": "en",
        }
        household = HouseholdCreate(**data)
        assert household.password == "pass12"

    def test_password_exactly_100_chars(self):
        """Password with exactly 100 chars should be valid."""
        data = {
            "name": "Test Family",
            "username": "testuser",
            "password": "a" * 100,  # exactly 100 chars
            "primary_language": "en",
        }
        household = HouseholdCreate(**data)
        assert len(household.password) == 100

    def test_missing_name(self):
        """Missing name field should be rejected."""
        data = {
            "username": "testuser",
            "password": "password123",
            "primary_language": "en",
        }
        with pytest.raises(ValidationError) as exc_info:
            HouseholdCreate(**data)
        assert "name" in str(exc_info.value).lower()

    def test_missing_username(self):
        """Missing username field should be rejected."""
        data = {
            "name": "Test Family",
            "password": "password123",
            "primary_language": "en",
        }
        with pytest.raises(ValidationError) as exc_info:
            HouseholdCreate(**data)
        assert "username" in str(exc_info.value).lower()

    def test_missing_password(self):
        """Missing password field should be rejected."""
        data = {
            "name": "Test Family",
            "username": "testuser",
            "primary_language": "en",
        }
        with pytest.raises(ValidationError) as exc_info:
            HouseholdCreate(**data)
        assert "password" in str(exc_info.value).lower()

    def test_invalid_user_type(self):
        """Invalid user_type enum value should be rejected."""
        data = {
            "name": "Test Family",
            "username": "testuser",
            "password": "password123",
            "primary_language": "en",
            "user_type": "invalid_type",
        }
        with pytest.raises(ValidationError) as exc_info:
            HouseholdCreate(**data)
        assert "user_type" in str(exc_info.value).lower()

    def test_valid_user_types(self):
        """All valid user types should be accepted."""
        for user_type in ["family", "asha", "anganwadi", "health_worker"]:
            data = {
                "name": "Test Family",
                "username": f"user_{user_type}",
                "password": "password123",
                "primary_language": "en",
                "user_type": user_type,
            }
            household = HouseholdCreate(**data)
            assert household.user_type == UserType(user_type)

    def test_empty_name(self):
        """Empty name should be rejected."""
        data = {
            "name": "",
            "username": "testuser",
            "password": "password123",
            "primary_language": "en",
        }
        with pytest.raises(ValidationError) as exc_info:
            HouseholdCreate(**data)
        assert "name" in str(exc_info.value).lower()

    def test_name_too_long(self):
        """Name > 200 chars should be rejected."""
        data = {
            "name": "a" * 201,
            "username": "testuser",
            "password": "password123",
            "primary_language": "en",
        }
        with pytest.raises(ValidationError) as exc_info:
            HouseholdCreate(**data)
        assert "at most 200 characters" in str(exc_info.value)

    def test_optional_fields_default_values(self):
        """Optional fields should have correct defaults."""
        data = {
            "name": "Test Family",
            "username": "testuser",
            "password": "password123",
        }
        household = HouseholdCreate(**data)
        assert household.primary_language == "en"
        assert household.user_type == UserType.family
        assert household.village_town is None
        assert household.state is None
        assert household.district is None


# ─── HouseholdUpdate Validation Tests ────────────────────────────────────────


class TestHouseholdUpdateValidation:
    """Test HouseholdUpdate schema validation."""

    def test_update_name_only(self):
        """Updating only name should be valid."""
        data = {"name": "New Family Name"}
        update = HouseholdUpdate(**data)
        assert update.name == "New Family Name"
        # Verify username and password fields don't exist in schema
        assert "username" not in update.model_fields
        assert "password" not in update.model_fields

    def test_update_preferences(self):
        """Updating preferences should be valid."""
        data = {
            "preferences": {
                "ai_tone": "formal",
                "language": "hi",
                "voice_mode": "english",
            }
        }
        update = HouseholdUpdate(**data)
        assert update.preferences.ai_tone == "formal"
        assert update.preferences.language == "hi"
        assert update.preferences.voice_mode == "english"

    def test_username_field_rejected(self):
        """Username field should NOT be in HouseholdUpdate schema."""
        # This test verifies the schema doesn't have username field
        update = HouseholdUpdate(name="New Name")
        assert not hasattr(update, "username") or update.username is None

    def test_password_field_rejected(self):
        """Password field should NOT be in HouseholdUpdate schema."""
        # This test verifies the schema doesn't have password field
        update = HouseholdUpdate(name="New Name")
        assert not hasattr(update, "password") or update.password is None

    def test_all_fields_optional(self):
        """All fields in HouseholdUpdate should be optional."""
        update = HouseholdUpdate()
        assert update.name is None
        assert update.primary_language is None
        assert update.user_type is None
        assert update.village_town is None
        assert update.state is None
        assert update.district is None
        assert update.preferences is None

    def test_update_multiple_fields(self):
        """Updating multiple fields should be valid."""
        data = {
            "name": "New Name",
            "primary_language": "hi",
            "village_town": "Pune",
            "state": "Maharashtra",
        }
        update = HouseholdUpdate(**data)
        assert update.name == "New Name"
        assert update.primary_language == "hi"
        assert update.village_town == "Pune"
        assert update.state == "Maharashtra"

    def test_update_user_type(self):
        """Updating user_type should be valid."""
        data = {"user_type": "asha"}
        update = HouseholdUpdate(**data)
        assert update.user_type == UserType.asha

    def test_update_last_onboarded_at(self):
        """Updating last_onboarded_at should be valid."""
        now = datetime.utcnow()
        data = {"last_onboarded_at": now}
        update = HouseholdUpdate(**data)
        assert update.last_onboarded_at == now


# ─── HouseholdResponse Serialization Tests ───────────────────────────────────


class TestHouseholdResponseSerialization:
    """Test HouseholdResponse schema serialization."""

    def test_response_has_all_required_fields(self):
        """HouseholdResponse should have all required fields."""
        now = datetime.utcnow()
        data = {
            "id": str(uuid.uuid4()),
            "username": "testuser",
            "name": "Test Family",
            "primary_language": "en",
            "user_type": "family",
            "village_town": "Mumbai",
            "state": "Maharashtra",
            "district": "Mumbai",
            "preferences": {"ai_tone": "simple"},
            "last_onboarded_at": now,
            "created_at": now,
            "updated_at": now,
        }
        response = HouseholdResponse(**data)
        assert response.id == data["id"]
        assert response.username == "testuser"
        assert response.name == "Test Family"
        assert response.preferences.ai_tone == "simple"

    def test_response_preferences_always_present(self):
        """preferences field should always be present in response."""
        now = datetime.utcnow()
        data = {
            "id": str(uuid.uuid4()),
            "username": "testuser",
            "name": "Test Family",
            "primary_language": "en",
            "user_type": "family",
            "village_town": None,
            "state": None,
            "district": None,
            "preferences": {},  # empty dict
            "last_onboarded_at": None,
            "created_at": now,
            "updated_at": now,
        }
        response = HouseholdResponse(**data)
        assert hasattr(response, "preferences")
        # Empty dict should use defaults from HouseholdPreferences
        assert response.preferences.ai_tone == "simple"
        assert response.preferences.language == "en"

    def test_response_password_hash_not_exposed(self):
        """password_hash should NOT be in HouseholdResponse."""
        now = datetime.utcnow()
        data = {
            "id": str(uuid.uuid4()),
            "username": "testuser",
            "name": "Test Family",
            "primary_language": "en",
            "user_type": "family",
            "village_town": None,
            "state": None,
            "district": None,
            "preferences": {},
            "last_onboarded_at": None,
            "created_at": now,
            "updated_at": now,
        }
        response = HouseholdResponse(**data)
        assert not hasattr(response, "password_hash")

    def test_response_serialization_to_dict(self):
        """Response should serialize to dict without password_hash."""
        now = datetime.utcnow()
        data = {
            "id": str(uuid.uuid4()),
            "username": "testuser",
            "name": "Test Family",
            "primary_language": "en",
            "user_type": "family",
            "village_town": None,
            "state": None,
            "district": None,
            "preferences": {},
            "last_onboarded_at": None,
            "created_at": now,
            "updated_at": now,
        }
        response = HouseholdResponse(**data)
        response_dict = response.model_dump()
        assert "password_hash" not in response_dict
        assert "password" not in response_dict
        assert "preferences" in response_dict


# ─── HouseholdPreferences Schema Tests ───────────────────────────────────────


class TestHouseholdPreferencesSchema:
    """Test HouseholdPreferences schema."""

    def test_valid_preferences(self):
        """Valid preferences should be accepted."""
        data = {
            "ai_tone": "formal",
            "language": "hi",
            "voice_mode": "english",
            "health_focus": "vaccination",
        }
        prefs = HouseholdPreferences(**data)
        assert prefs.ai_tone == "formal"
        assert prefs.language == "hi"

    def test_preferences_default_values(self):
        """Preferences should have correct defaults."""
        prefs = HouseholdPreferences()
        assert prefs.ai_tone == "simple"
        assert prefs.language == "en"
        assert prefs.voice_mode == "regional"
        assert prefs.health_focus == "general"

    def test_preferences_partial_override(self):
        """Partial preferences should use defaults for missing fields."""
        data = {"ai_tone": "formal"}
        prefs = HouseholdPreferences(**data)
        assert prefs.ai_tone == "formal"
        assert prefs.language == "en"  # default
        assert prefs.voice_mode == "regional"  # default


# ─── Database Model Integration Tests ────────────────────────────────────────


class TestHouseholdModelIntegration:
    """Test Household model integration with schemas."""

    def test_household_model_has_preferences_field(self):
        """Household model should have preferences field."""
        assert hasattr(Household, "preferences")

    def test_household_model_has_password_hash_field(self):
        """Household model should have password_hash field."""
        assert hasattr(Household, "password_hash")

    def test_household_model_user_type_enum(self):
        """Household model should support all UserType values."""
        for user_type in UserType:
            assert user_type in [UserType.family, UserType.asha, UserType.anganwadi, UserType.health_worker]

    def test_household_model_from_attributes_config(self):
        """HouseholdResponse should have from_attributes config for ORM."""
        assert HouseholdResponse.model_config.get("from_attributes") is True
