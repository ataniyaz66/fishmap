class PostModel {
  final String id;
  final String userId;
  final String authorName;
  final String? authorAvatar;
  final String content;
  final String? spotId;
  final String? spotName;
  final String? catchId;
  final List<String> mediaUrls;
  final int likesCount;
  final int commentsCount;
  final bool hasLiked;
  final DateTime createdAt;

  PostModel({
    required this.id,
    required this.userId,
    required this.authorName,
    this.authorAvatar,
    required this.content,
    this.spotId,
    this.spotName,
    this.catchId,
    this.mediaUrls = const [],
    this.likesCount = 0,
    this.commentsCount = 0,
    this.hasLiked = false,
    required this.createdAt,
  });

  factory PostModel.fromJson(Map<String, dynamic> json) {
    String name = 'Angler';
    String? avatar;
    if (json['user'] is Map) {
      name =
          json['user']['username'] ?? json['user']['displayName'] ?? 'Angler';
      avatar = json['user']['avatarUrl'];
    } else if (json['author'] is Map) {
      name =
          json['author']['username'] ??
          json['author']['displayName'] ??
          'Angler';
      avatar = json['author']['avatarUrl'];
    } else if (json['username'] != null) {
      name = json['username'].toString();
    }

    List<String> media = [];
    if (json['mediaUrls'] is List) {
      media = (json['mediaUrls'] as List).map((e) => e.toString()).toList();
    } else if (json['media_urls'] is List) {
      media = (json['media_urls'] as List).map((e) => e.toString()).toList();
    }

    int likes = 0;
    if (json['likesCount'] != null) {
      likes = int.tryParse(json['likesCount'].toString()) ?? 0;
    } else if (json['likes_count'] != null) {
      likes = int.tryParse(json['likes_count'].toString()) ?? 0;
    }

    int comments = 0;
    if (json['commentsCount'] != null) {
      comments = int.tryParse(json['commentsCount'].toString()) ?? 0;
    } else if (json['comments_count'] != null) {
      comments = int.tryParse(json['comments_count'].toString()) ?? 0;
    }

    DateTime created = DateTime.now();
    if (json['createdAt'] != null) {
      created =
          DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now();
    }

    return PostModel(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? json['user_id']?.toString() ?? '',
      authorName: name,
      authorAvatar: avatar,
      content: json['content']?.toString() ?? '',
      spotId: json['spotId']?.toString() ?? json['spot_id']?.toString(),
      spotName:
          json['spot']?['name']?.toString() ?? json['spotName']?.toString(),
      catchId: json['catchId']?.toString() ?? json['catch_id']?.toString(),
      mediaUrls: media,
      likesCount: likes,
      commentsCount: comments,
      hasLiked: json['hasLiked'] == true || json['has_liked'] == true,
      createdAt: created,
    );
  }

  PostModel copyWith({int? likesCount, int? commentsCount, bool? hasLiked}) {
    return PostModel(
      id: id,
      userId: userId,
      authorName: authorName,
      authorAvatar: authorAvatar,
      content: content,
      spotId: spotId,
      spotName: spotName,
      catchId: catchId,
      mediaUrls: mediaUrls,
      likesCount: likesCount ?? this.likesCount,
      commentsCount: commentsCount ?? this.commentsCount,
      hasLiked: hasLiked ?? this.hasLiked,
      createdAt: createdAt,
    );
  }
}
