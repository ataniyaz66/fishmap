class UserProfile {
  final String id;
  final String userId;
  final String? displayName;
  final String? bio;
  final String? avatarUrl;
  final String? location;
  final String experienceLevel;
  final List<String> favoriteSpecies;

  UserProfile({
    required this.id,
    required this.userId,
    this.displayName,
    this.bio,
    this.avatarUrl,
    this.location,
    this.experienceLevel = 'intermediate',
    this.favoriteSpecies = const [],
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    final prof = json['data'] is Map<String, dynamic>
        ? json['data'] as Map<String, dynamic>
        : (json['profile'] is Map<String, dynamic>
              ? json['profile'] as Map<String, dynamic>
              : json);

    List<String> favs = [];
    if (prof['favoriteSpecies'] is List) {
      favs = (prof['favoriteSpecies'] as List)
          .map((e) => e.toString())
          .toList();
    } else if (prof['favorite_species'] is List) {
      favs = (prof['favorite_species'] as List)
          .map((e) => e.toString())
          .toList();
    }

    return UserProfile(
      id: prof['id']?.toString() ?? '',
      userId:
          prof['userId']?.toString() ??
          prof['user_id']?.toString() ??
          prof['authUserId']?.toString() ??
          prof['auth_user_id']?.toString() ??
          '',
      displayName:
          prof['displayName']?.toString() ?? prof['display_name']?.toString(),
      bio: prof['bio']?.toString(),
      avatarUrl:
          prof['avatarUrl']?.toString() ?? prof['avatar_url']?.toString(),
      location: prof['location']?.toString(),
      experienceLevel:
          prof['experienceLevel']?.toString() ??
          prof['experience_level']?.toString() ??
          'intermediate',
      favoriteSpecies: favs,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (displayName != null) 'displayName': displayName,
      if (bio != null) 'bio': bio,
      if (avatarUrl != null) 'avatarUrl': avatarUrl,
      if (location != null) 'location': location,
      'experienceLevel': experienceLevel,
      'favoriteSpecies': favoriteSpecies,
    };
  }

  UserProfile copyWith({
    String? displayName,
    String? bio,
    String? avatarUrl,
    String? location,
    String? experienceLevel,
    List<String>? favoriteSpecies,
  }) {
    return UserProfile(
      id: id,
      userId: userId,
      displayName: displayName ?? this.displayName,
      bio: bio ?? this.bio,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      location: location ?? this.location,
      experienceLevel: experienceLevel ?? this.experienceLevel,
      favoriteSpecies: favoriteSpecies ?? this.favoriteSpecies,
    );
  }
}
