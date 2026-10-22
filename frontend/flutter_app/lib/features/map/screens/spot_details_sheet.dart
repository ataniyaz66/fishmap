import 'package:flutter/material.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_button.dart';
import '../../fishing/data/fish_catalog.dart';
import '../models/fishing_spot.dart';

class SpotDetailsSheet extends StatelessWidget {
  final FishingSpot spot;
  final VoidCallback? onAddCatch;

  const SpotDetailsSheet({super.key, required this.spot, this.onAddCatch});

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: const BoxDecoration(
        color: AppColors.elevatedSurface,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppSpacing.radiusLarge),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: AppSpacing.md),
              decoration: BoxDecoration(
                color: AppColors.subtleBorder,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Title & badges
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(spot.name, style: AppTypography.titleLarge),
                    const SizedBox(height: 4),
                    Text(
                      '${spot.latitude.toStringAsFixed(4)}, ${spot.longitude.toStringAsFixed(4)}',
                      style: AppTypography.labelSmall,
                    ),
                  ],
                ),
              ),
              AppBadge(
                label: spot.waterType.toUpperCase(),
                color: spot.waterType == 'saltwater'
                    ? Colors.teal
                    : AppColors.primaryAccent,
                icon: Icons.water,
              ),
            ],
          ),

          const SizedBox(height: AppSpacing.md),

          // Description if present
          if (spot.description != null && spot.description!.isNotEmpty) ...[
            Text(spot.description!, style: AppTypography.bodyMedium),
            const SizedBox(height: AppSpacing.md),
          ],

          // Target species
          if (spot.targetSpecies.isNotEmpty) ...[
            Text(
              loc.languageCode == 'ru'
                  ? 'Водящиеся виды рыб'
                  : (loc.languageCode == 'kk'
                      ? 'Мекендейтін балықтар'
                      : 'Target Species'),
              style: AppTypography.labelMedium,
            ),
            const SizedBox(height: 6),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: spot.targetSpecies.map((sp) {
                final displaySp = FishCatalog.getDisplayName(sp, loc.languageCode);
                return AppBadge(
                  label: displaySp,
                  color: AppColors.secondarySurface,
                  textColor: AppColors.primaryText,
                );
              }).toList(),
            ),
            const SizedBox(height: AppSpacing.lg),
          ],

          // Action row
          Row(
            children: [
              Expanded(
                child: AppButton(
                  text: loc.translate('logCatch'),
                  icon: Icons.phishing,
                  onPressed: () {
                    Navigator.of(context).pop();
                    if (onAddCatch != null) onAddCatch!();
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
