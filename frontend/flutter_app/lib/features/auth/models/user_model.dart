class UserModel {
  final String id;
  final String email;
  final String username;
  final String role;
  final String status;
  final bool isEmailVerified;
  final DateTime? createdAt;

  UserModel({
    required this.id,
    required this.email,
    required this.username,
    this.role = 'user',
    this.status = 'active',
    this.isEmailVerified = false,
    this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      username: json['username']?.toString() ?? '',
      role: json['role']?.toString() ?? 'user',
      status: json['status']?.toString() ?? 'active',
      isEmailVerified: json['isEmailVerified'] == true,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'role': role,
      'status': status,
      'isEmailVerified': isEmailVerified,
      'createdAt': createdAt?.toIso8601String(),
    };
  }
}
