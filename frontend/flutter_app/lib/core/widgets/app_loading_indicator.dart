import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

class AppLoadingIndicator extends StatelessWidget {
  final String? message;

  const AppLoadingIndicator({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(
            height: 32,
            width: 32,
            child: CircularProgressIndicator(
              strokeWidth: 2.5,
              valueColor: AlwaysStoppedAnimation<Color>(
                AppColors.primaryAccent,
              ),
            ),
          ),
          if (message != null) ...[
            const SizedBox(height: 16),
            Text(message!, style: AppTypography.bodyMedium),
          ],
        ],
      ),
    );
  }
}
