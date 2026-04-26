import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/application/auth_controller.dart';
import '../../dependents/data/dependent_repository.dart';
import '../../dependents/data/models/dependent.dart';
import '../../households/data/household_repository.dart';
import '../../households/data/models/household.dart';
import '../../reminders/data/models/reminder.dart';
import '../../reminders/data/reminder_repository.dart';

class DashboardOverview {
  const DashboardOverview({
    required this.households,
    required this.dependents,
    required this.reminders,
  });

  final List<Household> households;
  final List<Dependent> dependents;
  final List<Reminder> reminders;
}

final dashboardOverviewProvider =
    FutureProvider.autoDispose<DashboardOverview>((ref) async {
  final session = ref.watch(authControllerProvider).valueOrNull;
  if (session == null) {
    throw StateError('No active session.');
  }

  final householdRepository = ref.watch(householdRepositoryProvider);
  final dependentRepository = ref.watch(dependentRepositoryProvider);
  final reminderRepository = ref.watch(reminderRepositoryProvider);

  final householdsFuture = householdRepository.fetchHouseholds();
  final dependentsFuture = dependentRepository.fetchDependents(
    householdId: session.householdId,
  );
  final remindersFuture = session.householdId == null || session.householdId!.isEmpty
      ? Future.value(const <Reminder>[])
      : reminderRepository.fetchReminders(householdId: session.householdId!);

  final households = await householdsFuture;
  final dependents = await dependentsFuture;
  final reminders = await remindersFuture;

  return DashboardOverview(
    households: households,
    dependents: dependents,
    reminders: reminders,
  );
});

