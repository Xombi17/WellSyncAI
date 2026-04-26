import 'package:json_annotation/json_annotation.dart';

part 'household.g.dart';

enum UserType {
  family,
  asha,
  anganwadi,
  @JsonValue('health_worker')
  healthWorker,
}

@JsonSerializable(fieldRename: FieldRename.snake, explicitToJson: true)
class HouseholdPreferences {
  const HouseholdPreferences({
    this.aiTone = 'simple',
    this.language = 'en',
    this.voiceMode = 'regional',
    this.healthFocus = 'general',
  });

  final String aiTone;
  final String language;
  final String voiceMode;
  final String healthFocus;

  factory HouseholdPreferences.fromJson(Map<String, dynamic> json) =>
      _$HouseholdPreferencesFromJson(json);

  Map<String, dynamic> toJson() => _$HouseholdPreferencesToJson(this);
}

@JsonSerializable(fieldRename: FieldRename.snake, explicitToJson: true)
class Household {
  const Household({
    required this.id,
    required this.name,
    required this.primaryLanguage,
    required this.userType,
    required this.preferences,
    required this.createdAt,
    required this.updatedAt,
    this.username,
    this.villageTown,
    this.state,
    this.district,
    this.lastOnboardedAt,
  });

  final String id;
  final String? username;
  final String name;
  final String primaryLanguage;
  final UserType userType;
  final String? villageTown;
  final String? state;
  final String? district;
  final HouseholdPreferences preferences;
  final DateTime? lastOnboardedAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  factory Household.fromJson(Map<String, dynamic> json) => _$HouseholdFromJson(json);

  Map<String, dynamic> toJson() => _$HouseholdToJson(this);
}

