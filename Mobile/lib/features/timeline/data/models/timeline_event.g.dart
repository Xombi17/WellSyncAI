part of 'timeline_event.dart';

TimelineEvent _$TimelineEventFromJson(Map<String, dynamic> json) => TimelineEvent(
      id: json['id'] as String,
      dependentId: json['dependent_id'] as String,
      householdId: json['household_id'] as String,
      name: json['name'] as String,
      scheduleKey: json['schedule_key'] as String,
      category: $enumDecode(_$EventCategoryEnumMap, json['category']),
      dueDate: DateTime.parse(json['due_date'] as String),
      status: $enumDecode(_$EventStatusEnumMap, json['status']),
      scheduleVersion: json['schedule_version'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      doseNumber: (json['dose_number'] as num?)?.toInt(),
      windowStart: json['window_start'] == null
          ? null
          : DateTime.parse(json['window_start'] as String),
      windowEnd: json['window_end'] == null
          ? null
          : DateTime.parse(json['window_end'] as String),
      completedAt: json['completed_at'] == null
          ? null
          : DateTime.parse(json['completed_at'] as String),
      completedBy: json['completed_by'] as String?,
      location: json['location'] as String?,
      notes: json['notes'] as String?,
      verificationStatus: json['verification_status'] == null
          ? null
          : $enumDecode(_$VerificationStatusEnumMap, json['verification_status']),
      verifiedBy: json['verified_by'] as String?,
      verificationDocumentUrl: json['verification_document_url'] as String?,
      verificationNotes: json['verification_notes'] as String?,
      markedGivenAt: json['marked_given_at'] == null
          ? null
          : DateTime.parse(json['marked_given_at'] as String),
    );

Map<String, dynamic> _$TimelineEventToJson(TimelineEvent instance) =>
    <String, dynamic>{
      'id': instance.id,
      'dependent_id': instance.dependentId,
      'household_id': instance.householdId,
      'name': instance.name,
      'schedule_key': instance.scheduleKey,
      'category': _$EventCategoryEnumMap[instance.category]!,
      'dose_number': instance.doseNumber,
      'due_date': instance.dueDate.toIso8601String(),
      'window_start': instance.windowStart?.toIso8601String(),
      'window_end': instance.windowEnd?.toIso8601String(),
      'status': _$EventStatusEnumMap[instance.status]!,
      'completed_at': instance.completedAt?.toIso8601String(),
      'completed_by': instance.completedBy,
      'location': instance.location,
      'notes': instance.notes,
      'verification_status': instance.verificationStatus == null
          ? null
          : _$VerificationStatusEnumMap[instance.verificationStatus]!,
      'verified_by': instance.verifiedBy,
      'verification_document_url': instance.verificationDocumentUrl,
      'verification_notes': instance.verificationNotes,
      'marked_given_at': instance.markedGivenAt?.toIso8601String(),
      'schedule_version': instance.scheduleVersion,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };

TimelineResponse _$TimelineResponseFromJson(Map<String, dynamic> json) =>
    TimelineResponse(
      dependentId: json['dependent_id'] as String,
      dependentName: json['dependent_name'] as String,
      generatedAt: DateTime.parse(json['generated_at'] as String),
      events: (json['events'] as List<dynamic>)
          .map((e) => TimelineEvent.fromJson(e as Map<String, dynamic>))
          .toList(),
      nextDue: json['next_due'] == null
          ? null
          : TimelineEvent.fromJson(json['next_due'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$TimelineResponseToJson(TimelineResponse instance) =>
    <String, dynamic>{
      'dependent_id': instance.dependentId,
      'dependent_name': instance.dependentName,
      'generated_at': instance.generatedAt.toIso8601String(),
      'events': instance.events.map((e) => e.toJson()).toList(),
      'next_due': instance.nextDue?.toJson(),
    };

const _$EventCategoryEnumMap = <EventCategory, String>{
  EventCategory.vaccination: 'vaccination',
  EventCategory.checkup: 'checkup',
  EventCategory.vitamin: 'vitamin',
  EventCategory.reminder: 'reminder',
  EventCategory.prenatalCheckup: 'prenatal_checkup',
  EventCategory.medicineDose: 'medicine_dose',
  EventCategory.growthCheck: 'growth_check',
  EventCategory.supplement: 'supplement',
};

const _$EventStatusEnumMap = <EventStatus, String>{
  EventStatus.upcoming: 'upcoming',
  EventStatus.due: 'due',
  EventStatus.overdue: 'overdue',
  EventStatus.completed: 'completed',
};

const _$VerificationStatusEnumMap = <VerificationStatus, String>{
  VerificationStatus.pending: 'pending',
  VerificationStatus.verified: 'verified',
  VerificationStatus.rejected: 'rejected',
};

