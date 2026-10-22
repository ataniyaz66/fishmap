import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Semantic typography scale for FishMap.
class AppTypography {
  AppTypography._();

  static const TextStyle displayLarge = TextStyle(
    fontSize: 28.0,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
    color: AppColors.primaryText,
  );

  static const TextStyle headlineMedium = TextStyle(
    fontSize: 22.0,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.3,
    color: AppColors.primaryText,
  );

  static const TextStyle titleLarge = TextStyle(
    fontSize: 18.0,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.2,
    color: AppColors.primaryText,
  );

  static const TextStyle titleMedium = TextStyle(
    fontSize: 16.0,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.1,
    color: AppColors.primaryText,
  );

  static const TextStyle bodyLarge = TextStyle(
    fontSize: 15.0,
    fontWeight: FontWeight.normal,
    letterSpacing: 0.1,
    color: AppColors.primaryText,
    height: 1.4,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14.0,
    fontWeight: FontWeight.normal,
    letterSpacing: 0.1,
    color: AppColors.secondaryText,
    height: 1.4,
  );

  static const TextStyle labelMedium = TextStyle(
    fontSize: 13.0,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.2,
    color: AppColors.secondaryText,
  );

  static const TextStyle labelSmall = TextStyle(
    fontSize: 11.0,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.3,
    color: AppColors.mutedText,
  );

  static const TextStyle button = TextStyle(
    fontSize: 15.0,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.2,
    color: Colors.white,
  );
}
