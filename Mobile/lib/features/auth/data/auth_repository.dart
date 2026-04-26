import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/network/api_client.dart';
import '../../../core/network/dio_provider.dart';
import '../../../core/storage/shared_prefs_token_storage.dart';
import '../../../core/storage/token_storage.dart';
import '../domain/auth_session.dart';
import 'models/auth_token_response.dart';

final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => AuthRepository(
    apiClient: ref.watch(apiClientProvider),
    tokenStorage: ref.watch(tokenStorageProvider),
  ),
);

class AuthRepository {
  const AuthRepository({
    required ApiClient apiClient,
    required TokenStorage tokenStorage,
  })  : _apiClient = apiClient,
        _tokenStorage = tokenStorage;

  final ApiClient _apiClient;
  final TokenStorage _tokenStorage;

  Future<AuthSession?> readCachedSession() async {
    final accessToken = await _tokenStorage.readAccessToken();
    if (accessToken == null || accessToken.isEmpty) {
      return null;
    }

    return AuthSession(
      accessToken: accessToken,
      tokenType: 'bearer',
      householdId: await _tokenStorage.readHouseholdId(),
    );
  }

  Future<AuthSession> login({
    required String username,
    required String password,
  }) async {
    final response = await _apiClient.post<AuthTokenResponse>(
      '/login',
      data: <String, dynamic>{
        'username': username,
        'password': password,
      },
      options: Options(
        contentType: Headers.formUrlEncodedContentType,
      ),
      decoder: (data) => AuthTokenResponse.fromJson(data as Map<String, dynamic>),
    );

    await _tokenStorage.writeSession(
      accessToken: response.accessToken,
      householdId: response.householdId,
    );

    return AuthSession(
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      householdId: response.householdId,
    );
  }

  Future<void> logout() async {
    await _tokenStorage.clear();
  }
}
