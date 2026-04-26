import 'package:json_annotation/json_annotation.dart';

part 'reminder.g.dart';

enum ReminderStatus {
  pending,
  snoozed,
  acknowledged,
  completed,
}

@JsonSerializable(fieldRename: FieldRename.snake)
class Reminder {
  const Reminder({
    required this.id,
    required this.healthEventId,
    required this.dependentId,
    required this.householdId,
    required this.eventName,
    required this.dueDate,
    required this.status,
  });

  final String id;
  final String healthEventId;
  final String dependentId;
  final String householdId;
  final String eventName;
  final DateTime dueDate;
  final ReminderStatus status;

  factory Reminder.fromJson(Map<String, dynamic> json) =>
      _$ReminderFromJson(json);

  Map<String, dynamic> toJson() => _$ReminderToJson(this);
}

