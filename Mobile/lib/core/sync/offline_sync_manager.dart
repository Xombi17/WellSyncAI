import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../network/api_client.dart';
import '../network/dio_provider.dart';
import 'offline_mutation.dart';
import 'offline_mutation_store.dart';

final offlineSyncManagerProvider = Provider<OfflineSyncManager>((ref) {
  final manager = OfflineSyncManager(
    apiClient: ref.watch(apiClientProvider),
    store: ref.watch(offlineMutationStoreProvider),
    connectivity: Connectivity(),
  );
  manager.start();
  ref.onDispose(manager.dispose);
  return manager;
});

class OfflineSyncManager {
  OfflineSyncManager({
    required ApiClient apiClient,
    required OfflineMutationStore store,
    required Connectivity connectivity,
  })  : _apiClient = apiClient,
        _store = store,
        _connectivity = connectivity;

  final ApiClient _apiClient;
  final OfflineMutationStore _store;
  final Connectivity _connectivity;

  StreamSubscription<List<ConnectivityResult>>? _subscription;
  bool _syncing = false;

  void start() {
    _subscription ??= _connectivity.onConnectivityChanged.listen((results) {
      if (_hasNetwork(results)) {
        unawaited(syncPendingMutations());
      }
    });

    unawaited(_bootstrapSync());
  }

  Future<void> _bootstrapSync() async {
    final connectivity = await _connectivity.checkConnectivity();
    if (_hasNetwork(connectivity)) {
      await syncPendingMutations();
    }
  }

  Future<void> queueMutation(OfflineMutation mutation) async {
    await _store.append(mutation);
  }

  Future<void> syncPendingMutations() async {
    if (_syncing) {
      return;
    }

    final queued = _store.loadAll();
    if (queued.isEmpty) {
      return;
    }

    _syncing = true;
    try {
      final response = await _apiClient.post<Map<String, dynamic>>(
        '/sync/batch',
        data: <String, dynamic>{
          'mutations': queued.map((mutation) => mutation.toJson()).toList(growable: false),
        },
        decoder: (data) => (data as Map<String, dynamic>),
      );

      final results = (response['results'] as List<dynamic>? ?? const <dynamic>[]);
      final appliedIds = <String>{};
      final skippedIds = <String>{};

      for (final item in results) {
        final result = (item as Map<String, dynamic>);
        final id = result['id'] as String;
        final status = result['status'] as String?;
        if (status == 'applied') {
          appliedIds.add(id);
        } else if (status == 'skipped') {
          skippedIds.add(id);
        }
      }

      await _store.removeByIds(<String>{...appliedIds, ...skippedIds});
    } catch (_) {
      // Leave the queue intact if replay fails for any reason.
    } finally {
      _syncing = false;
    }
  }

  void dispose() {
    _subscription?.cancel();
    _subscription = null;
  }

  bool _hasNetwork(List<ConnectivityResult> results) {
    return results.any((result) => result != ConnectivityResult.none);
  }
}
