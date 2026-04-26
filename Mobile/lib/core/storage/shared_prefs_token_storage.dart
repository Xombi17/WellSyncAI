import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'token_storage.dart';

const _accessTokenKey = 'auth.access_token';
const _householdIdKey = 'auth.household_id';

final sharedPreferencesProvider = Provider<SharedPreferences>(
  (ref) => throw UnimplementedError('SharedPreferences override is required.'),
);

final tokenStorageProvider = Provider<TokenStorage>(
  (ref) => SharedPrefsTokenStorage(ref.watch(sharedPreferencesProvider)),
);

class SharedPrefsTokenStorage implements TokenStorage {
  SharedPrefsTokenStorage(this._sharedPreferences);

  final SharedPreferences _sharedPreferences;

  @override
  Future<void> clear() async {
    await _sharedPreferences.remove(_accessTokenKey);
    await _sharedPreferences.remove(_householdIdKey);
  }

  @override
  Future<String?> readAccessToken() async {
    return _sharedPreferences.getString(_accessTokenKey);
  }

  @override
  Future<String?> readHouseholdId() async {
    return _sharedPreferences.getString(_householdIdKey);
  }

  @override
  Future<void> writeSession({
    required String accessToken,
    String? householdId,
  }) async {
    await _sharedPreferences.setString(_accessTokenKey, accessToken);
    if (householdId == null || householdId.isEmpty) {
      await _sharedPreferences.remove(_householdIdKey);
      return;
    }

    await _sharedPreferences.setString(_householdIdKey, householdId);
  }
}
