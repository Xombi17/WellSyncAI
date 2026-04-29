import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/network/dio_provider.dart';
import '../../../core/sync/offline_mutation.dart';
import '../../../core/sync/offline_sync_manager.dart';
import 'models/explain_event_response.dart';
import '../../../core/network/api_endpoints.dart';
import 'models/timeline_event.dart';

final timelineRepositoryProvider = Provider<TimelineRepository>(
  (ref) => TimelineRepository(
    apiClient: ref.watch(apiClientProvider),
    offlineSyncManager: ref.watch(offlineSyncManagerProvider),
  ),
);

class TimelineRepository {
  const TimelineRepository({
    required ApiClient apiClient,
    required OfflineSyncManager offlineSyncManager,
  })  : _apiClient = apiClient,
        _offlineSyncManager = offlineSyncManager;

  final ApiClient _apiClient;
  final OfflineSyncManager _offlineSyncManager;

  Future<TimelineResponse> fetchTimeline({
    required String dependentId,
    String? category,
  }) {
    return _apiClient.get<TimelineResponse>(
      '${ApiEndpoints.timeline}/$dependentId',
      queryParameters: category == null || category.isEmpty
          ? null
          : <String, dynamic>{'category': category},
      decoder: (data) => TimelineResponse.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<MutationDispatchResult<TimelineEvent>> markEventGiven({
    required String dependentId,
    required String eventId,
  }) {
    return _dispatchTimelineMutation<TimelineEvent>(
      mutation: OfflineMutation(
        id: 'timeline:$dependentId:$eventId:mark_given',
        endpoint: '/api/v1${ApiEndpoints.timeline}/$dependentId/events/$eventId/mark-given',
        method: 'POST',
        payload: const <String, dynamic>{},
        timestamp: DateTime.now().millisecondsSinceEpoch,
      ),
      onlineCall: () => _apiClient.post<TimelineEvent>(
        '${ApiEndpoints.timeline}/$dependentId/events/$eventId/mark-given',
        data: const <String, dynamic>{},
        decoder: (data) => TimelineEvent.fromJson(data as Map<String, dynamic>),
      ),
    );
  }

  Future<MutationDispatchResult<TimelineEvent>> verifyEvent({
    required String dependentId,
    required String eventId,
    required String verifiedBy,
    String? verificationNotes,
    String? verificationDocumentUrl,
  }) {
    return _dispatchTimelineMutation<TimelineEvent>(
      mutation: OfflineMutation(
        id: 'timeline:$dependentId:$eventId:verify',
        endpoint: '/api/v1${ApiEndpoints.timeline}/$dependentId/events/$eventId/verify',
        method: 'POST',
        payload: <String, dynamic>{
          'verified_by': verifiedBy,
          'verification_notes': verificationNotes,
          'verification_document_url': verificationDocumentUrl,
        },
        timestamp: DateTime.now().millisecondsSinceEpoch,
      ),
      onlineCall: () => _apiClient.post<TimelineEvent>(
        '${ApiEndpoints.timeline}/$dependentId/events/$eventId/verify',
        data: <String, dynamic>{
          'verified_by': verifiedBy,
          'verification_notes': verificationNotes,
          'verification_document_url': verificationDocumentUrl,
        },
        decoder: (data) => TimelineEvent.fromJson(data as Map<String, dynamic>),
      ),
    );
  }

  Future<ExplainEventResponse> explainEvent({
    required String eventId,
    String language = 'en',
  }) {
    return _apiClient.post<ExplainEventResponse>(
      '${ApiEndpoints.ai}/explain-event',
      data: <String, dynamic>{
        'event_id': eventId,
        'language': language,
      },
      decoder: (data) =>
          ExplainEventResponse.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<MutationDispatchResult<T>> _dispatchTimelineMutation<T>({
    required OfflineMutation mutation,
    required Future<T> Function() onlineCall,
  }) async {
    try {
      final value = await onlineCall();
      return MutationDispatchResult<T>(
        value: value,
        queuedOffline: false,
      );
    } on ApiException catch (error) {
      final dioError = error.error;
      if (dioError is DioException &&
          (dioError.type == DioExceptionType.connectionError ||
              dioError.type == DioExceptionType.connectionTimeout ||
              dioError.type == DioExceptionType.receiveTimeout ||
              dioError.type == DioExceptionType.sendTimeout)) {
        await _offlineSyncManager.queueMutation(mutation);
        return MutationDispatchResult<T>(
          value: null,
          queuedOffline: true,
        );
      }
      rethrow;
    }
  }
}

class MutationDispatchResult<T> {
  const MutationDispatchResult({
    required this.value,
    required this.queuedOffline,
  });

  final T? value;
  final bool queuedOffline;
}
