import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../state/inventory_provider.dart';

class AddInventoryItemDialog extends StatefulWidget {
  final String initialCategory;

  const AddInventoryItemDialog({super.key, this.initialCategory = 'lure'});

  @override
  State<AddInventoryItemDialog> createState() => _AddInventoryItemDialogState();
}

class _AddInventoryItemDialogState extends State<AddInventoryItemDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _brandController = TextEditingController();
  final _colorController = TextEditingController();
  final _weightController = TextEditingController();

  late String _category;
  int _quantity = 1;
  final String _visibility = 'private';
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _category = widget.initialCategory;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _brandController.dispose();
    _colorController.dispose();
    _weightController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final weight = double.tryParse(_weightController.text);

    setState(() => _isSaving = true);
    final provider = context.read<InventoryProvider>();
    final success = await provider.addItem(
      name: _nameController.text,
      category: _category,
      brand: _brandController.text.isNotEmpty ? _brandController.text : null,
      color: _colorController.text.isNotEmpty ? _colorController.text : null,
      weight: weight,
      quantity: _quantity,
      visibility: _visibility,
    );

    setState(() => _isSaving = false);
    if (success && mounted) {
      Navigator.of(context).pop(true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    final categories = [
      {'value': 'lure', 'label': loc.translate('cat_lure')},
      {'value': 'soft_plastic', 'label': loc.translate('cat_soft_plastic')},
      {'value': 'rod', 'label': loc.translate('cat_rod')},
      {'value': 'reel', 'label': loc.translate('cat_reel')},
      {'value': 'line', 'label': loc.translate('cat_line')},
      {
        'value': 'terminal_tackle',
        'label': loc.translate('cat_terminal_tackle'),
      },
      {'value': 'accessory', 'label': loc.translate('cat_accessory')},
    ];

    return Dialog(
      backgroundColor: AppColors.elevatedSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: AppSpacing.roundedLarge,
      ),
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 480),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      loc.translate('addTackle'),
                      style: AppTypography.titleLarge,
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.close,
                        color: AppColors.secondaryText,
                      ),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

                AppTextField(
                  controller: _nameController,
                  label: loc.languageCode == 'ru'
                      ? 'Название снасти'
                      : 'Item Name',
                  hint: 'Pontoon 21, Shimano, Mepps...',
                  validator: (v) => (v == null || v.trim().isEmpty)
                      ? (loc.languageCode == 'ru'
                          ? 'Введите название снасти'
                          : 'Please enter item name')
                      : null,
                ),
                const SizedBox(height: AppSpacing.sm),

                Text(
                  loc.languageCode == 'ru' ? 'Категория' : 'Category',
                  style: AppTypography.labelMedium,
                ),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: _category,
                  dropdownColor: AppColors.elevatedSurface,
                  style: AppTypography.bodyLarge,
                  decoration: const InputDecoration(
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  items: categories.map((cat) {
                    return DropdownMenuItem<String>(
                      value: cat['value'],
                      child: Text(cat['label']!),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _category = val);
                  },
                ),
                const SizedBox(height: AppSpacing.sm),

                Row(
                  children: [
                    Expanded(
                      child: AppTextField(
                        controller: _brandController,
                        label: loc.languageCode == 'ru' ? 'Бренд' : 'Brand',
                        hint: 'Daiwa, Shimano, Mepps...',
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: AppTextField(
                        controller: _colorController,
                        label: loc.languageCode == 'ru' ? 'Цвет' : 'Color',
                        hint: 'Silver, Gold, Firetiger...',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),

                Row(
                  children: [
                    Expanded(
                      child: AppTextField(
                        controller: _weightController,
                        label: loc.languageCode == 'ru'
                            ? 'Вес / Тест (г)'
                            : 'Weight (g)',
                        hint: '14.5',
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            loc.languageCode == 'ru'
                                ? 'Количество'
                                : 'Quantity',
                            style: AppTypography.labelMedium,
                          ),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              IconButton(
                                icon: const Icon(Icons.remove_circle_outline),
                                onPressed: _quantity > 1
                                    ? () => setState(() => _quantity--)
                                    : null,
                              ),
                              Text(
                                '$_quantity',
                                style: AppTypography.titleMedium,
                              ),
                              IconButton(
                                icon: const Icon(Icons.add_circle_outline),
                                onPressed: () => setState(() => _quantity++),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.lg),

                Row(
                  children: [
                    Expanded(
                      child: AppButton(
                        text: loc.translate('cancel'),
                        variant: AppButtonVariant.ghost,
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: AppButton(
                        text: loc.translate('save'),
                        isLoading: _isSaving,
                        onPressed: _submit,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
