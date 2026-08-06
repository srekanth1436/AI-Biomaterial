import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'core/theme.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/prediction_screen.dart';
import 'screens/graphs_screen.dart';
import 'screens/history_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/compare_screen.dart';
import 'screens/recommender_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: MyApp()));
}

final _router = GoRouter(
  initialLocation: '/login',
  redirect: (BuildContext context, GoRouterState state) async {
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
    final isLoggingIn = state.matchedLocation == '/login';

    if (!isLoggedIn && !isLoggingIn) return '/login';
    if (isLoggedIn && isLoggingIn) return '/';
    return null;
  },
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/',
      builder: (context, state) => const MainNavigationWrapper(index: 0, child: DashboardScreen()),
    ),
    GoRoute(
      path: '/predict',
      builder: (context, state) => const MainNavigationWrapper(index: 1, child: PredictionScreen()),
    ),
    GoRoute(
      path: '/compare',
      builder: (context, state) => const MainNavigationWrapper(index: 2, child: CompareScreen()),
    ),
    GoRoute(
      path: '/recommender',
      builder: (context, state) => const MainNavigationWrapper(index: 3, child: RecommenderScreen()),
    ),
    GoRoute(
      path: '/graphs',
      builder: (context, state) => const MainNavigationWrapper(index: 4, child: GraphsScreen()),
    ),
    GoRoute(
      path: '/history',
      builder: (context, state) => const MainNavigationWrapper(index: 5, child: HistoryScreen()),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const MainNavigationWrapper(index: 6, child: SettingsScreen()),
    ),
  ],
);

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Biomaterial AI Mobile',
      theme: AppTheme.darkTheme,
      routerConfig: _router,
      debugShowCheckedModeBanner: false,
    );
  }
}

class MainNavigationWrapper extends StatelessWidget {
  final Widget child;
  final int index;

  const MainNavigationWrapper({super.key, required this.index, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.surfaceDark,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: child,
          ),
        ),
      ),
      bottomNavigationBar: Center(
        heightFactor: 1,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: Container(
            decoration: BoxDecoration(
              color: AppTheme.surfaceDark,
              border: Border(top: BorderSide(color: Colors.white.withValues(alpha: 0.08))),
            ),
            child: BottomNavigationBar(
              currentIndex: index,
              backgroundColor: AppTheme.surfaceDark,
              selectedItemColor: AppTheme.primary,
              unselectedItemColor: Colors.white38,
              type: BottomNavigationBarType.fixed,
              selectedFontSize: 10,
              unselectedFontSize: 9,
              elevation: 0,
              onTap: (i) {
                if (i == 0) context.go('/');
                if (i == 1) context.go('/predict');
                if (i == 2) context.go('/compare');
                if (i == 3) context.go('/recommender');
                if (i == 4) context.go('/graphs');
                if (i == 5) context.go('/history');
                if (i == 6) context.go('/settings');
              },
              items: const [
                BottomNavigationBarItem(icon: Icon(Icons.dashboard_rounded), label: 'Dashboard'),
                BottomNavigationBarItem(icon: Icon(Icons.science_rounded), label: 'Predict'),
                BottomNavigationBarItem(icon: Icon(Icons.compare_arrows_rounded), label: 'Compare'),
                BottomNavigationBarItem(icon: Icon(Icons.auto_awesome), label: 'AI Recs'),
                BottomNavigationBarItem(icon: Icon(Icons.show_chart_rounded), label: 'Graphs'),
                BottomNavigationBarItem(icon: Icon(Icons.history_rounded), label: 'History'),
                BottomNavigationBarItem(icon: Icon(Icons.settings_rounded), label: 'Settings'),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
