part of 'reminder.dart';

Reminder _$ReminderFromJson(Map<String, dynamic> json) => Reminder(
      id: json['id'] as String,
      healthEventId: json['health_event_id'] as String,
      dependentId: json['dependent_id'] as String,
      householdId: json['household_id'] as String,
      eventName: json['event_name'] as String,
      dueDate: DateTime.parse(json['due_date'] as String),
      status: $enumDecode(_$ReminderStatusEnumMap, json['status']),
    );

Map<String, dynamic> _$ReminderToJson(Reminder instance) => <String, dynamic>{
      'id': instance.id,
      'health_event_id': instance.healthEventId,
      'dependent_id': instance.dependentId,
      'household_id': instance.householdId,
      'event_name': instance.eventName,
      'due_date': instance.dueDate.toIso8601String(),
      'status': _$ReminderStatusEnumMap[instance.status]!,
    };

const _$ReminderStatusEnumMap = <ReminderStatus, String>{
  ReminderStatus.pending: 'pending',
  ReminderStatus.snoozed: 'snoozed',
  ReminderStatus.acknowledged: 'acknowledged',
  ReminderStatus.completed: 'completed',
};

