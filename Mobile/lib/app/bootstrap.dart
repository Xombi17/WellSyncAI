import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../core/storage/shared_prefs_token_storage.dart';
import 'app.dart';

Future<void> bootstrap(SharedPreferences sharedPreferences) async {
  WidgetsFlutterBinding.ensureInitialized();

  FlutterError.onError = (details) {
    FlutterError.presentError(details);
  };

  runZonedGuarded(
    () {
      runApp(
        ProviderScope(
          overrides: [
            sharedPreferencesProvider.overrideWithValue(sharedPreferences),
          ],
          child: const VaxiBabuApp(),
        ),
      );
    },
    (error, stackTrace) {
      debugPrint('Uncaught bootstrap error: $error');
      debugPrintStack(stackTrace: stackTrace);
    },
  );
}

