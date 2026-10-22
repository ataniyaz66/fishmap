class CommentModel {
  final String id;
  final String postId;
  final String userId;
  final String authorName;
  final String? authorAvatar;
  final String content;
  final DateTime createdAt;

  CommentModel({
    required this.id,
    required this.postId,
    required this.userId,
    required this.authorName,
    this.authorAvatar,
    required this.content,
    required this.createdAt,
  });

  factory CommentModel.fromJson(Map<String, dynamic> json) {
    String name = 'Angler';
    String? avatar;
    if (json['user'] is Map) {
      name =
          json['user']['username'] ?? json['user']['displayName'] ?? 'Angler';
      avatar = json['user']['avatarUrl'];
    } else if (json['username'] != null) {
      name = json['username'].toString();
    }

    DateTime created = DateTime.now();
    if (json['createdAt'] != null) {
      created =
          DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now();
    }

    return CommentModel(
      id: json['id']?.toString() ?? '',
      postId: json['postId']?.toString() ?? json['post_id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? json['user_id']?.toString() ?? '',
      authorName: name,
      authorAvatar: avatar,
      content: json['content']?.toString() ?? '',
      createdAt: created,
    );
  }
}
