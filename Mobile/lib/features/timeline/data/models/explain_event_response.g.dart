part of 'explain_event_response.dart';

ExplainEventResponse _$ExplainEventResponseFromJson(Map<String, dynamic> json) =>
    ExplainEventResponse(
      eventId: json['event_id'] as String,
      eventName: json['event_name'] as String,
      explanation: json['explanation'] as String,
    );

Map<String, dynamic> _$ExplainEventResponseToJson(
        ExplainEventResponse instance) =>
    <String, dynamic>{
      'event_id': instance.eventId,
      'event_name': instance.eventName,
      'explanation': instance.explanation,
    };

