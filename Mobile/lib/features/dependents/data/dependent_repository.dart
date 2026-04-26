import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/dio_provider.dart';
import 'models/dependent.dart';

final dependentRepositoryProvider = Provider<DependentRepository>(
  (ref) => DependentRepository(ref.watch(apiClientProvider)),
);

class DependentRepository {
  const DependentRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<List<Dependent>> fetchDependents({
    String? householdId,
  }) async {
    return _apiClient.get<List<Dependent>>(
      '/dependents',
      queryParameters: householdId == null || householdId.isEmpty
          ? null
          : {'household_id': householdId},
      decoder: (data) => (data as List<dynamic>)
          .map((item) => Dependent.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}

