import 'package:flutter/material.dart';
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
import '../models/inventory_item.dart';
import '../state/inventory_provider.dart';
import 'add_inventory_item_dialog.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key});

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<InventoryProvider>().fetchItems();
    });
  }

  void _openAddItemDialog() {
    showDialog(
      context: context,
      builder: (_) => const AddInventoryItemDialog(),
    );
  }

  void _confirmDelete(AppLocalizations loc, InventoryItem item) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.elevatedSurface,
        title: Text(loc.translate('delete'), style: AppTypography.titleLarge),
        content: Text(
          loc.languageCode == 'ru'
              ? 'Вы уверены, что хотите удалить "${item.name}" из коробки со снастями?'
              : 'Are you sure you want to remove "${item.name}" from your tackle box?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text(
              loc.translate('cancel'),
              style: const TextStyle(color: AppColors.secondaryText),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              context.read<InventoryProvider>().deleteItem(item.id);
            },
            child: Text(
              loc.translate('delete'),
              style: const TextStyle(color: AppColors.error),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final inventory = context.watch<InventoryProvider>();
    final items = inventory.items;

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        title: Text(loc.translate('tackleInventory')),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.primaryText),
            tooltip: 'Refresh Tackle',
            onPressed: () => inventory.fetchItems(),
          ),
        ],
      ),
      body: Column(
        children: [
          // Category horizontal scroll
          Container(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  _buildCategoryChip(
                    loc.languageCode == 'ru'
                        ? 'Все'
                        : (loc.languageCode == 'kk' ? 'Бәрі' : 'All'),
                    'all',
                    inventory,
                  ),
                  const SizedBox(width: 8),
                  _buildCategoryChip(
                    loc.translate('cat_lure'),
                    'lure',
                    inventory,
                  ),
                  const SizedBox(width: 8),
                  _buildCategoryChip(
                    loc.translate('cat_soft_plastic'),
                    'soft_plastic',
                    inventory,
                  ),
                  const SizedBox(width: 8),
                  _buildCategoryChip(
                    loc.translate('cat_rod'),
                    'rod',
                    inventory,
                  ),
                  const SizedBox(width: 8),
                  _buildCategoryChip(
                    loc.translate('cat_reel'),
                    'reel',
                    inventory,
                  ),
                  const SizedBox(width: 8),
                  _buildCategoryChip(
                    loc.translate('cat_line'),
                    'line',
                    inventory,
                  ),
                  const SizedBox(width: 8),
                  _buildCategoryChip(
                    loc.translate('cat_terminal_tackle'),
                    'terminal_tackle',
                    inventory,
                  ),
                ],
              ),
            ),
          ),

          Expanded(
            child: inventory.isLoading && items.isEmpty
                ? const AppLoadingIndicator(
                    message: 'Loading tackle inventory...',
                  )
                : inventory.errorMessage != null && items.isEmpty
                ? AppErrorView(
                    message: inventory.errorMessage!,
                    onRetry: () => inventory.fetchItems(),
                  )
                : items.isEmpty
                ? AppEmptyState(
                    icon: Icons.inventory_2_outlined,
                    title: loc.languageCode == 'ru'
                        ? 'Коробка со снастями пуста'
                        : (loc.languageCode == 'kk'
                            ? 'Құралдар қорабы бос'
                            : 'Tackle box is empty'),
                    description: loc.languageCode == 'ru'
                        ? 'Добавьте приманки, удилища и катушки для умного ИИ-подбора снастей!'
                        : 'Add your favorite lures, rods, and reels to get AI gear recommendations!',
                    actionText: loc.translate('addTackle'),
                    onAction: _openAddItemDialog,
                  )
                : RefreshIndicator(
                    onRefresh: () => inventory.fetchItems(),
                    color: AppColors.primaryAccent,
                    backgroundColor: AppColors.elevatedSurface,
                    child: ListView.separated(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      itemCount: items.length,
                      separatorBuilder: (context, index) =>
                          const SizedBox(height: AppSpacing.sm),
                      itemBuilder: (context, index) {
                        return _buildItemCard(loc, items[index], inventory);
                      },
                    ),
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primaryAccent,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: Text(loc.translate('addTackle')),
        onPressed: _openAddItemDialog,
      ),
    );
  }

  Widget _buildCategoryChip(
    String label,
    String value,
    InventoryProvider provider,
  ) {
    final isSelected = provider.categoryFilter == value;
    return GestureDetector(
      onTap: () => provider.setCategoryFilter(value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primaryAccent
              : AppColors.elevatedSurface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? AppColors.primaryAccent
                : AppColors.subtleBorder,
          ),
        ),
        child: Text(
          label,
          style: AppTypography.labelMedium.copyWith(
            color: isSelected ? Colors.white : AppColors.primaryText,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _buildItemCard(
    AppLocalizations loc,
    InventoryItem item,
    InventoryProvider provider,
  ) {
    IconData icon;
    Color iconColor;

    switch (item.category.toLowerCase()) {
      case 'rod':
        icon = Icons.straighten;
        iconColor = Colors.orange;
        break;
      case 'reel':
        icon = Icons.refresh;
        iconColor = Colors.amber;
        break;
      case 'line':
        icon = Icons.timeline;
        iconColor = Colors.lightBlue;
        break;
      case 'soft_plastic':
        icon = Icons.bubble_chart;
        iconColor = Colors.lightGreen;
        break;
      case 'terminal_tackle':
        icon = Icons.anchor;
        iconColor = Colors.purple;
        break;
      default:
        icon = Icons.phishing;
        iconColor = AppColors.primaryAccent;
    }

    return AppCard(
      child: ListTile(
        contentPadding: EdgeInsets.zero,
        leading: CircleAvatar(
          backgroundColor: iconColor.withValues(alpha: 0.2),
          child: Icon(icon, color: iconColor),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                item.name,
                style: AppTypography.titleMedium,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (item.quantity > 1)
              AppBadge(
                label: 'x${item.quantity}',
                color: AppColors.secondarySurface,
                textColor: AppColors.primaryText,
              ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Row(
              children: [
                if (item.brand != null && item.brand!.isNotEmpty) ...[
                  Text(item.brand!, style: AppTypography.labelSmall),
                  const SizedBox(width: 8),
                ],
                if (item.weight != null) ...[
                  Text('${item.weight}g', style: AppTypography.labelSmall),
                  const SizedBox(width: 8),
                ],
                if (item.color != null && item.color!.isNotEmpty)
                  Text(item.color!, style: AppTypography.labelSmall),
              ],
            ),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(
            Icons.delete_outline,
            color: AppColors.secondaryText,
            size: 20,
          ),
          onPressed: () => _confirmDelete(loc, item),
        ),
      ),
    );
  }
}
