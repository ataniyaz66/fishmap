import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';

enum AppButtonVariant { primary, secondary, outline, danger, ghost }

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final AppButtonVariant variant;
  final IconData? icon;
  final double? width;

  const AppButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isLoading = false,
    this.variant = AppButtonVariant.primary,
    this.icon,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color fgColor;
    BorderSide borderSide = BorderSide.none;

    switch (variant) {
      case AppButtonVariant.primary:
        bgColor = AppColors.primaryAccent;
        fgColor = Colors.white;
        break;
      case AppButtonVariant.secondary:
        bgColor = AppColors.elevatedSurface;
        fgColor = AppColors.primaryText;
        borderSide = const BorderSide(color: AppColors.subtleBorder);
        break;
      case AppButtonVariant.outline:
        bgColor = Colors.transparent;
        fgColor = AppColors.primaryAccent;
        borderSide = const BorderSide(
          color: AppColors.primaryAccent,
          width: 1.2,
        );
        break;
      case AppButtonVariant.danger:
        bgColor = AppColors.error;
        fgColor = Colors.white;
        break;
      case AppButtonVariant.ghost:
        bgColor = Colors.transparent;
        fgColor = AppColors.secondaryText;
        break;
    }

    final child = isLoading
        ? SizedBox(
            height: 20,
            width: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(fgColor),
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 18, color: fgColor),
                const SizedBox(width: AppSpacing.xs),
              ],
              Text(text, style: AppTypography.button.copyWith(color: fgColor)),
            ],
          );

    return SizedBox(
      width: width,
      height: 48,
      child: Material(
        color: bgColor,
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacing.roundedSmall,
          side: borderSide,
        ),
        child: InkWell(
          onTap: isLoading ? null : onPressed,
          borderRadius: AppSpacing.roundedSmall,
          splashColor: AppColors.accentPressed.withValues(alpha: 0.3),
          child: Center(child: child),
        ),
      ),
    );
  }
}
