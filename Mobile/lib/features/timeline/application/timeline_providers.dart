import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../data/models/timeline_event.dart';
import '../data/timeline_repository.dart';

final timelineProvider =
    FutureProvider.autoDispose.family<TimelineResponse, String>((ref, dependentId) {
  return ref.watch(timelineRepositoryProvider).fetchTimeline(
        dependentId: dependentId,
      );
});

