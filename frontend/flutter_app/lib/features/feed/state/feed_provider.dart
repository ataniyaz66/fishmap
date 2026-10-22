import 'package:flutter/material.dart';
import '../../../core/config/api_config.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exceptions.dart';
import '../models/comment_model.dart';
import '../models/post_model.dart';

class FeedProvider extends ChangeNotifier {
  final ApiClient apiClient;

  List<PostModel> _posts = [];
  final Map<String, List<CommentModel>> _commentsByPostId = {};
  bool _isLoading = false;
  String? _errorMessage;

  FeedProvider({required this.apiClient});

  List<PostModel> get posts => _posts;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  List<CommentModel> getComments(String postId) =>
      _commentsByPostId[postId] ?? [];

  Future<void> fetchFeed() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await apiClient.get(ApiConfig.socialFeed);

      final dynamic rawList = res is Map<String, dynamic>
          ? (res['data'] ?? res['posts'])
          : res;

      if (rawList is List) {
        _posts = rawList
            .map((item) => PostModel.fromJson(item as Map<String, dynamic>))
            .toList();
      } else {
        _posts = [];
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

  Future<bool> createPost({
    required String content,
    String? spotId,
    String? catchId,
    List<String> mediaUrls = const [],
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final body = <String, dynamic>{
        'content': content.trim(),
        'photoUrls': mediaUrls,
      };
      if (spotId != null && spotId.isNotEmpty) {
        body['spot_id'] = spotId;
        body['spotId'] = spotId;
      }
      if (catchId != null && catchId.isNotEmpty) {
        body['catch_id'] = catchId;
        body['catchId'] = catchId;
      }

      final res = await apiClient.post(ApiConfig.socialPosts, body: body);

      PostModel? newPost;
      if (res is Map<String, dynamic>) {
        final data = res['data'] is Map<String, dynamic>
            ? res['data'] as Map<String, dynamic>
            : (res['post'] is Map<String, dynamic>
                  ? res['post'] as Map<String, dynamic>
                  : res);
        if (data['id'] != null) {
          newPost = PostModel.fromJson(data);
        }
      }

      if (newPost != null) {
        _posts.insert(0, newPost);
      } else {
        await fetchFeed();
      }

      _isLoading = false;
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> toggleLike(String postId) async {
    final index = _posts.indexWhere((p) => p.id == postId);
    if (index == -1) return;

    final post = _posts[index];
    final newHasLiked = !post.hasLiked;
    final newLikesCount = newHasLiked
        ? post.likesCount + 1
        : (post.likesCount > 0 ? post.likesCount - 1 : 0);

    // Optimistic UI update
    _posts[index] = post.copyWith(
      hasLiked: newHasLiked,
      likesCount: newLikesCount,
    );
    notifyListeners();

    try {
      await apiClient.post('${ApiConfig.socialPosts}/$postId/like');
    } catch (_) {
      // Revert on failure
      _posts[index] = post;
      notifyListeners();
    }
  }

  Future<void> fetchComments(String postId) async {
    try {
      final res = await apiClient.get(
        '${ApiConfig.socialPosts}/$postId/comments',
      );
      final dynamic rawList = res is Map<String, dynamic>
          ? (res['data'] ?? res['comments'])
          : res;

      if (rawList is List) {
        _commentsByPostId[postId] = rawList
            .map((c) => CommentModel.fromJson(c as Map<String, dynamic>))
            .toList();
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<bool> addComment(String postId, String content) async {
    if (content.trim().isEmpty) return false;

    try {
      final res = await apiClient.post(
        '${ApiConfig.socialPosts}/$postId/comments',
        body: {'content': content.trim()},
      );

      CommentModel? newComment;
      if (res is Map<String, dynamic>) {
        final data = res['data'] is Map<String, dynamic>
            ? res['data'] as Map<String, dynamic>
            : (res['comment'] is Map<String, dynamic>
                  ? res['comment'] as Map<String, dynamic>
                  : res);
        if (data['id'] != null) {
          newComment = CommentModel.fromJson(data);
        }
      }

      if (newComment != null) {
        final existing = _commentsByPostId[postId] ?? [];
        _commentsByPostId[postId] = [...existing, newComment];

        // Increment comments count on post
        final postIndex = _posts.indexWhere((p) => p.id == postId);
        if (postIndex != -1) {
          _posts[postIndex] = _posts[postIndex].copyWith(
            commentsCount: _posts[postIndex].commentsCount + 1,
          );
        }

        notifyListeners();
        return true;
      }
    } catch (_) {}
    return false;
  }
}
