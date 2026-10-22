import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:fishmap/core/localization/app_localizations.dart';
import 'package:fishmap/core/localization/locale_provider.dart';
import 'package:fishmap/core/network/api_client.dart';
import 'package:fishmap/core/network/api_exceptions.dart';
import 'package:fishmap/core/theme/app_theme.dart';
import 'package:fishmap/core/widgets/app_badge.dart';
import 'package:fishmap/core/widgets/app_button.dart';
import 'package:fishmap/core/widgets/app_card.dart';
import 'package:fishmap/core/widgets/app_empty_state.dart';
import 'package:fishmap/core/widgets/app_error_view.dart';
import 'package:fishmap/features/ai/models/ai_recommendation.dart';
import 'package:fishmap/features/auth/models/auth_tokens.dart';
import 'package:fishmap/features/auth/models/user_model.dart';
import 'package:fishmap/features/auth/screens/login_screen.dart';
import 'package:fishmap/features/auth/screens/register_screen.dart';
import 'package:fishmap/features/auth/state/auth_provider.dart';
import 'package:fishmap/features/feed/models/post_model.dart';
import 'package:fishmap/features/fishing/data/fish_catalog.dart';
import 'package:fishmap/features/inventory/models/inventory_item.dart';
import 'package:fishmap/features/journal/models/catch_model.dart';
import 'package:fishmap/features/map/models/fishing_spot.dart';
import 'package:fishmap/features/social/models/friend_request_model.dart';
import 'package:fishmap/features/social/models/notification_model.dart';
import 'package:fishmap/features/social/models/user_summary.dart';
import 'package:fishmap/features/weather/models/weather_model.dart';

void main() {
  group('Unit Tests - Data Models & Serialization', () {
    test('UserModel serializes and deserializes correctly', () {
      final json = {
        'id': 'usr-123',
        'email': 'angler@fishmap.io',
        'username': 'master_caster',
        'role': 'user',
        'status': 'active',
        'isEmailVerified': true,
        'createdAt': '2026-10-21T12:00:00.000Z',
      };

      final user = UserModel.fromJson(json);
      expect(user.id, 'usr-123');
      expect(user.email, 'angler@fishmap.io');
      expect(user.username, 'master_caster');
      expect(user.isEmailVerified, true);

      final serialized = user.toJson();
      expect(serialized['id'], 'usr-123');
      expect(serialized['username'], 'master_caster');
    });

    test('AuthTokens serializes and deserializes correctly', () {
      final json = {
        'accessToken': 'access-token-xyz',
        'refreshToken': 'refresh-token-xyz',
        'tokenType': 'Bearer',
        'expiresIn': 900,
      };

      final tokens = AuthTokens.fromJson(json);
      expect(tokens.accessToken, 'access-token-xyz');
      expect(tokens.refreshToken, 'refresh-token-xyz');
      expect(tokens.expiresIn, 900);
      expect(tokens.tokenType, 'Bearer');

      final serialized = tokens.toJson();
      expect(serialized['accessToken'], 'access-token-xyz');
    });

    test('CatchModel parses weight, length and timestamps', () {
      final json = {
        'id': 'catch-456',
        'species': 'Сазан (Карп)',
        'weight': 6.45,
        'length': 68.0,
        'lure': 'Boilie 20mm',
        'notes': 'Caught on Ishim riverbank',
        'caughtAt': '2026-10-21T06:30:00.000Z',
      };

      final c = CatchModel.fromJson(json);
      expect(c.id, 'catch-456');
      expect(c.species, 'Сазан (Карп)');
      expect(c.weight, 6.45);
      expect(c.length, 68.0);
      expect(c.lure, 'Boilie 20mm');
    });

    test('InventoryItem parses properties and copyWith functions', () {
      final json = {
        'id': 'item-789',
        'name': 'Lucky Craft Sammy 100',
        'category': 'lure',
        'brand': 'Lucky Craft',
        'quantity': 2,
        'color': 'Ghost Minnow',
        'weight': 13.6,
      };

      final item = InventoryItem.fromJson(json);
      expect(item.id, 'item-789');
      expect(item.name, 'Lucky Craft Sammy 100');
      expect(item.quantity, 2);

      final updated = item.copyWith(quantity: 3);
      expect(updated.quantity, 3);
      expect(updated.name, item.name);
    });

    test('FishingSpot parses coordinates and target species', () {
      final json = {
        'id': 'spot-101',
        'name': 'Astana Ishim River Reach',
        'latitude': 51.1694,
        'longitude': 71.4491,
        'waterType': 'freshwater',
        'targetSpecies': ['Сазан', 'Щука', 'Судак'],
        'isPublic': true,
      };

      final spot = FishingSpot.fromJson(json);
      expect(spot.id, 'spot-101');
      expect(spot.name, 'Astana Ishim River Reach');
      expect(spot.latitude, 51.1694);
      expect(spot.longitude, 71.4491);
      expect(spot.targetSpecies.length, 3);
    });

    test('PostModel parses author, likes, and comments count', () {
      final json = {
        'id': 'post-202',
        'userId': 'usr-123',
        'content': 'Great autumn pike fishing on Ishim!',
        'likesCount': 5,
        'commentsCount': 2,
        'hasLiked': true,
        'user': {'username': 'astana_angler'},
      };

      final post = PostModel.fromJson(json);
      expect(post.id, 'post-202');
      expect(post.authorName, 'astana_angler');
      expect(post.likesCount, 5);
      expect(post.hasLiked, true);
    });

    test('WeatherModel parses temperature, wind, and suitability score', () {
      final json = {
        'current': {
          'temperature': 18.5,
          'windSpeed': 12.0,
          'pressure': 1014.2,
          'condition': 'Partly Cloudy',
          'suitability': {
            'score': 8,
            'rating': 'Good',
            'reasons': [
              'Stable barometric pressure',
              'Optimal water temperature',
            ],
          },
        },
      };

      final weather = WeatherModel.fromJson(json);
      expect(weather.temperature, 18.5);
      expect(weather.suitabilityScore, 8);
      expect(weather.suitabilityRating, 'Good');
      expect(weather.reasons.length, 2);
      expect(weather.barometerAdvice.contains('Stable barometric pressure'), true);
    });

    test('AiRecommendation parses primary lure and matched inventory', () {
      final json = {
        'recommendation': {
          'primaryLure': 'Deep Diving Crankbait',
          'confidence': 0.92,
          'retrieveTechnique': 'Deflection off rocks with pause',
          'reasoning':
              'Fish are holding in 12-15ft depths due to high pressure',
          'matchedInventory': ['Strike King 6XD', 'Rapala DT-16'],
        },
      };

      final ai = AiRecommendation.fromJson(json);
      expect(ai.primaryLure, 'Deep Diving Crankbait');
      expect(ai.confidence, 0.92);
      expect(ai.matchedInventory.length, 2);
    });

    test('UserSummary, FriendRequestModel, and NotificationModel parse cleanly', () {
      final u = UserSummary.fromJson({
        'id': 'usr-1',
        'auth_user_id': 'auth-1',
        'display_name': 'Kairat Angler',
        'location': 'Astana',
      });
      expect(u.displayName, 'Kairat Angler');
      expect(u.location, 'Astana');

      final req = FriendRequestModel.fromJson({
        'id': 'req-1',
        'requester_id': 'auth-1',
        'addressee_id': 'auth-2',
        'status': 'pending',
      });
      expect(req.id, 'req-1');
      expect(req.status, 'pending');

      final notif = NotificationModel.fromJson({
        'id': 'notif-1',
        'user_id': 'auth-2',
        'actor_id': 'auth-1',
        'type': 'like',
        'read': false,
      });
      expect(notif.type, 'like');
      expect(notif.read, false);
    });

    test('ApiException handles network, timeout, and structured response', () {
      final netErr = ApiException.networkError();
      expect(netErr.code, 'NETWORK_ERROR');

      final timeErr = ApiException.timeout();
      expect(timeErr.code, 'TIMEOUT');

      final unauth = ApiException.unauthorized();
      expect(unauth.statusCode, 401);

      final apiErr = ApiException.fromResponse(400, {
        'error': {
          'code': 'INVALID_CREDENTIALS',
          'message': 'Invalid username or password',
        },
      });
      expect(apiErr.statusCode, 400);
      expect(apiErr.code, 'INVALID_CREDENTIALS');
      expect(apiErr.message, 'Invalid username or password');
    });
  });

  group('Unit Tests - Kazakhstan Fish Catalog & Multi-Language Localization', () {
    test('FishCatalog includes all regional species and localized names', () {
      expect(FishCatalog.allSpecies.length >= 10, true);

      final sazan = FishCatalog.findById('carp_sazan');
      expect(sazan, isNotNull);
      expect(sazan!.nameRu, 'Сазан (Карп)');
      expect(sazan.nameKk, 'Сазан (Тұқы)');
      expect(sazan.nameEn, 'Common Carp');

      final pike = FishCatalog.findById('northern_pike');
      expect(pike, isNotNull);
      expect(pike!.nameRu, 'Щука');
      expect(pike.nameKk, 'Шортан');

      final sudak = FishCatalog.findById('zander_sudak');
      expect(sudak, isNotNull);
      expect(sudak!.nameRu, 'Судак');
      expect(sudak.nameKk, 'Көксерке');

      // Search functionality
      final searchResults = FishCatalog.search('шортан', 'kk');
      expect(searchResults.any((s) => s.id == 'northern_pike'), true);

      final ruResults = FishCatalog.search('карп', 'ru');
      expect(ruResults.any((s) => s.id == 'carp_sazan'), true);
    });

    test('AppLocalizations translates correctly for ru, kk, and en', () {
      final ru = AppLocalizations(const Locale('ru'));
      expect(ru.translate('feed'), 'Лента');
      expect(ru.translate('map'), 'Карта');
      expect(ru.translate('anglers'), 'Рыболовы');
      expect(ru.translate('logCatch'), 'Записать улов');

      final kk = AppLocalizations(const Locale('kk'));
      expect(kk.translate('feed'), 'Таспа');
      expect(kk.translate('anglers'), 'Балықшылар');
      expect(kk.translate('logCatch'), 'Олжаны жазу');

      final en = AppLocalizations(const Locale('en'));
      expect(en.translate('feed'), 'Feed');
      expect(en.translate('anglers'), 'Anglers');
      expect(en.translate('logCatch'), 'Log Catch');
    });
  });

  group('Widget Tests - Reusable UI Components', () {
    testWidgets('AppButton renders text and triggers callback', (tester) async {
      bool tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.midnightOcean,
          home: Scaffold(
            body: AppButton(text: 'Save Catch', onPressed: () => tapped = true),
          ),
        ),
      );

      expect(find.text('Save Catch'), findsOneWidget);
      await tester.tap(find.text('Save Catch'));
      await tester.pumpAndSettle();

      expect(tapped, true);
    });

    testWidgets('AppButton renders loading indicator when isLoading is true', (
      tester,
    ) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.midnightOcean,
          home: Scaffold(
            body: AppButton(text: 'Submit', isLoading: true, onPressed: () {}),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.text('Submit'), findsNothing);
    });

    testWidgets('AppBadge displays label with custom icon', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AppBadge(label: 'FRESHWATER', icon: Icons.water),
          ),
        ),
      );

      expect(find.text('FRESHWATER'), findsOneWidget);
      expect(find.byIcon(Icons.water), findsOneWidget);
    });

    testWidgets('AppCard renders child and responds to tap', (tester) async {
      bool tapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppCard(
              onTap: () => tapped = true,
              child: const Text('Card Content'),
            ),
          ),
        ),
      );

      expect(find.text('Card Content'), findsOneWidget);
      await tester.tap(find.text('Card Content'));
      expect(tapped, true);
    });

    testWidgets('AppEmptyState displays title, description and CTA', (
      tester,
    ) async {
      bool ctaTapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppEmptyState(
              icon: Icons.phishing,
              title: 'Empty Tackle Box',
              description: 'Add your first lure now',
              actionText: 'Add Item',
              onAction: () => ctaTapped = true,
            ),
          ),
        ),
      );

      expect(find.text('Empty Tackle Box'), findsOneWidget);
      expect(find.text('Add your first lure now'), findsOneWidget);
      expect(find.text('Add Item'), findsOneWidget);

      await tester.tap(find.text('Add Item'));
      expect(ctaTapped, true);
    });

    testWidgets('AppErrorView displays message and retry button', (
      tester,
    ) async {
      bool retried = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppErrorView(
              message: 'Failed to connect to gateway',
              onRetry: () => retried = true,
            ),
          ),
        ),
      );

      expect(find.text('Failed to connect to gateway'), findsOneWidget);
      expect(find.text('Try Again'), findsOneWidget);

      await tester.tap(find.text('Try Again'));
      expect(retried, true);
    });
  });

  group('Widget Tests - Authentication Screens', () {
    testWidgets(
      'LoginScreen renders brand, inputs, and validates empty submission',
      (tester) async {
        final apiClient = ApiClient();
        final authProvider = AuthProvider(apiClient: apiClient);
        final localeProvider = LocaleProvider();

        await tester.pumpWidget(
          MultiProvider(
            providers: [
              ChangeNotifierProvider<LocaleProvider>.value(value: localeProvider),
              ChangeNotifierProvider<AuthProvider>.value(value: authProvider),
            ],
            child: MaterialApp(
              theme: AppTheme.midnightOcean,
              locale: const Locale('en'),
              supportedLocales: AppLocalizations.supportedLocales,
              localizationsDelegates: const [
                AppLocalizations.delegate,
                GlobalMaterialLocalizations.delegate,
                GlobalWidgetsLocalizations.delegate,
                GlobalCupertinoLocalizations.delegate,
              ],
              home: const LoginScreen(),
            ),
          ),
        );

        expect(find.text('Welcome to FishMap'), findsOneWidget);
        expect(find.text('Email or Username'), findsOneWidget);
        expect(find.text('Password'), findsOneWidget);
        expect(find.text('Sign In'), findsOneWidget);
        expect(find.text('Register'), findsOneWidget);

        // Tap Sign In with empty fields
        await tester.ensureVisible(find.text('Sign In'));
        await tester.tap(find.text('Sign In'));
        await tester.pumpAndSettle();

        // Form validation error should appear
        expect(
          find.text('Please enter your email or username'),
          findsOneWidget,
        );
        expect(find.text('Please enter your password'), findsOneWidget);
      },
    );

    testWidgets(
      'RegisterScreen validates required email, username, and password length',
      (tester) async {
        final apiClient = ApiClient();
        final authProvider = AuthProvider(apiClient: apiClient);
        final localeProvider = LocaleProvider();

        await tester.pumpWidget(
          MultiProvider(
            providers: [
              ChangeNotifierProvider<LocaleProvider>.value(value: localeProvider),
              ChangeNotifierProvider<AuthProvider>.value(value: authProvider),
            ],
            child: MaterialApp(
              theme: AppTheme.midnightOcean,
              locale: const Locale('en'),
              supportedLocales: AppLocalizations.supportedLocales,
              localizationsDelegates: const [
                AppLocalizations.delegate,
                GlobalMaterialLocalizations.delegate,
                GlobalWidgetsLocalizations.delegate,
                GlobalCupertinoLocalizations.delegate,
              ],
              home: const RegisterScreen(),
            ),
          ),
        );

        expect(find.text('Join FishMap Community'), findsOneWidget);
        expect(find.text('Email'), findsOneWidget);
        expect(find.text('Password'), findsOneWidget);

        // Tap Register with empty fields
        final registerBtn = find.widgetWithText(AppButton, 'Register');
        await tester.ensureVisible(registerBtn);
        await tester.tap(registerBtn);
        await tester.pumpAndSettle();

        expect(find.text('Please enter a username'), findsOneWidget);
        expect(find.text('Please enter your email'), findsOneWidget);
        expect(find.text('Please enter a password'), findsOneWidget);
      },
    );
  });
}
