class ConversationModel {
  final String id;
  final String peerId;
  final String peerName;
  final String? lastMessage;
  final DateTime? lastMessageAt;
  final int unreadCount;

  ConversationModel({
    required this.id,
    required this.peerId,
    required this.peerName,
    this.lastMessage,
    this.lastMessageAt,
    this.unreadCount = 0,
  });

  factory ConversationModel.fromJson(
    Map<String, dynamic> json,
    String currentUserId,
  ) {
    String peer = 'Angler';
    String pId = '';

    if (json['peer'] is Map) {
      peer =
          json['peer']['username'] ?? json['peer']['displayName'] ?? 'Angler';
      pId = json['peer']['id']?.toString() ?? '';
    } else if (json['user1Id'] != null && json['user2Id'] != null) {
      pId = json['user1Id'] == currentUserId
          ? json['user2Id']
          : json['user1Id'];
      peer = 'Angler ${pId.substring(0, pId.length > 6 ? 6 : pId.length)}';
    }

    DateTime? lastAt;
    if (json['lastMessageAt'] != null) {
      lastAt = DateTime.tryParse(json['lastMessageAt'].toString());
    } else if (json['updatedAt'] != null) {
      lastAt = DateTime.tryParse(json['updatedAt'].toString());
    }

    return ConversationModel(
      id: json['id']?.toString() ?? '',
      peerId: pId,
      peerName: peer,
      lastMessage: json['lastMessage']?.toString(),
      lastMessageAt: lastAt,
      unreadCount: int.tryParse(json['unreadCount']?.toString() ?? '0') ?? 0,
    );
  }
}
