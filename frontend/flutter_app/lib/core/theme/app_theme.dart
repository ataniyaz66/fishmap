import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app_colors.dart';
import 'app_spacing.dart';
import 'app_typography.dart';

/// Centralized Material 3 Theme setup for the Midnight Ocean aesthetic.
class AppTheme {
  AppTheme._();

  static ThemeData get midnightOcean {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.primaryBackground,
      primaryColor: AppColors.primaryAccent,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primaryAccent,
        onPrimary: Colors.white,
        surface: AppColors.elevatedSurface,
        onSurface: AppColors.primaryText,
        error: AppColors.error,
        onError: Colors.white,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.primaryBackground,
        foregroundColor: AppColors.primaryText,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: AppTypography.titleLarge,
        systemOverlayStyle: SystemUiOverlayStyle.light,
      ),
      cardTheme: const CardThemeData(
        color: AppColors.elevatedSurface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacing.roundedMedium,
          side: BorderSide(color: AppColors.subtleBorder, width: 1.0),
        ),
        margin: EdgeInsets.zero,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: AppColors.primaryBackground,
        selectedItemColor: AppColors.primaryAccent,
        unselectedItemColor: AppColors.secondaryText,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        selectedLabelStyle: TextStyle(
          fontWeight: FontWeight.w600,
          fontSize: 11,
        ),
        unselectedLabelStyle: TextStyle(
          fontWeight: FontWeight.normal,
          fontSize: 11,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.elevatedSurface,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        hintStyle: AppTypography.bodyMedium.copyWith(
          color: AppColors.mutedText,
        ),
        labelStyle: AppTypography.bodyMedium,
        border: OutlineInputBorder(
          borderRadius: AppSpacing.roundedSmall,
          borderSide: const BorderSide(color: AppColors.inputBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: AppSpacing.roundedSmall,
          borderSide: const BorderSide(color: AppColors.inputBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: AppSpacing.roundedSmall,
          borderSide: const BorderSide(
            color: AppColors.primaryAccent,
            width: 1.5,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: AppSpacing.roundedSmall,
          borderSide: const BorderSide(color: AppColors.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: AppSpacing.roundedSmall,
          borderSide: const BorderSide(color: AppColors.error, width: 1.5),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryAccent,
          foregroundColor: Colors.white,
          elevation: 0,
          textStyle: AppTypography.button,
          shape: const RoundedRectangleBorder(
            borderRadius: AppSpacing.roundedSmall,
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primaryAccent,
          side: const BorderSide(color: AppColors.primaryAccent, width: 1.2),
          shape: const RoundedRectangleBorder(
            borderRadius: AppSpacing.roundedSmall,
          ),
          textStyle: AppTypography.button.copyWith(
            color: AppColors.primaryAccent,
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        ),
      ),
      dividerTheme: const DividerThemeData(
        color: AppColors.subtleBorder,
        thickness: 1,
        space: 1,
      ),
      dialogTheme: const DialogThemeData(
        backgroundColor: AppColors.elevatedSurface,
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacing.roundedLarge,
          side: BorderSide(color: AppColors.subtleBorder),
        ),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.elevatedSurface,
        modalBackgroundColor: AppColors.elevatedSurface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(AppSpacing.radiusLarge),
          ),
          side: BorderSide(color: AppColors.subtleBorder),
        ),
      ),
    );
  }
}
