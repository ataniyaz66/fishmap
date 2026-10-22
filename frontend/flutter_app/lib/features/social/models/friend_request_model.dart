class FriendRequestModel {
  final String id;
  final String requesterId;
  final String addresseeId;
  final String status; // 'pending', 'accepted', 'declined'
  final DateTime createdAt;

  const FriendRequestModel({
    required this.id,
    required this.requesterId,
    required this.addresseeId,
    required this.status,
    required this.createdAt,
  });

  factory FriendRequestModel.fromJson(Map<String, dynamic> json) {
    return FriendRequestModel(
      id: json['id']?.toString() ?? '',
      requesterId: json['requesterId']?.toString() ??
          json['requester_id']?.toString() ??
          '',
      addresseeId: json['addresseeId']?.toString() ??
          json['addressee_id']?.toString() ??
          '',
      status: json['status']?.toString() ?? 'pending',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
          : (json['created_at'] != null
              ? DateTime.tryParse(json['created_at'].toString()) ??
                  DateTime.now()
              : DateTime.now()),
    );
  }
}
