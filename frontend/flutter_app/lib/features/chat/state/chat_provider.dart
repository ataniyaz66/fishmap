import 'package:flutter/material.dart';
import '../../../core/config/api_config.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exceptions.dart';
import '../models/chat_message.dart';
import '../models/conversation_model.dart';

class ChatProvider extends ChangeNotifier {
  final ApiClient apiClient;
  final String Function() getCurrentUserId;

  List<ConversationModel> _conversations = [];
  final Map<String, List<ChatMessage>> _messagesByConv = {};
  bool _isLoading = false;
  String? _errorMessage;

  ChatProvider({required this.apiClient, required this.getCurrentUserId});

  List<ConversationModel> get conversations => _conversations;
  int get unreadTotal =>
      _conversations.fold<int>(0, (sum, c) => sum + c.unreadCount);
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  List<ChatMessage> getMessages(String convId) => _messagesByConv[convId] ?? [];

  Future<void> fetchConversations() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await apiClient.get(ApiConfig.chatConversations);
      final currentUserId = getCurrentUserId();
      final dynamic rawList = res is Map<String, dynamic>
          ? (res['data'] ?? res['conversations'])
          : res;

      if (rawList is List) {
        _conversations = rawList
            .map(
              (c) => ConversationModel.fromJson(
                c as Map<String, dynamic>,
                currentUserId,
              ),
            )
            .toList();
      } else {
        _conversations = [];
      }
    } on ApiException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchMessages(String convId) async {
    try {
      final res = await apiClient.get(
        '${ApiConfig.chatConversations}/$convId/messages',
      );
      final dynamic rawList = res is Map<String, dynamic>
          ? (res['messages'] ?? res['data'])
          : res;

      if (rawList is List) {
        _messagesByConv[convId] = rawList
            .map((m) => ChatMessage.fromJson(m as Map<String, dynamic>))
            .toList();
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<bool> sendMessage(String convId, String content) async {
    if (content.trim().isEmpty) return false;

    try {
      final res = await apiClient.post(
        '${ApiConfig.chatConversations}/$convId/messages',
        body: {'content': content.trim()},
      );

      ChatMessage? msg;
      if (res is Map<String, dynamic>) {
        final data = res['data'] is Map<String, dynamic>
            ? res['data'] as Map<String, dynamic>
            : (res['message'] is Map<String, dynamic>
                  ? res['message'] as Map<String, dynamic>
                  : res);
        if (data['id'] != null) {
          msg = ChatMessage.fromJson(data);
        }
      }

      if (msg != null) {
        final existing = _messagesByConv[convId] ?? [];
        _messagesByConv[convId] = [...existing, msg];
        notifyListeners();
        return true;
      }
    } catch (_) {}
    return false;
  }
}
