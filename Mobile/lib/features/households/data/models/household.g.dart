part of 'household.dart';

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

Household _$HouseholdFromJson(Map<String, dynamic> json) => Household(
      id: json['id'] as String,
      name: json['name'] as String,
      primaryLanguage: json['primary_language'] as String,
      userType: $enumDecode(_$UserTypeEnumMap, json['user_type']),
      preferences: json['preferences'] == null
          ? const HouseholdPreferences()
          : HouseholdPreferences.fromJson(json['preferences'] as Map<String, dynamic>),
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      username: json['username'] as String?,
      villageTown: json['village_town'] as String?,
      state: json['state'] as String?,
      district: json['district'] as String?,
      lastOnboardedAt: json['last_onboarded_at'] == null
          ? null
          : DateTime.parse(json['last_onboarded_at'] as String),
    );

Map<String, dynamic> _$HouseholdToJson(Household instance) => <String, dynamic>{
      'id': instance.id,
      'username': instance.username,
      'name': instance.name,
      'primary_language': instance.primaryLanguage,
      'user_type': _$UserTypeEnumMap[instance.userType]!,
      'village_town': instance.villageTown,
      'state': instance.state,
      'district': instance.district,
      'preferences': instance.preferences.toJson(),
      'last_onboarded_at': instance.lastOnboardedAt?.toIso8601String(),
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };

const _$UserTypeEnumMap = <UserType, String>{
  UserType.family: 'family',
  UserType.asha: 'asha',
  UserType.anganwadi: 'anganwadi',
  UserType.healthWorker: 'health_worker',
};

