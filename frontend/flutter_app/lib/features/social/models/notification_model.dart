class NotificationModel {
  final String id;
  final String userId;
  final String actorId;
  final String type; // 'friend_request', 'friend_accept', 'like', 'comment'
  final String? entityId;
  final bool read;
  final DateTime createdAt;

  const NotificationModel({
    required this.id,
    required this.userId,
    required this.actorId,
    required this.type,
    this.entityId,
    required this.read,
    required this.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? json['user_id']?.toString() ?? '',
      actorId:
          json['actorId']?.toString() ?? json['actor_id']?.toString() ?? '',
      type: json['type']?.toString() ?? 'notification',
      entityId:
          json['entityId']?.toString() ?? json['entity_id']?.toString(),
      read: json['read'] == true,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : (json['created_at'] != null
              ? DateTime.tryParse(json['created_at'].toString()) ??
                  DateTime.now()
              : DateTime.now()),
    );
  }

  NotificationModel copyWith({bool? read}) {
    return NotificationModel(
      id: id,
      userId: userId,
      actorId: actorId,
      type: type,
      entityId: entityId,
      read: read ?? this.read,
      createdAt: createdAt,
    );
  }
}
