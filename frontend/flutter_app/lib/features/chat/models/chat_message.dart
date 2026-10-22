class ChatMessage {
  final String id;
  final String conversationId;
  final String senderId;
  final String content;
  final bool isRead;
  final DateTime createdAt;

  ChatMessage({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.content,
    this.isRead = false,
    required this.createdAt,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    DateTime created = DateTime.now();
    if (json['createdAt'] != null) {
      created =
          DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now();
    }

    return ChatMessage(
      id: json['id']?.toString() ?? '',
      conversationId:
          json['conversationId']?.toString() ??
          json['conversation_id']?.toString() ??
          '',
      senderId:
          json['senderId']?.toString() ?? json['sender_id']?.toString() ?? '',
      content: json['content']?.toString() ?? '',
      isRead: json['isRead'] == true || json['is_read'] == true,
      createdAt: created,
    );
  }
}
