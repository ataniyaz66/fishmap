import 'package:flutter/foundation.dart';

/// Centralized API configuration supporting web, android emulator, desktop, and custom hosts.
class ApiConfig {
  ApiConfig._();

  /// Default API Gateway base URL
  static String get defaultBaseUrl {
    if (kIsWeb) {
      return 'http://localhost:4000';
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        // Standard Android Emulator loopback to host
        return 'http://10.0.2.2:4000';
      case TargetPlatform.iOS:
      case TargetPlatform.macOS:
      case TargetPlatform.windows:
      case TargetPlatform.linux:
      default:
        return 'http://localhost:4000';
    }
  }

  static String baseUrl = defaultBaseUrl;

  // Timeout settings
  static const Duration connectTimeout = Duration(seconds: 10);
  static const Duration receiveTimeout = Duration(seconds: 15);

  // Endpoint routes (routed through the API Gateway)
  static const String authRegister = '/api/v1/auth/register';
  static const String authLogin = '/api/v1/auth/login';
  static const String authMe = '/api/v1/auth/me';
  static const String authRefresh = '/api/v1/auth/refresh';
  static const String authLogout = '/api/v1/auth/logout';

  static const String usersMe = '/api/v1/users/me';
  static const String usersProfile = usersMe;
  static const String usersList = '/api/v1/users';

  static const String fishingSpots = '/api/v1/fishing/spots';
  static const String fishingCatches = '/api/v1/fishing/catches';
  static const String fishingSessions = '/api/v1/fishing/sessions';
  static const String fishingAnalytics = '/api/v1/fishing/analytics/user';

  static const String inventoryItems = '/api/v1/inventory/items';

  static const String socialPosts = '/api/v1/social/posts';
  static const String socialFeed = '/api/v1/social/posts';
  static const String socialFriends = '/api/v1/social/friends';
  static const String socialFriendReq = '/api/v1/social/friends/request';
  static const String socialFriendRequests = '/api/v1/social/friends/requests';
  static const String socialFriendStatus = '/api/v1/social/friends/status';
  static const String socialFriendAccept = '/api/v1/social/friends/accept';
  static const String socialFriendDecline = '/api/v1/social/friends/decline';
  static const String socialNotifs = '/api/v1/social/notifications';
  static const String socialUnreadNotifs =
      '/api/v1/social/notifications/unread-count';
  static const String socialReadNotifsAll =
      '/api/v1/social/notifications/read-all';

  static const String chatConversations = '/api/v1/chat/conversations';

  static const String weatherCurrent = '/api/v1/weather/current';
  static const String weatherForecast = '/api/v1/weather/forecast';

  static const String aiRecommendLure = '/api/v1/ai/recommend-lure';
  static const String aiAssist = '/api/v1/ai/assist';
}
