import 'package:json_annotation/json_annotation.dart';

part 'household_create.g.dart';

@JsonSerializable(fieldRename: FieldRename.snake, explicitToJson: true)
class HouseholdCreate {
  const HouseholdCreate({
    required this.name,
    required this.primaryLanguage,
    required this.userType,
    required this.username,
    required this.password,
    this.villageTown,
    this.state,
    this.district,
    this.preferences,
  });

  final String name;
  final String primaryLanguage;
  final String userType;
  final String username;
  final String password;
  final String? villageTown;
  final String? state;
  final String? district;
  final HouseholdPreferences? preferences;

  factory HouseholdCreate.fromJson(Map<String, dynamic> json) =>
      _$HouseholdCreateFromJson(json);

  Map<String, dynamic> toJson() => _$HouseholdCreateToJson(this);
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