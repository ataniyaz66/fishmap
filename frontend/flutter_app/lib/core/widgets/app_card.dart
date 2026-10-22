import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;
  final Color? color;
  final Border? border;

  const AppCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(AppSpacing.md),
    this.onTap,
    this.color,
    this.border,
  });

  @override
  Widget build(BuildContext context) {
    final cardContent = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: color ?? AppColors.elevatedSurface,
        borderRadius: AppSpacing.roundedMedium,
        border: border ?? Border.all(color: AppColors.subtleBorder, width: 1.0),
      ),
      child: child,
    );

    if (onTap != null) {
      return Material(
        color: Colors.transparent,
        borderRadius: AppSpacing.roundedMedium,
        child: InkWell(
          onTap: onTap,
          borderRadius: AppSpacing.roundedMedium,
          child: cardContent,
        ),
      );
    }

    return cardContent;
  }
}
