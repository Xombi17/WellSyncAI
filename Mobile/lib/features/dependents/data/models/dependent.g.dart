part of 'dependent.dart';

Dependent _$DependentFromJson(Map<String, dynamic> json) => Dependent(
      id: json['id'] as String,
      householdId: json['household_id'] as String,
      name: json['name'] as String,
      type: $enumDecode(_$DependentTypeEnumMap, json['type']),
      dateOfBirth: DateTime.parse(json['date_of_birth'] as String),
      sex: $enumDecode(_$SexEnumMap, json['sex']),
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      expectedDeliveryDate: json['expected_delivery_date'] == null
          ? null
          : DateTime.parse(json['expected_delivery_date'] as String),
      notes: json['notes'] as String?,
    );

Map<String, dynamic> _$DependentToJson(Dependent instance) => <String, dynamic>{
      'id': instance.id,
      'household_id': instance.householdId,
      'name': instance.name,
      'type': _$DependentTypeEnumMap[instance.type]!,
      'date_of_birth': instance.dateOfBirth.toIso8601String(),
      'sex': _$SexEnumMap[instance.sex]!,
      'expected_delivery_date': instance.expectedDeliveryDate?.toIso8601String(),
      'notes': instance.notes,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };

const _$DependentTypeEnumMap = <DependentType, String>{
  DependentType.child: 'child',
  DependentType.adult: 'adult',
  DependentType.elder: 'elder',
  DependentType.pregnant: 'pregnant',
};

const _$SexEnumMap = <Sex, String>{
  Sex.male: 'M',
  Sex.female: 'F',
  Sex.other: 'other',
};

