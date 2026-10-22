import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';

class AppBadge extends StatelessWidget {
  final String label;
  final Color? color;
  final Color? textColor;
  final IconData? icon;

  const AppBadge({
    super.key,
    required this.label,
    this.color,
    this.textColor,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? AppColors.primaryAccent;
    final effectiveTextColor = textColor ?? effectiveColor;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: effectiveColor.withValues(alpha: 0.15),
        borderRadius: AppSpacing.roundedSmall,
        border: Border.all(
          color: effectiveColor.withValues(alpha: 0.3),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 12, color: effectiveTextColor),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: AppTypography.labelSmall.copyWith(
              color: effectiveTextColor,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
