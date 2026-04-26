import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../storage/shared_prefs_token_storage.dart';
import 'offline_mutation.dart';

const _offlineMutationQueueKey = 'offline_sync.mutations';

final offlineMutationStoreProvider = Provider<OfflineMutationStore>(
  (ref) => OfflineMutationStore(ref.watch(sharedPreferencesProvider)),
);

class OfflineMutationStore {
  OfflineMutationStore(this._prefs);

  final SharedPreferences _prefs;

  List<OfflineMutation> loadAll() {
    final raw = _prefs.getStringList(_offlineMutationQueueKey);
    if (raw == null || raw.isEmpty) {
      return <OfflineMutation>[];
    }

    return raw
        .map((item) => OfflineMutation.fromJson(jsonDecode(item) as Map<String, dynamic>))
        .toList(growable: true);
  }

  Future<void> saveAll(List<OfflineMutation> mutations) async {
    await _prefs.setStringList(
      _offlineMutationQueueKey,
      mutations.map((mutation) => mutation.encode()).toList(growable: false),
    );
  }

  Future<void> append(OfflineMutation mutation) async {
    final current = loadAll();
    current.removeWhere((item) => item.id == mutation.id);
    current.add(mutation);
    await saveAll(current);
  }

  Future<void> removeByIds(Iterable<String> ids) async {
    final idSet = ids.toSet();
    if (idSet.isEmpty) {
      return;
    }

    final remaining = loadAll().where((mutation) => !idSet.contains(mutation.id)).toList(growable: false);
    await saveAll(remaining);
  }

  Future<void> clear() async {
    await _prefs.remove(_offlineMutationQueueKey);
  }
}
