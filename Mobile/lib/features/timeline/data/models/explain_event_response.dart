import 'package:json_annotation/json_annotation.dart';

part 'explain_event_response.g.dart';

@JsonSerializable(fieldRename: FieldRename.snake)
class ExplainEventResponse {
  const ExplainEventResponse({
    required this.eventId,
    required this.eventName,
    required this.explanation,
  });

  final String eventId;
  final String eventName;
  final String explanation;

  factory ExplainEventResponse.fromJson(Map<String, dynamic> json) =>
      _$ExplainEventResponseFromJson(json);

  Map<String, dynamic> toJson() => _$ExplainEventResponseToJson(this);
}

