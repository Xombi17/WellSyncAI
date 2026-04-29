import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/dio_provider.dart';
import '../data/models/growth_record.dart';

final growthRepositoryProvider = Provider<GrowthRepository>(
  (ref) => GrowthRepository(ref.watch(apiClientProvider)),
);

class GrowthRepository {
  const GrowthRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<GrowthRecord> createGrowthRecord({
    required String dependentId,
    required String householdId,
    required DateTime recordedDate,
    double? heightCm,
    double? weightKg,
    double? headCircumferenceCm,
    String? milestoneAchieved,
    String? notes,
  }) async {
    return _apiClient.post<GrowthRecord>(
      '/growth/$dependentId',
      data: <String, dynamic>{
        'dependent_id': dependentId,
        'household_id': householdId,
        'recorded_date': recordedDate.toIso8601String(),
        if (heightCm != null) 'height_cm': heightCm,
        if (weightKg != null) 'weight_kg': weightKg,
        if (headCircumferenceCm != null) 'head_circumference_cm': headCircumferenceCm,
        if (milestoneAchieved != null && milestoneAchieved.isNotEmpty)
          'milestone_achieved': milestoneAchieved,
        if (notes != null && notes.isNotEmpty) 'notes': notes,
      },
      decoder: (data) => GrowthRecord.fromJson(data as Map<String, dynamic>),
    );
  }

  Future<List<GrowthRecord>> listGrowthRecords(String dependentId) async {
    return _apiClient.get<List<GrowthRecord>>(
      '/growth/$dependentId',
      decoder: (data) => (data as List<dynamic>)
          .map((item) => GrowthRecord.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}