part of 'pregnancy_profile.dart';

PregnancyProfile _$PregnancyProfileFromJson(Map<String, dynamic> json) =>
    PregnancyProfile(
      id: json['id'] as String,
      householdId: json['household_id'] as String,
      lmpDate: DateTime.parse(json['lmp_date'] as String),
      expectedDueDate:
          DateTime.parse(json['expected_due_date'] as String),
      completed: json['completed'] as bool?,
      highRiskFlags: json['high_risk_flags'] as String?,
      notes: json['notes'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );

Map<String, dynamic> _$PregnancyProfileToJson(PregnancyProfile instance) =>
    <String, dynamic>{
      'id': instance.id,
      'household_id': instance.householdId,
      'lmp_date': instance.lmpDate.toIso8601String(),
      'expected_due_date': instance.expectedDueDate.toIso8601String(),
      'completed': instance.completed,
      'high_risk_flags': instance.highRiskFlags,
      'notes': instance.notes,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };

PregnancyProfileCreate _$PregnancyProfileCreateFromJson(
        Map<String, dynamic> json) =>
    PregnancyProfileCreate(
      householdId: json['household_id'] as String,
      lmpDate: DateTime.parse(json['lmp_date'] as String),
    );

Map<String, dynamic> _$PregnancyProfileCreateToJson(
        PregnancyProfileCreate instance) =>
    <String, dynamic>{
      'household_id': instance.householdId,
      'lmp_date': instance.lmpDate.toIso8601String(),
    };

PregnancyProfileUpdate _$PregnancyProfileUpdateFromJson(
        Map<String, dynamic> json) =>
    PregnancyProfileUpdate(
      highRiskFlags: json['high_risk_flags'] as String?,
      completed: json['completed'] as bool?,
    );

Map<String, dynamic> _$PregnancyProfileUpdateToJson(
        PregnancyProfileUpdate instance) =>
    <String, dynamic>{
      'high_risk_flags': instance.highRiskFlags,
      'completed': instance.completed,
    };
