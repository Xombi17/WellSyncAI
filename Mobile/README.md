# Vaxi Babu Mobile

Additive Flutter mobile client for Vaxi Babu. This workspace is intentionally separate from the existing `Frontend/` Next.js app and `Android/` native client.

## Phase 1 Contents

- Riverpod app bootstrap
- `go_router` navigation shell
- `Dio` API client with bearer-token interceptor
- Shared preferences token storage
- Placeholder splash, login, and dashboard screens

## Environment Configuration

Vaxi Babu Mobile uses a JSON-based environment configuration system via Flutter's `--dart-define-from-file` flag.

1. **Create your config**: Templates are available in `.dart_define/`.
2. **Add your API Key**: Update `.dart_define/dev.json` with your Gemini API key.
3. **Run the app**:

```bash
# Development (Android Emulator)
flutter run --dart-define-from-file=.dart_define/dev.json

# Production
flutter run --dart-define-from-file=.dart_define/prod.json

# Ngrok (Physical Device)
flutter run --dart-define-from-file=.dart_define/ngrok.json
```

All API endpoints are centralized in `lib/core/network/api_endpoints.dart` and are automatically prefixed by the `API_BASE_URL` defined in your config.

## Bootstrap

The Flutter SDK is not installed in the current coding environment, so this session could not run `flutter pub get`, `flutter analyze`, or regenerate code. The workspace already contains Flutter platform runners.

Once Flutter is available locally, run:

```bash
cd Mobile
flutter pub get
# Use the config flag as shown above
```

If you ever need to regenerate missing platform folders locally, run:

```bash
flutter create . --platforms=android,ios,web
```

## Folder Structure

```text
lib/
├── app/
│   ├── app.dart
│   └── bootstrap.dart
├── core/
│   ├── config/
│   │   └── app_config.dart
│   ├── network/
│   │   ├── api_client.dart
│   │   ├── api_exception.dart
│   │   ├── auth_interceptor.dart
│   │   └── dio_provider.dart
│   ├── routing/
│   │   └── app_router.dart
│   └── storage/
│       ├── shared_prefs_token_storage.dart
│       └── token_storage.dart
├── features/
│   ├── auth/presentation/login_screen.dart
│   ├── dashboard/presentation/dashboard_screen.dart
│   └── splash/presentation/splash_screen.dart
└── main.dart
```
