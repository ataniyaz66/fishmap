import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../state/map_provider.dart';

class CreateSpotDialog extends StatefulWidget {
  final double initialLat;
  final double initialLng;

  const CreateSpotDialog({
    super.key,
    this.initialLat = 51.1694,
    this.initialLng = 71.4491,
  });

  @override
  State<CreateSpotDialog> createState() => _CreateSpotDialogState();
}

class _CreateSpotDialogState extends State<CreateSpotDialog> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _latController;
  late final TextEditingController _lngController;
  late final TextEditingController _descController;
  late final TextEditingController _speciesController;

  String _waterType = 'freshwater';
  bool _isPublic = true;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _latController = TextEditingController(
      text: widget.initialLat.toStringAsFixed(4),
    );
    _lngController = TextEditingController(
      text: widget.initialLng.toStringAsFixed(4),
    );
    _descController = TextEditingController();
    _speciesController = TextEditingController();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _latController.dispose();
    _lngController.dispose();
    _descController.dispose();
    _speciesController.dispose();
    super.dispose();
  }

  void _save() async {
    if (!_formKey.currentState!.validate()) return;

    final lat = double.tryParse(_latController.text) ?? widget.initialLat;
    final lng = double.tryParse(_lngController.text) ?? widget.initialLng;
    final speciesList = _speciesController.text
        .split(',')
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();

    setState(() => _isSaving = true);
    final mapProvider = context.read<MapProvider>();
    final success = await mapProvider.createSpot(
      name: _nameController.text,
      latitude: lat,
      longitude: lng,
      waterType: _waterType,
      targetSpecies: speciesList,
      description: _descController.text.isNotEmpty
          ? _descController.text
          : null,
      isPublic: _isPublic,
    );

    setState(() => _isSaving = false);
    if (success && mounted) {
      Navigator.of(context).pop(true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);

    final popularSpecies = [
      loc.translate('carp_sazan'),
      loc.translate('northern_pike'),
      loc.translate('zander_sudak'),
      loc.translate('perch_okun'),
      loc.translate('crucian_carp'),
      loc.translate('bream_lesh'),
    ];

    return Dialog(
      backgroundColor: AppColors.elevatedSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: AppSpacing.roundedLarge,
      ),
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 500),
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
                      loc.translate('addSpot'),
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
                      ? 'Название водоёма / места'
                      : (loc.languageCode == 'kk'
                          ? 'Су қоймасының / орынның атауы'
                          : 'Spot Name'),
                  hint: loc.languageCode == 'ru'
                      ? 'Например: Ишим, район набережной'
                      : (loc.languageCode == 'kk'
                          ? 'Мысалы: Есіл өзені'
                          : 'e.g. Ishim River Point'),
                  validator: (v) => (v == null || v.trim().isEmpty)
                      ? (loc.languageCode == 'ru'
                          ? 'Введите название точки'
                          : 'Please enter a spot name')
                      : null,
                ),
                const SizedBox(height: AppSpacing.sm),

                Row(
                  children: [
                    Expanded(
                      child: AppTextField(
                        controller: _latController,
                        label: loc.languageCode == 'ru' ? 'Широта' : 'Latitude',
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                          signed: true,
                        ),
                        validator: (v) => double.tryParse(v ?? '') == null
                            ? 'Invalid latitude'
                            : null,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: AppTextField(
                        controller: _lngController,
                        label: loc.languageCode == 'ru' ? 'Долгота' : 'Longitude',
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                          signed: true,
                        ),
                        validator: (v) => double.tryParse(v ?? '') == null
                            ? 'Invalid longitude'
                            : null,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),

                // Water Type selection
                Text(
                  loc.translate('waterType'),
                  style: AppTypography.labelMedium,
                ),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: _waterType,
                  dropdownColor: AppColors.elevatedSurface,
                  style: AppTypography.bodyLarge,
                  decoration: const InputDecoration(
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  items: [
                    DropdownMenuItem(
                      value: 'freshwater',
                      child: Text(loc.translate('freshwater')),
                    ),
                    DropdownMenuItem(
                      value: 'saltwater',
                      child: Text(loc.translate('saltwater')),
                    ),
                    DropdownMenuItem(
                      value: 'brackish',
                      child: Text(loc.translate('brackish')),
                    ),
                  ],
                  onChanged: (val) {
                    if (val != null) setState(() => _waterType = val);
                  },
                ),
                const SizedBox(height: AppSpacing.sm),

                // Target Species
                AppTextField(
                  controller: _speciesController,
                  label: loc.translate('tagSpecies'),
                  hint: 'Сазан, Щука, Судак...',
                ),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: popularSpecies.map((sp) {
                    return ActionChip(
                      label: Text(sp, style: const TextStyle(fontSize: 12)),
                      onPressed: () {
                        final current = _speciesController.text.trim();
                        if (current.isEmpty) {
                          _speciesController.text = sp;
                        } else if (!current.contains(sp)) {
                          _speciesController.text = '$current, $sp';
                        }
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: AppSpacing.sm),

                // Description
                AppTextField(
                  controller: _descController,
                  label: loc.languageCode == 'ru' ? 'Описание точки' : 'Description',
                  hint: loc.languageCode == 'ru'
                      ? 'Глубины, дно, подъезд к воде...'
                      : 'Depths, bottom structure, shore access...',
                  maxLines: 2,
                ),
                const SizedBox(height: AppSpacing.sm),

                // Privacy Switch
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(
                    loc.languageCode == 'ru'
                        ? 'Публичная точка'
                        : (loc.languageCode == 'kk'
                            ? 'Ашық орын'
                            : 'Public Spot'),
                    style: AppTypography.bodyMedium,
                  ),
                  subtitle: Text(
                    loc.languageCode == 'ru'
                        ? 'Видна всем рыболовам сообщества'
                        : (loc.languageCode == 'kk'
                            ? 'Барлық балықшыларға көрінеді'
                            : 'Visible to all anglers on the map'),
                    style: AppTypography.labelSmall,
                  ),
                  value: _isPublic,
                  activeThumbColor: AppColors.primaryAccent,
                  onChanged: (v) => setState(() => _isPublic = v),
                ),
                const SizedBox(height: AppSpacing.lg),

                // Action Buttons
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
                        onPressed: _save,
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
