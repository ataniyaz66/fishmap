import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_empty_state.dart';
import '../../../core/widgets/app_error_view.dart';
import '../../../core/widgets/app_loading_indicator.dart';
import '../../fishing/data/fish_catalog.dart';
import '../models/catch_model.dart';
import '../state/journal_provider.dart';
import 'record_catch_screen.dart';

class JournalScreen extends StatefulWidget {
  const JournalScreen({super.key});

  @override
  State<JournalScreen> createState() => _JournalScreenState();
}

class _JournalScreenState extends State<JournalScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<JournalProvider>().fetchCatches();
    });
  }

  void _openRecordCatch() {
    Navigator.of(
      context,
    ).push(MaterialPageRoute(builder: (_) => const RecordCatchScreen()));
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final journal = context.watch<JournalProvider>();
    final catches = journal.catches;

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        title: Text(loc.translate('journal')),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.primaryText),
            tooltip: 'Refresh Catches',
            onPressed: () => journal.fetchCatches(),
          ),
        ],
      ),
      body: journal.isLoading && catches.isEmpty
          ? const AppLoadingIndicator(message: 'Loading catch journal...')
          : journal.errorMessage != null && catches.isEmpty
          ? AppErrorView(
              message: journal.errorMessage!,
              onRetry: () => journal.fetchCatches(),
            )
          : catches.isEmpty
          ? AppEmptyState(
              icon: Icons.phishing_outlined,
              title: loc.languageCode == 'ru'
                  ? 'Уловы пока не записаны'
                  : (loc.languageCode == 'kk'
                      ? 'Олжалар әзірге жазылмаған'
                      : 'No catches recorded yet'),
              description: loc.languageCode == 'ru'
                  ? 'Записывайте свои рыболовные победы, трофеи и снасти в личный журнал!'
                  : 'Start logging your fishing adventures, lures, and personal bests!',
              actionText: loc.translate('logCatch'),
              onAction: _openRecordCatch,
            )
          : RefreshIndicator(
              onRefresh: () => journal.fetchCatches(),
              color: AppColors.primaryAccent,
              backgroundColor: AppColors.elevatedSurface,
              child: ListView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                children: [
                  // Statistics Banner
                  _buildStatsBanner(loc, journal),
                  const SizedBox(height: AppSpacing.md),

                  Text(
                    loc.translate('recentCatches'),
                    style: AppTypography.titleMedium,
                  ),
                  const SizedBox(height: AppSpacing.sm),

                  // Catch Cards
                  ...catches.map((c) => _buildCatchCard(loc, c)),
                  const SizedBox(height: 80),
                ],
              ),
            ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primaryAccent,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: Text(loc.translate('logCatch')),
        onPressed: _openRecordCatch,
      ),
    );
  }

  Widget _buildStatsBanner(AppLocalizations loc, JournalProvider journal) {
    return AppCard(
      color: AppColors.elevatedSurface,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem(
            label: loc.translate('catchesCount'),
            value: journal.totalCatches.toString(),
            icon: Icons.inventory_2_outlined,
          ),
          Container(height: 36, width: 1, color: AppColors.subtleBorder),
          _buildStatItem(
            label: loc.languageCode == 'ru'
                ? 'Рекорд'
                : (loc.languageCode == 'kk' ? 'Рекорд' : 'Max Weight'),
            value: journal.maxWeight > 0
                ? '${journal.maxWeight.toStringAsFixed(1)} kg'
                : '—',
            icon: Icons.scale_outlined,
          ),
          Container(height: 36, width: 1, color: AppColors.subtleBorder),
          _buildStatItem(
            label: loc.languageCode == 'ru'
                ? 'Главный вид'
                : (loc.languageCode == 'kk' ? 'Басты балық' : 'Top Species'),
            value: journal.catches.isNotEmpty
                ? FishCatalog.getDisplayName(
                    journal.catches.first.species,
                    loc.languageCode,
                  )
                : '—',
            icon: Icons.water_outlined,
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem({
    required String label,
    required String value,
    required IconData icon,
  }) {
    return Column(
      children: [
        Icon(icon, size: 20, color: AppColors.primaryAccent),
        const SizedBox(height: 4),
        Text(
          value,
          style: AppTypography.titleMedium.copyWith(
            color: AppColors.primaryText,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        Text(label, style: AppTypography.labelSmall),
      ],
    );
  }

  Widget _buildCatchCard(AppLocalizations loc, CatchModel c) {
    final speciesDisplay =
        FishCatalog.getDisplayName(c.species, loc.languageCode);

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: AppCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with species and date
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(speciesDisplay, style: AppTypography.titleMedium),
                ),
                Text(
                  DateFormat('dd.MM.yyyy').format(c.caughtAt),
                  style: AppTypography.labelSmall,
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Measurements and Lure Pills
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: [
                if (c.weight != null)
                  AppBadge(
                    label: '${c.weight!.toStringAsFixed(1)} kg',
                    icon: Icons.scale,
                    color: AppColors.primaryAccent,
                  ),
                if (c.length != null)
                  AppBadge(
                    label: '${c.length!.toStringAsFixed(1)} cm',
                    icon: Icons.straighten,
                    color: Colors.cyan,
                  ),
                if (c.lure != null && c.lure!.isNotEmpty)
                  AppBadge(
                    label: c.lure!,
                    icon: Icons.phishing,
                    color: Colors.amber,
                  ),
                if (c.spotName != null && c.spotName!.isNotEmpty)
                  AppBadge(
                    label: c.spotName!,
                    icon: Icons.location_on,
                    color: AppColors.secondarySurface,
                    textColor: AppColors.primaryText,
                  ),
              ],
            ),

            if (c.notes != null && c.notes!.isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(
                c.notes!,
                style: AppTypography.bodyMedium,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
