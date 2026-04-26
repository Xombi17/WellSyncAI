import 'package:json_annotation/json_annotation.dart';

part 'dependent.g.dart';

enum DependentType {
  child,
  adult,
  elder,
  pregnant,
}

enum Sex {
  @JsonValue('M')
  male,
  @JsonValue('F')
  female,
  other,
}

@JsonSerializable(fieldRename: FieldRename.snake)
class Dependent {
  const Dependent({
    required this.id,
    required this.householdId,
    required this.name,
    required this.type,
    required this.dateOfBirth,
    required this.sex,
    required this.createdAt,
    required this.updatedAt,
    this.expectedDeliveryDate,
    this.notes,
  });

  final String id;
  final String householdId;
  final String name;
  final DependentType type;
  final DateTime dateOfBirth;
  final Sex sex;
  final DateTime? expectedDeliveryDate;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  factory Dependent.fromJson(Map<String, dynamic> json) => _$DependentFromJson(json);

  Map<String, dynamic> toJson() => _$DependentToJson(this);
}

