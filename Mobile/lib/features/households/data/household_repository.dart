import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/dio_provider.dart';
import 'models/household.dart';

final householdRepositoryProvider = Provider<HouseholdRepository>(
  (ref) => HouseholdRepository(ref.watch(apiClientProvider)),
);

class HouseholdRepository {
  const HouseholdRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<List<Household>> fetchHouseholds() async {
    return _apiClient.get<List<Household>>(
      '/households',
      decoder: (data) => (data as List<dynamic>)
          .map((item) => Household.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}

