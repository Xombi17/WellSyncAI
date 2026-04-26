import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/dio_provider.dart';
import 'models/explain_event_response.dart';
import 'models/timeline_event.dart';

final timelineRepositoryProvider = Provider<TimelineRepository>(
  (ref) => TimelineRepository(ref.watch(apiClientProvider)),
);

class TimelineRepository {
  const TimelineRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<TimelineResponse> fetchTimeline({
    required String dependentId,
    String? category,
  }) {
    return _apiClient.get<TimelineResponse>(
      '/timeline/$dependentId',
      queryParameters: category == null || category.isEmpty
          ? null
          : <String, dynamic>{'category': category},
      decoder: (data) => TimelineResponse.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<TimelineEvent> markEventGiven({
    required String dependentId,
    required String eventId,
  }) {
    return _apiClient.post<TimelineEvent>(
      '/timeline/$dependentId/events/$eventId/mark-given',
      data: const <String, dynamic>{},
      decoder: (data) => TimelineEvent.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<TimelineEvent> verifyEvent({
    required String dependentId,
    required String eventId,
    required String verifiedBy,
    String? verificationNotes,
    String? verificationDocumentUrl,
  }) {
    return _apiClient.post<TimelineEvent>(
      '/timeline/$dependentId/events/$eventId/verify',
      data: <String, dynamic>{
        'verified_by': verifiedBy,
        'verification_notes': verificationNotes,
        'verification_document_url': verificationDocumentUrl,
      },
      decoder: (data) => TimelineEvent.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<ExplainEventResponse> explainEvent({
    required String eventId,
    String language = 'en',
  }) {
    return _apiClient.post<ExplainEventResponse>(
      '/ai/explain-event',
      data: <String, dynamic>{
        'event_id': eventId,
        'language': language,
      },
      decoder: (data) =>
          ExplainEventResponse.fromJson(data as Map<String, dynamic>),
    );
  }
}

