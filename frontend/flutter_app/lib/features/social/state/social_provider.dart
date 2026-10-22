import 'package:flutter/material.dart';
import '../../../core/config/api_config.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exceptions.dart';
import '../models/friend_request_model.dart';
import '../models/notification_model.dart';
import '../models/user_summary.dart';

class SocialProvider extends ChangeNotifier {
  final ApiClient apiClient;
  final String Function() getCurrentUserId;

  List<UserSummary> _searchResults = [];
  List<String> _friendIds = [];
  List<FriendRequestModel> _pendingRequests = [];
  List<NotificationModel> _notifications = [];
  int _unreadNotificationsCount = 0;

  bool _isSearching = false;
  bool _isLoadingFriends = false;
  bool _isLoadingRequests = false;
  bool _isLoadingNotifications = false;
  String? _errorMessage;

  SocialProvider({
    required this.apiClient,
    required this.getCurrentUserId,
  });

  List<UserSummary> get searchResults => _searchResults;
  List<String> get friendIds => _friendIds;
  List<FriendRequestModel> get pendingRequests => _pendingRequests;
  List<NotificationModel> get notifications => _notifications;
  int get unreadNotificationsCount => _unreadNotificationsCount;

  bool get isSearching => _isSearching;
  bool get isLoadingFriends => _isLoadingFriends;
  bool get isLoadingRequests => _isLoadingRequests;
  bool get isLoadingNotifications => _isLoadingNotifications;
  String? get errorMessage => _errorMessage;

  bool isFriend(String userId) =>
      _friendIds.any((id) => id.toLowerCase() == userId.toLowerCase());

  /// Search anglers by query string
  Future<void> searchAnglers(String query) async {
    _isSearching = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await apiClient.get(
        ApiConfig.usersList,
        queryParameters: {'search': query.trim(), 'limit': 30},
      );

      final currentUserId = getCurrentUserId();
      final dynamic rawList = res is Map<String, dynamic>
          ? (res['data'] ?? res['users'] ?? res['profiles'])
          : res;

      if (rawList is List) {
        final list = <UserSummary>[];
        for (final item in rawList) {
          if (item is Map<String, dynamic>) {
            var summary = UserSummary.fromJson(item);
            if (summary.authUserId.toLowerCase() ==
                currentUserId.toLowerCase()) {
              summary = summary.copyWith(relationshipStatus: 'self');
            } else if (isFriend(summary.authUserId)) {
              summary = summary.copyWith(relationshipStatus: 'friends');
            }
            list.add(summary);
          }
        }
        _searchResults = list;
      } else {
        _searchResults = [];
      }
    } on ApiException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isSearching = false;
      notifyListeners();
    }
  }

  /// Fetch list of current user's accepted friends
  Future<void> fetchFriends() async {
    _isLoadingFriends = true;
    notifyListeners();

    try {
      final res = await apiClient.get(ApiConfig.socialFriends);
      final dynamic rawList = res is Map<String, dynamic>
          ? (res['data'] ?? res['friends'])
          : res;

      if (rawList is List) {
        _friendIds = rawList.map((e) => e.toString()).toList();
      }
    } catch (_) {
    } finally {
      _isLoadingFriends = false;
      notifyListeners();
    }
  }

  /// Fetch list of incoming pending friend requests
  Future<void> fetchPendingRequests() async {
    _isLoadingRequests = true;
    notifyListeners();

    try {
      final res = await apiClient.get(ApiConfig.socialFriendRequests);
      final dynamic rawList = res is Map<String, dynamic>
          ? (res['data'] ?? res['requests'])
          : res;

      if (rawList is List) {
        _pendingRequests = rawList
            .map((item) =>
                FriendRequestModel.fromJson(item as Map<String, dynamic>))
            .toList();
      } else {
        _pendingRequests = [];
      }
    } catch (_) {
    } finally {
      _isLoadingRequests = false;
      notifyListeners();
    }
  }

  /// Send friend request to another user
  Future<bool> sendFriendRequest(String addresseeId) async {
    try {
      await apiClient.post(
        ApiConfig.socialFriendReq,
        body: {'addressee_id': addresseeId},
      );

      // Update in search results optimistically
      final idx = _searchResults
          .indexWhere((u) => u.authUserId == addresseeId || u.id == addresseeId);
      if (idx != -1) {
        _searchResults[idx] =
            _searchResults[idx].copyWith(relationshipStatus: 'pending_sent');
        notifyListeners();
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  /// Accept an incoming friend request
  Future<bool> acceptFriendRequest(String friendshipId,
      {String? requesterId}) async {
    try {
      await apiClient.post('${ApiConfig.socialFriendAccept}/$friendshipId');

      _pendingRequests.removeWhere((r) => r.id == friendshipId);
      if (requesterId != null && !_friendIds.contains(requesterId)) {
        _friendIds.add(requesterId);
      }

      // Update search results if present
      if (requesterId != null) {
        final idx = _searchResults.indexWhere(
            (u) => u.authUserId == requesterId || u.id == requesterId);
        if (idx != -1) {
          _searchResults[idx] =
              _searchResults[idx].copyWith(relationshipStatus: 'friends');
        }
      }
      notifyListeners();
      return true;
    } catch (_) {
      return false;
    }
  }

  /// Decline an incoming friend request
  Future<bool> declineFriendRequest(String friendshipId) async {
    try {
      await apiClient.post('${ApiConfig.socialFriendDecline}/$friendshipId');
      _pendingRequests.removeWhere((r) => r.id == friendshipId);
      notifyListeners();
      return true;
    } catch (_) {
      return false;
    }
  }

  /// Remove a friend or cancel a request
  Future<bool> removeFriend(String targetId) async {
    try {
      await apiClient.delete('${ApiConfig.socialFriends}/$targetId');
      _friendIds.removeWhere(
          (id) => id.toLowerCase() == targetId.toLowerCase());

      final idx = _searchResults
          .indexWhere((u) => u.authUserId == targetId || u.id == targetId);
      if (idx != -1) {
        _searchResults[idx] =
            _searchResults[idx].copyWith(relationshipStatus: 'none');
      }
      notifyListeners();
      return true;
    } catch (_) {
      return false;
    }
  }

  /// Get friendship status with a specific user
  Future<String> getFriendshipStatus(String targetUserId) async {
    final currentUserId = getCurrentUserId();
    if (targetUserId.toLowerCase() == currentUserId.toLowerCase()) {
      return 'self';
    }
    if (isFriend(targetUserId)) {
      return 'friends';
    }

    try {
      final res = await apiClient
          .get('${ApiConfig.socialFriendStatus}/$targetUserId');
      if (res is Map<String, dynamic> && res['data'] is Map) {
        final data = res['data'] as Map;
        return data['status']?.toString() ?? 'none';
      }
    } catch (_) {}
    return 'none';
  }

  /// Fetch user notifications
  Future<void> fetchNotifications() async {
    _isLoadingNotifications = true;
    notifyListeners();

    try {
      final res = await apiClient.get(ApiConfig.socialNotifs);
      final dynamic rawList = res is Map<String, dynamic>
          ? (res['data'] ?? res['notifications'])
          : res;

      if (rawList is List) {
        _notifications = rawList
            .map((item) =>
                NotificationModel.fromJson(item as Map<String, dynamic>))
            .toList();
        _unreadNotificationsCount =
            _notifications.where((n) => !n.read).length;
      }
    } catch (_) {
    } finally {
      _isLoadingNotifications = false;
      notifyListeners();
    }
  }

  /// Fetch unread notifications count
  Future<void> fetchUnreadCount() async {
    try {
      final res = await apiClient.get(ApiConfig.socialUnreadNotifs);
      if (res is Map<String, dynamic>) {
        final count = res['unreadCount'] ?? res['count'] ?? res['data'];
        if (count != null) {
          _unreadNotificationsCount = int.tryParse(count.toString()) ?? 0;
          notifyListeners();
        }
      }
    } catch (_) {}
  }

  /// Mark notification as read
  Future<void> markNotificationRead(String id) async {
    final index = _notifications.indexWhere((n) => n.id == id);
    if (index != -1 && !_notifications[index].read) {
      _notifications[index] = _notifications[index].copyWith(read: true);
      _unreadNotificationsCount =
          (_unreadNotificationsCount > 0) ? _unreadNotificationsCount - 1 : 0;
      notifyListeners();

      try {
        await apiClient.patch('${ApiConfig.socialNotifs}/$id/read');
      } catch (_) {}
    }
  }

  /// Mark all notifications as read
  Future<void> markAllNotificationsRead() async {
    for (int i = 0; i < _notifications.length; i++) {
      if (!_notifications[i].read) {
        _notifications[i] = _notifications[i].copyWith(read: true);
      }
    }
    _unreadNotificationsCount = 0;
    notifyListeners();
  }
}
