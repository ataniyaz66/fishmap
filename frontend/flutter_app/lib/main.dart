import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

import 'core/localization/app_localizations.dart';
import 'core/localization/locale_provider.dart';
import 'core/network/api_client.dart';
import 'core/theme/app_theme.dart';
import 'features/ai/state/ai_provider.dart';
import 'features/auth/screens/login_screen.dart';
import 'features/auth/screens/splash_screen.dart';
import 'features/auth/state/auth_provider.dart';
import 'features/chat/state/chat_provider.dart';
import 'features/feed/state/feed_provider.dart';
import 'features/inventory/state/inventory_provider.dart';
import 'features/journal/state/journal_provider.dart';
import 'features/map/state/map_provider.dart';
import 'features/navigation/main_navigation_screen.dart';
import 'features/profile/state/profile_provider.dart';
import 'features/social/state/social_provider.dart';
import 'features/weather/state/weather_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Set system navigation bar and status bar colors to match Midnight Ocean
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF101827),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  final apiClient = ApiClient();
  final authProvider = AuthProvider(apiClient: apiClient);
  final localeProvider = LocaleProvider();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<LocaleProvider>.value(value: localeProvider),
        ChangeNotifierProvider<AuthProvider>.value(value: authProvider),
        ChangeNotifierProvider<ProfileProvider>(
          create: (_) => ProfileProvider(apiClient: apiClient),
        ),
        ChangeNotifierProvider<MapProvider>(
          create: (_) => MapProvider(apiClient: apiClient),
        ),
        ChangeNotifierProvider<JournalProvider>(
          create: (_) => JournalProvider(apiClient: apiClient),
        ),
        ChangeNotifierProvider<InventoryProvider>(
          create: (_) => InventoryProvider(apiClient: apiClient),
        ),
        ChangeNotifierProvider<FeedProvider>(
          create: (_) => FeedProvider(apiClient: apiClient),
        ),
        ChangeNotifierProvider<SocialProvider>(
          create: (_) => SocialProvider(
            apiClient: apiClient,
            getCurrentUserId: () => authProvider.currentUser?.id ?? '',
          ),
        ),
        ChangeNotifierProvider<WeatherProvider>(
          create: (_) => WeatherProvider(apiClient: apiClient),
        ),
        ChangeNotifierProvider<AiProvider>(
          create: (_) => AiProvider(apiClient: apiClient),
        ),
        ChangeNotifierProvider<ChatProvider>(
          create: (_) => ChatProvider(
            apiClient: apiClient,
            getCurrentUserId: () => authProvider.currentUser?.id ?? '',
          ),
        ),
      ],
      child: const FishMapApp(),
    ),
  );

  // Restore cached session
  authProvider.restoreSession();
}

class FishMapApp extends StatelessWidget {
  const FishMapApp({super.key});

  @override
  Widget build(BuildContext context) {
    final localeProvider = context.watch<LocaleProvider>();

    return MaterialApp(
      title: 'FishMap',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.midnightOcean,
      locale: localeProvider.locale,
      supportedLocales: AppLocalizations.supportedLocales,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: const AuthGate(),
    );
  }
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    switch (auth.status) {
      case AuthStatus.initial:
        return const SplashScreen();
      case AuthStatus.authenticated:
        return const MainNavigationScreen();
      case AuthStatus.unauthenticated:
        return const LoginScreen();
    }
  }
}
