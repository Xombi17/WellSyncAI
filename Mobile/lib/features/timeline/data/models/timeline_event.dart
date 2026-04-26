import 'package:json_annotation/json_annotation.dart';

part 'timeline_event.g.dart';

enum EventCategory {
  vaccination,
  checkup,
  vitamin,
  reminder,
  prenatalCheckup,
  medicineDose,
  growthCheck,
  supplement,
}

enum EventStatus {
  upcoming,
  due,
  overdue,
  completed,
}

enum VerificationStatus {
  pending,
  verified,
  rejected,
}

@JsonSerializable(fieldRename: FieldRename.snake)
class TimelineEvent {
  const TimelineEvent({
    required this.id,
    required this.dependentId,
    required this.householdId,
    required this.name,
    required this.scheduleKey,
    required this.category,
    required this.dueDate,
    required this.status,
    required this.scheduleVersion,
    required this.createdAt,
    required this.updatedAt,
    this.doseNumber,
    this.windowStart,
    this.windowEnd,
    this.completedAt,
    this.completedBy,
    this.location,
    this.notes,
    this.verificationStatus,
    this.verifiedBy,
    this.verificationDocumentUrl,
    this.verificationNotes,
    this.markedGivenAt,
  });

  final String id;
  final String dependentId;
  final String householdId;
  final String name;
  final String scheduleKey;
  final EventCategory category;
  final int? doseNumber;
  final DateTime dueDate;
  final DateTime? windowStart;
  final DateTime? windowEnd;
  final EventStatus status;
  final DateTime? completedAt;
  final String? completedBy;
  final String? location;
  final String? notes;
  final VerificationStatus? verificationStatus;
  final String? verifiedBy;
  final String? verificationDocumentUrl;
  final String? verificationNotes;
  final DateTime? markedGivenAt;
  final String scheduleVersion;
  final DateTime createdAt;
  final DateTime updatedAt;

  factory TimelineEvent.fromJson(Map<String, dynamic> json) =>
      _$TimelineEventFromJson(json);

  Map<String, dynamic> toJson() => _$TimelineEventToJson(this);
}

@JsonSerializable(fieldRename: FieldRename.snake, explicitToJson: true)
class TimelineResponse {
  const TimelineResponse({
    required this.dependentId,
    required this.dependentName,
    required this.generatedAt,
    required this.events,
    this.nextDue,
  });

  final String dependentId;
  final String dependentName;
  final DateTime generatedAt;
  final List<TimelineEvent> events;
  final TimelineEvent? nextDue;

  factory TimelineResponse.fromJson(Map<String, dynamic> json) =>
      _$TimelineResponseFromJson(json);

  Map<String, dynamic> toJson() => _$TimelineResponseToJson(this);
}

