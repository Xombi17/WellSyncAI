abstract interface class TokenStorage {
  Future<String?> readAccessToken();

  Future<String?> readHouseholdId();

  Future<void> writeSession({
    required String accessToken,
    String? householdId,
  });

  Future<void> clear();
}
