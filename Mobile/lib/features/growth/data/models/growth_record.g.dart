part of 'growth_record.dart';

GrowthRecord _$GrowthRecordFromJson(Map<String, dynamic> json) => GrowthRecord(
      id: json['id'] as String,
      dependentId: json['dependent_id'] as String,
      householdId: json['household_id'] as String,
      recordedDate: DateTime.parse(json['recorded_date'] as String),
      heightCm: json['height_cm'] as double?,
      weightKg: json['weight_kg'] as double?,
      headCircumferenceCm: json['head_circumference_cm'] as double?,
      milestoneAchieved: json['milestone_achieved'] as String?,
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );

Map<String, dynamic> _$GrowthRecordToJson(GrowthRecord instance) =>
    <String, dynamic>{
      'id': instance.id,
      'dependent_id': instance.dependentId,
      'household_id': instance.householdId,
      'recorded_date': instance.recordedDate.toIso8601String(),
      'height_cm': instance.heightCm,
      'weight_kg': instance.weightKg,
      'head_circumference_cm': instance.headCircumferenceCm,
      'milestone_achieved': instance.milestoneAchieved,
      'notes': instance.notes,
      'created_at': instance.createdAt.toIso8601String(),
    };

GrowthRecordCreate _$GrowthRecordCreateFromJson(Map<String, dynamic> json) =>
    GrowthRecordCreate(
      dependentId: json['dependent_id'] as String,
      householdId: json['household_id'] as String,
      recordedDate: DateTime.parse(json['recorded_date'] as String),
      heightCm: json['height_cm'] as double?,
      weightKg: json['weight_kg'] as double?,
      headCircumferenceCm: json['head_circumference_cm'] as double?,
      milestoneAchieved: json['milestone_achieved'] as String?,
      notes: json['notes'] as String?,
    );

Map<String, dynamic> _$GrowthRecordCreateToJson(
        GrowthRecordCreate instance) =>
    <String, dynamic>{
      'dependent_id': instance.dependentId,
      'household_id': instance.householdId,
      'recorded_date': instance.recordedDate.toIso8601String(),
      'height_cm': instance.heightCm,
      'weight_kg': instance.weightKg,
      'head_circumference_cm': instance.headCircumferenceCm,
      'milestone_achieved': instance.milestoneAchieved,
      'notes': instance.notes,
    };
