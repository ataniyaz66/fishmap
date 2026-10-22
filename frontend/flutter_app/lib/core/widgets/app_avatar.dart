import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

class AppAvatar extends StatelessWidget {
  final String? imageUrl;
  final String? name;
  final double radius;

  const AppAvatar({super.key, this.imageUrl, this.name, this.radius = 20});

  String _getInitials(String? text) {
    if (text == null || text.trim().isEmpty) return '?';
    final parts = text.trim().split(RegExp(r'\s+'));
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      return CircleAvatar(
        radius: radius,
        backgroundColor: AppColors.secondarySurface,
        backgroundImage: NetworkImage(imageUrl!),
        onBackgroundImageError: (exception, stackTrace) {},
        child: Text(
          _getInitials(name),
          style: AppTypography.labelMedium.copyWith(
            color: AppColors.primaryText,
          ),
        ),
      );
    }

    return CircleAvatar(
      radius: radius,
      backgroundColor: AppColors.secondarySurface,
      child: Text(
        _getInitials(name),
        style: AppTypography.labelMedium.copyWith(
          color: AppColors.primaryAccent,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
