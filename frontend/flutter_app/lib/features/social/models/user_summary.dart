class UserSummary {
  final String id;
  final String authUserId;
  final String displayName;
  final String? avatarUrl;
  final String? bio;
  final String? location;
  final String relationshipStatus; // 'none', 'friends', 'pending_sent', 'pending_received', 'self'

  const UserSummary({
    required this.id,
    required this.authUserId,
    required this.displayName,
    this.avatarUrl,
    this.bio,
    this.location,
    this.relationshipStatus = 'none',
  });

  factory UserSummary.fromJson(Map<String, dynamic> json) {
    return UserSummary(
      id: json['id']?.toString() ?? '',
      authUserId: json['authUserId']?.toString() ??
          json['auth_user_id']?.toString() ??
          json['id']?.toString() ??
          '',
      displayName: json['displayName']?.toString() ??
          json['display_name']?.toString() ??
          json['username']?.toString() ??
          'Angler',
      avatarUrl:
          json['avatarUrl']?.toString() ?? json['avatar_url']?.toString(),
      bio: json['bio']?.toString(),
      location: json['location']?.toString(),
      relationshipStatus: json['relationshipStatus']?.toString() ??
          json['relationship_status']?.toString() ??
          'none',
    );
  }

  UserSummary copyWith({
    String? displayName,
    String? avatarUrl,
    String? bio,
    String? location,
    String? relationshipStatus,
  }) {
    return UserSummary(
      id: id,
      authUserId: authUserId,
      displayName: displayName ?? this.displayName,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      bio: bio ?? this.bio,
      location: location ?? this.location,
      relationshipStatus: relationshipStatus ?? this.relationshipStatus,
    );
  }
}
