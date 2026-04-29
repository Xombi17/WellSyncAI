import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/application/auth_controller.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/dashboard/presentation/dashboard_screen.dart';
import '../../features/dependents/presentation/dependents_screen.dart';
import '../../features/navigation/presentation/app_shell.dart';
import '../../features/medicine/presentation/medicine_screen.dart';
import '../../features/onboarding/presentation/register_screen.dart';
import '../../features/onboarding/presentation/welcome_screen.dart';
import '../../features/pregnancy/presentation/pregnancy_screen.dart';
import '../../features/growth/presentation/growth_screen.dart';
import '../../features/reminders/presentation/reminders_screen.dart';
import '../../features/settings/presentation/settings_screen.dart';
import '../../features/splash/presentation/splash_screen.dart';
import '../../features/timeline/presentation/timeline_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authControllerProvider);

  return GoRouter(
    initialLocation: WelcomeScreen.routePath,
    redirect: (context, state) {
      final isCheckingSession = authState.isLoading;
      final isAuthenticated = authState.valueOrNull != null;
      final currentPath = state.uri.path;

      final isOnWelcome = currentPath == WelcomeScreen.routePath;
      final isOnRegister = currentPath == RegisterScreen.routePath;
      final isOnLogin = currentPath == LoginScreen.routePath;
      final isOnSplash = currentPath == SplashScreen.routePath;

      if (isCheckingSession) {
        return null;
      }

      if (!isAuthenticated) {
        // Allow access to welcome, register, and login screens when not authenticated
        if (isOnWelcome || isOnRegister || isOnLogin) {
          return null;
        }
        return LoginScreen.routePath;
      }

      // If authenticated, redirect away from auth screens
      if (isOnWelcome || isOnRegister || isOnLogin || isOnSplash) {
        return DashboardScreen.routePath;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: WelcomeScreen.routePath,
        builder: (context, state) => const WelcomeScreen(),
      ),
      GoRoute(
        path: RegisterScreen.routePath,
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: SplashScreen.routePath,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: LoginScreen.routePath,
        builder: (context, state) => const LoginScreen(),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) => AppShell(
          navigationShell: navigationShell,
        ),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: DashboardScreen.routePath,
                builder: (context, state) => const DashboardScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: DependentsScreen.routePath,
                builder: (context, state) => const DependentsScreen(),
                routes: [
                  GoRoute(
                    path: ':dependentId/timeline',
                    builder: (context, state) => TimelineScreen(
                      dependentId: state.pathParameters['dependentId']!,
                    ),
                  ),
                  GoRoute(
                    path: ':dependentId/growth',
                    builder: (context, state) => GrowthScreen(
                      dependentId: state.pathParameters['dependentId']!,
                      householdId:
                          state.uri.queryParameters['householdId'] ?? '',
                    ),
                  ),
                ],
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: RemindersScreen.routePath,
                builder: (context, state) => const RemindersScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: SettingsScreen.routePath,
                builder: (context, state) => const SettingsScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: MedicineScreen.routePath,
                builder: (context, state) => const MedicineScreen(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: PregnancyScreen.routePath,
                builder: (context, state) => PregnancyScreen(
                  householdId: state.uri.queryParameters['householdId'] ?? '',
                ),
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
