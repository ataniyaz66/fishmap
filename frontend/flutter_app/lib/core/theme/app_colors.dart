import 'package:flutter/material.dart';

/// Semantic color palette for FishMap: Midnight Ocean
class AppColors {
  AppColors._();

  // Core Backgrounds & Surfaces
  static const Color primaryBackground = Color(0xFF101827);
  static const Color elevatedSurface = Color(0xFF1B2940);
  static const Color secondarySurface = Color(0xFF22324A);

  // Accent & Interactive
  static const Color primaryAccent = Color(0xFF4D8DFF);
  static const Color accentPressed = Color(0xFF3675E8);
  static const Color accentSubtle = Color(0x1F4D8DFF);

  // Convenient Aliases
  static const Color primary = primaryAccent;
  static const Color accent = primaryAccent;
  static const Color cardBackground = elevatedSurface;
  static const Color surface = secondarySurface;
  static const Color textSecondary = secondaryText;
  static const Color textMuted = mutedText;

  // Typography
  static const Color primaryText = Color(0xFFEAF0F8);
  static const Color secondaryText = Color(0xFF8393AA);
  static const Color mutedText = Color(0xFF5D6F88);

  // Borders & Dividers
  static const Color subtleBorder = Color(0xFF30415A);
  static const Color inputBorder = Color(0xFF2A3D59);

  // Status & Semantic Feedback
  static const Color success = Color(0xFF35B887);
  static const Color warning = Color(0xFFF2B95F);
  static const Color error = Color(0xFFF07878);

  // Card & Element Gradients
  static const LinearGradient cardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF1F2F48), Color(0xFF172437)],
  );

  static const LinearGradient accentGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF5B97FF), Color(0xFF3B7CE8)],
  );
}
