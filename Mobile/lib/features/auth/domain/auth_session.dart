class AuthSession {
  const AuthSession({
    required this.accessToken,
    required this.tokenType,
    this.householdId,
  });

  final String accessToken;
  final String tokenType;
  final String? householdId;
}

