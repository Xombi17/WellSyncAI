import 'package:json_annotation/json_annotation.dart';

part 'growth_record.g.dart';

@JsonSerializable(fieldRename: FieldRename.snake, explicitToJson: true)
class GrowthRecord {
  const GrowthRecord({
    required this.id,
    required this.dependentId,
    required this.householdId,
    required this.recordedDate,
    this.heightCm,
    this.weightKg,
    this.headCircumferenceCm,
    this.milestoneAchieved,
    this.notes,
    required this.createdAt,
  });

  final String id;
  final String dependentId;
  final String householdId;
  final DateTime recordedDate;
  final double? heightCm;
  final double? weightKg;
  final double? headCircumferenceCm;
  final String? milestoneAchieved;
  final String? notes;
  final DateTime createdAt;

  factory GrowthRecord.fromJson(Map<String, dynamic> json) =>
      _$GrowthRecordFromJson(json);

  Map<String, dynamic> toJson() => _$GrowthRecordToJson(this);
}

@JsonSerializable(fieldRename: FieldRename.snake, explicitToJson: true)
class GrowthRecordCreate {
  const GrowthRecordCreate({
    required this.dependentId,
    required this.householdId,
    required this.recordedDate,
    this.heightCm,
    this.weightKg,
    this.headCircumferenceCm,
    this.milestoneAchieved,
    this.notes,
  });

  final String dependentId;
  final String householdId;
  final DateTime recordedDate;
  final double? heightCm;
  final double? weightKg;
  final double? headCircumferenceCm;
  final String? milestoneAchieved;
  final String? notes;

  factory GrowthRecordCreate.fromJson(Map<String, dynamic> json) =>
      _$GrowthRecordCreateFromJson(json);

  Map<String, dynamic> toJson() => _$GrowthRecordCreateToJson(this);
}