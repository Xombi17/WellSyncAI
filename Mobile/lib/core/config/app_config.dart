class AppConfig {
  const AppConfig._();

  static const String appName = 'Vaxi Babu';
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://well-sync-ai-pearl.vercel.app/api/v1',
  );

  static const Duration connectTimeout = Duration(seconds: 20);
  static const Duration receiveTimeout = Duration(seconds: 20);
}

