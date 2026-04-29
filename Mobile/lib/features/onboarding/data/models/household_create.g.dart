part of 'household_create.dart';

HouseholdPreferences _$HouseholdPreferencesFromJson(Map<String, dynamic> json) =>
    HouseholdPreferences(
      aiTone: json['ai_tone'] as String? ?? 'simple',
      language: json['language'] as String? ?? 'en',
      voiceMode: json['voice_mode'] as String? ?? 'regional',
      healthFocus: json['health_focus'] as String? ?? 'general',
    );

Map<String, dynamic> _$HouseholdPreferencesToJson(HouseholdPreferences instance) =>
    <String, dynamic>{
      'ai_tone': instance.aiTone,
      'language': instance.language,
      'voice_mode': instance.voiceMode,
      'health_focus': instance.healthFocus,
    };

HouseholdCreate _$HouseholdCreateFromJson(Map<String, dynamic> json) =>
    HouseholdCreate(
      name: json['name'] as String,
      primaryLanguage: json['primary_language'] as String,
      userType: json['user_type'] as String,
      username: json['username'] as String,
      password: json['password'] as String,
      villageTown: json['village_town'] as String?,
      state: json['state'] as String?,
      district: json['district'] as String?,
      preferences: json['preferences'] == null
          ? null
          : HouseholdPreferences.fromJson(
              json['preferences'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$HouseholdCreateToJson(HouseholdCreate instance) =>
    <String, dynamic>{
      'name': instance.name,
      'primary_language': instance.primaryLanguage,
      'user_type': instance.userType,
      'username': instance.username,
      'password': instance.password,
      'village_town': instance.villageTown,
      'state': instance.state,
      'district': instance.district,
      'preferences': instance.preferences?.toJson(),
    };
