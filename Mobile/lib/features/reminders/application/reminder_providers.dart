import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/application/auth_controller.dart';
import '../data/models/reminder.dart';
import '../data/reminder_repository.dart';

final reminderListProvider = FutureProvider.autoDispose<List<Reminder>>((ref) async {
  final session = ref.watch(authControllerProvider).valueOrNull;
  final householdId = session?.householdId;
  if (householdId == null || householdId.isEmpty) {
    return const <Reminder>[];
  }

  return ref.watch(reminderRepositoryProvider).fetchReminders(
        householdId: householdId,
      );
});

