import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/dio_provider.dart';
import 'models/reminder.dart';

final reminderRepositoryProvider = Provider<ReminderRepository>(
  (ref) => ReminderRepository(ref.watch(apiClientProvider)),
);

class ReminderRepository {
  const ReminderRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<List<Reminder>> fetchReminders({
    required String householdId,
  }) async {
    return _apiClient.get<List<Reminder>>(
      '/reminders',
      queryParameters: {
        'household_id': householdId,
      },
      decoder: (data) => (data as List<dynamic>)
          .map((item) => Reminder.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}
