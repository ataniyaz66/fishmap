import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../fishing/data/fish_catalog.dart';
import '../../map/state/map_provider.dart';
import '../state/journal_provider.dart';

class RecordCatchScreen extends StatefulWidget {
  final String? initialSpotId;

  const RecordCatchScreen({super.key, this.initialSpotId});

  @override
  State<RecordCatchScreen> createState() => _RecordCatchScreenState();
}

class _RecordCatchScreenState extends State<RecordCatchScreen> {
  final _formKey = GlobalKey<FormState>();
  final _speciesController = TextEditingController();
  final _weightController = TextEditingController();
  final _lengthController = TextEditingController();
  final _lureController = TextEditingController();
  final _notesController = TextEditingController();

  DateTime _caughtAt = DateTime.now();
  String? _selectedSpotId;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _selectedSpotId = widget.initialSpotId;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final mapProvider = context.read<MapProvider>();
      if (mapProvider.spots.isEmpty) {
        mapProvider.fetchSpots();
      } else if (_selectedSpotId == null) {
        setState(() {
          _selectedSpotId = mapProvider.spots.first.id;
        });
      }
    });
  }

  @override
  void dispose() {
    _speciesController.dispose();
    _weightController.dispose();
    _lengthController.dispose();
    _lureController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _selectDate() async {
    final pickedDate = await showDatePicker(
      context: context,
      initialDate: _caughtAt,
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.dark(
              primary: AppColors.primaryAccent,
              surface: AppColors.elevatedSurface,
            ),
          ),
          child: child!,
        );
      },
    );

    if (pickedDate != null) {
      setState(() {
        _caughtAt = DateTime(
          pickedDate.year,
          pickedDate.month,
          pickedDate.day,
          _caughtAt.hour,
          _caughtAt.minute,
        );
      });
    }
  }

  void _submit(AppLocalizations loc) async {
    if (!_formKey.currentState!.validate()) return;

    final mapProvider = context.read<MapProvider>();
    final effectiveSpotId =
        _selectedSpotId ??
        (mapProvider.spots.isNotEmpty ? mapProvider.spots.first.id : null);

    if (effectiveSpotId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            loc.languageCode == 'ru'
                ? 'Пожалуйста, выберите или создайте точку ловли на карте'
                : (loc.languageCode == 'kk'
                    ? 'Алдымен картада балық аулау орнын таңдаңыз немесе қосыңыз'
                    : 'Please select or create a fishing spot first'),
          ),
        ),
      );
      return;
    }

    final weight = double.tryParse(_weightController.text);
    final length = double.tryParse(_lengthController.text);

    setState(() => _isSaving = true);
    final journalProvider = context.read<JournalProvider>();
    final success = await journalProvider.recordCatch(
      species: _speciesController.text,
      spotId: effectiveSpotId,
      weight: weight,
      length: length,
      lure: _lureController.text.isNotEmpty ? _lureController.text : null,
      notes: _notesController.text.isNotEmpty ? _notesController.text : null,
      caughtAt: _caughtAt,
    );

    setState(() => _isSaving = false);
    if (success && mounted) {
      Navigator.of(context).pop(true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final mapProvider = context.watch<MapProvider>();
    final spots = mapProvider.spots;

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(title: Text(loc.translate('logCatch'))),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Quick species chips (Regional Kazakhstan fish catalog)
                Text(
                  loc.translate('tagSpecies'),
                  style: AppTypography.labelMedium,
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: FishCatalog.allSpecies.map((sp) {
                    final localizedName = sp.getLocalizedName(loc.languageCode);
                    final isSelected = _speciesController.text == localizedName;
                    return ChoiceChip(
                      label: Text(localizedName),
                      selected: isSelected,
                      selectedColor: AppColors.primaryAccent,
                      backgroundColor: AppColors.elevatedSurface,
                      labelStyle: TextStyle(
                        color: isSelected
                            ? Colors.white
                            : AppColors.secondaryText,
                        fontSize: 12,
                      ),
                      onSelected: (val) {
                        setState(() {
                          _speciesController.text = val ? localizedName : '';
                        });
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: AppSpacing.sm),

                AppTextField(
                  controller: _speciesController,
                  label: loc.translate('tagSpecies'),
                  hint: loc.languageCode == 'ru'
                      ? 'Например: Сазан (Карп), Щука, Судак'
                      : 'e.g. Common Carp, Northern Pike',
                  validator: (v) => (v == null || v.trim().isEmpty)
                      ? (loc.languageCode == 'ru'
                          ? 'Укажите вид рыбы'
                          : 'Please enter the species')
                      : null,
                ),
                const SizedBox(height: AppSpacing.md),

                // Measurements
                Row(
                  children: [
                    Expanded(
                      child: AppTextField(
                        controller: _weightController,
                        label: loc.languageCode == 'ru'
                            ? 'Вес (кг)'
                            : (loc.languageCode == 'kk'
                                ? 'Салмағы (кг)'
                                : 'Weight (kg)'),
                        hint: '3.5',
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                        ),
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: AppTextField(
                        controller: _lengthController,
                        label: loc.languageCode == 'ru'
                            ? 'Длина (см)'
                            : (loc.languageCode == 'kk'
                                ? 'Ұзындығы (см)'
                                : 'Length (cm)'),
                        hint: '52.0',
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

                // Fishing Spot Selector
                Text(
                  loc.languageCode == 'ru'
                      ? 'Место ловли (Водоём)'
                      : (loc.languageCode == 'kk'
                          ? 'Аулаған орын'
                          : 'Fishing Spot'),
                  style: AppTypography.labelMedium,
                ),
                const SizedBox(height: 6),
                if (spots.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.elevatedSurface,
                      borderRadius: AppSpacing.roundedSmall,
                      border: Border.all(color: AppColors.subtleBorder),
                    ),
                    child: Text(
                      loc.languageCode == 'ru'
                          ? 'Нет доступных точек. Создайте точку на карте.'
                          : 'No spots available. Please create one on the map.',
                      style: AppTypography.labelSmall,
                    ),
                  )
                else
                  DropdownButtonFormField<String>(
                    initialValue: _selectedSpotId ?? (spots.isNotEmpty ? spots.first.id : null),
                    dropdownColor: AppColors.elevatedSurface,
                    style: AppTypography.bodyLarge,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                    items: spots.map((spot) {
                      return DropdownMenuItem<String>(
                        value: spot.id,
                        child: Text(
                          '${spot.name} (${spot.waterType})',
                          overflow: TextOverflow.ellipsis,
                        ),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedSpotId = val);
                    },
                  ),
                const SizedBox(height: AppSpacing.md),

                // Bait / Lure
                AppTextField(
                  controller: _lureController,
                  label: loc.languageCode == 'ru'
                      ? 'Приманка / Наживка'
                      : (loc.languageCode == 'kk'
                          ? 'Қолданылған жем'
                          : 'Lure / Bait'),
                  hint: loc.languageCode == 'ru'
                      ? 'Воблер, блесна, кукуруза, бойл...'
                      : 'Crankbait, spoon, sweetcorn, boilie...',
                ),
                const SizedBox(height: AppSpacing.md),

                // Date Picker Tile
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(
                    Icons.calendar_today_outlined,
                    color: AppColors.primaryAccent,
                  ),
                  title: Text(
                    loc.languageCode == 'ru'
                        ? 'Дата и время поимки'
                        : 'Catch Date & Time',
                    style: AppTypography.bodyMedium,
                  ),
                  subtitle: Text(
                    DateFormat('dd.MM.yyyy HH:mm').format(_caughtAt),
                    style: AppTypography.labelSmall,
                  ),
                  trailing: TextButton(
                    onPressed: _selectDate,
                    child: Text(
                      loc.languageCode == 'ru' ? 'Изменить' : 'Change',
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.sm),

                // Notes
                AppTextField(
                  controller: _notesController,
                  label: loc.languageCode == 'ru'
                      ? 'Заметки и условия'
                      : 'Catch Notes',
                  hint: loc.languageCode == 'ru'
                      ? 'Глубина, погода, проводка, поклёвка...'
                      : 'Depth, weather, retrieve, strike details...',
                  maxLines: 3,
                ),
                const SizedBox(height: AppSpacing.xl),

                // Submit button
                AppButton(
                  text: loc.translate('save'),
                  isLoading: _isSaving,
                  onPressed: () => _submit(loc),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
