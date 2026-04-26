import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../auth/application/auth_controller.dart';
import '../data/dependent_repository.dart';
import '../data/models/dependent.dart';

final dependentListProvider = FutureProvider.autoDispose<List<Dependent>>((ref) async {
  final session = ref.watch(authControllerProvider).valueOrNull;
  if (session == null) {
    return const <Dependent>[];
  }

  return ref.watch(dependentRepositoryProvider).fetchDependents(
        householdId: session.householdId,
      );
});

