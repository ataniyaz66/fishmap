import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.primaryBackground,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.water, size: 64, color: AppColors.primaryAccent),
            SizedBox(height: 24),
            Text('FishMap', style: AppTypography.displayLarge),
            SizedBox(height: 8),
            Text('Intelligent Angler Network', style: AppTypography.bodyMedium),
            SizedBox(height: 48),
            SizedBox(
              width: 28,
              height: 28,
              child: CircularProgressIndicator(
                strokeWidth: 2.5,
                valueColor: AlwaysStoppedAnimation<Color>(
                  AppColors.primaryAccent,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
