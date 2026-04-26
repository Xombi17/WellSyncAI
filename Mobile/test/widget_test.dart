import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:vaxi_babu_mobile/app/app.dart';
import 'package:vaxi_babu_mobile/core/storage/shared_prefs_token_storage.dart';

void main() {
  testWidgets('renders login shell without crashing', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues(const <String, Object>{});
    final sharedPreferences = await SharedPreferences.getInstance();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          sharedPreferencesProvider.overrideWithValue(sharedPreferences),
        ],
        child: const VaxiBabuApp(),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Vaxi Babu'), findsOneWidget);
  });
}
