import 'package:json_annotation/json_annotation.dart';

part 'pregnancy_profile.g.dart';

@JsonSerializable(fieldRename: FieldRename.snake, explicitToJson: true)
class PregnancyProfile {
  const PregnancyProfile({
    required this.id,
    required this.householdId,
    required this.lmpDate,
    required this.expectedDueDate,
    this.completed,
    this.highRiskFlags,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  final String id;
  final String householdId;
  final DateTime lmpDate;
  final DateTime expectedDueDate;
  final bool? completed;
  final String? highRiskFlags;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  factory PregnancyProfile.fromJson(Map<String, dynamic> json) =>
      _$PregnancyProfileFromJson(json);

  Map<String, dynamic> toJson() => _$PregnancyProfileToJson(this);
}

@JsonSerializable(fieldRename: FieldRename.snake, explicitToJson: true)
class PregnancyProfileCreate {
  const PregnancyProfileCreate({
    required this.householdId,
    required this.lmpDate,
  });

  final String householdId;
  final DateTime lmpDate;

  factory PregnancyProfileCreate.fromJson(Map<String, dynamic> json) =>
      _$PregnancyProfileCreateFromJson(json);

  Map<String, dynamic> toJson() => _$PregnancyProfileCreateToJson(this);
}

@JsonSerializable(fieldRename: FieldRename.snake, explicitToJson: true)
class PregnancyProfileUpdate {
  const PregnancyProfileUpdate({
    this.highRiskFlags,
    this.completed,
  });

  final String? highRiskFlags;
  final bool? completed;

  factory PregnancyProfileUpdate.fromJson(Map<String, dynamic> json) =>
      _$PregnancyProfileUpdateFromJson(json);

  Map<String, dynamic> toJson() => _$PregnancyProfileUpdateToJson(this);
}