import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../journal/state/journal_provider.dart';
import '../../map/state/map_provider.dart';
import '../state/feed_provider.dart';

class CreatePostScreen extends StatefulWidget {
  const CreatePostScreen({super.key});

  @override
  State<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends State<CreatePostScreen> {
  final _contentController = TextEditingController();
  final _photoUrlController = TextEditingController();

  String? _selectedSpotId;
  String? _selectedCatchId;
  String? _selectedPhotoUrl;
  bool _isPublishing = false;

  final List<String> _samplePhotos = [
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1529230117010-b6c436154f25?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=800&q=80',
  ];

  @override
  void dispose() {
    _contentController.dispose();
    _photoUrlController.dispose();
    super.dispose();
  }

  void _submit(AppLocalizations loc) async {
    final text = _contentController.text.trim();
    if (text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            loc.languageCode == 'ru'
                ? 'Напишите текст публикации'
                : 'Please write some text for your post',
          ),
        ),
      );
      return;
    }

    final mediaList = <String>[];
    if (_selectedPhotoUrl != null && _selectedPhotoUrl!.isNotEmpty) {
      mediaList.add(_selectedPhotoUrl!);
    } else if (_photoUrlController.text.trim().isNotEmpty) {
      mediaList.add(_photoUrlController.text.trim());
    }

    setState(() => _isPublishing = true);
    final feedProvider = context.read<FeedProvider>();
    final success = await feedProvider.createPost(
      content: text,
      spotId: _selectedSpotId,
      catchId: _selectedCatchId,
      mediaUrls: mediaList,
    );

    setState(() => _isPublishing = false);
    if (success && mounted) {
      Navigator.of(context).pop(true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final spots = context.watch<MapProvider>().spots;
    final catches = context.watch<JournalProvider>().catches;

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        title: Text(loc.translate('newPost')),
        actions: [
          TextButton(
            onPressed: _isPublishing ? null : () => _submit(loc),
            child: _isPublishing
                ? const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Text(
                    loc.translate('share'),
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Content Text Field
              AppTextField(
                controller: _contentController,
                hint: loc.translate('writePostHint'),
                maxLines: 5,
                autofocus: true,
              ),
              const SizedBox(height: AppSpacing.lg),

              // Photo Section
              Text(
                loc.languageCode == 'ru'
                    ? 'Прикрепить фотографию'
                    : (loc.languageCode == 'kk'
                        ? 'Фотосуретті қосу'
                        : 'Attach Photo'),
                style: AppTypography.labelMedium,
              ),
              const SizedBox(height: 8),

              // Sample photo gallery choices
              SizedBox(
                height: 72,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _samplePhotos.length + 1,
                  separatorBuilder: (context, index) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    if (index == 0) {
                      final isNone = _selectedPhotoUrl == null &&
                          _photoUrlController.text.isEmpty;
                      return InkWell(
                        onTap: () {
                          setState(() {
                            _selectedPhotoUrl = null;
                            _photoUrlController.clear();
                          });
                        },
                        child: Container(
                          width: 72,
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: isNone
                                  ? AppColors.primary
                                  : AppColors.subtleBorder,
                              width: isNone ? 2 : 1,
                            ),
                          ),
                          child: const Icon(
                            Icons.no_photography_outlined,
                            color: AppColors.textSecondary,
                            size: 24,
                          ),
                        ),
                      );
                    }

                    final photo = _samplePhotos[index - 1];
                    final isSelected = _selectedPhotoUrl == photo;

                    return InkWell(
                      onTap: () {
                        setState(() {
                          _selectedPhotoUrl = photo;
                          _photoUrlController.text = photo;
                        });
                      },
                      child: Container(
                        width: 72,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: isSelected
                                ? AppColors.primary
                                : Colors.transparent,
                            width: 2.5,
                          ),
                          image: DecorationImage(
                            image: NetworkImage(photo),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 10),

              // Custom photo URL
              AppTextField(
                controller: _photoUrlController,
                hint: loc.languageCode == 'ru'
                    ? 'Или вставьте прямую ссылку на фото...'
                    : 'Or enter custom image URL...',
                onChanged: (val) {
                  setState(() => _selectedPhotoUrl = val.trim());
                },
              ),
              const SizedBox(height: AppSpacing.lg),

              // Attach Fishing Spot
              if (spots.isNotEmpty) ...[
                Text(
                  loc.translate('attachSpot'),
                  style: AppTypography.labelMedium,
                ),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: _selectedSpotId,
                  dropdownColor: AppColors.elevatedSurface,
                  style: AppTypography.bodyLarge,
                  hint: Text(
                    loc.languageCode == 'ru'
                        ? 'Выберите водоём'
                        : 'Select a spot',
                    style: const TextStyle(color: AppColors.mutedText),
                  ),
                  decoration: const InputDecoration(
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  items: [
                    DropdownMenuItem(
                      value: null,
                      child: Text(
                        loc.languageCode == 'ru'
                            ? 'Без привязки к точке'
                            : 'No spot tagged',
                      ),
                    ),
                    ...spots.map(
                      (s) => DropdownMenuItem(value: s.id, child: Text(s.name)),
                    ),
                  ],
                  onChanged: (val) => setState(() => _selectedSpotId = val),
                ),
                const SizedBox(height: AppSpacing.md),
              ],

              // Attach Catch Record
              if (catches.isNotEmpty) ...[
                Text(
                  loc.languageCode == 'ru'
                      ? 'Прикрепить трофей из дневника'
                      : 'Attach Catch Record',
                  style: AppTypography.labelMedium,
                ),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: _selectedCatchId,
                  dropdownColor: AppColors.elevatedSurface,
                  style: AppTypography.bodyLarge,
                  hint: Text(
                    loc.languageCode == 'ru'
                        ? 'Выберите запись улова'
                        : 'Select a catch',
                    style: const TextStyle(color: AppColors.mutedText),
                  ),
                  decoration: const InputDecoration(
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  items: [
                    DropdownMenuItem(
                      value: null,
                      child: Text(
                        loc.languageCode == 'ru'
                            ? 'Без улова'
                            : 'No catch attached',
                      ),
                    ),
                    ...catches.map((c) {
                      final title =
                          '${c.species} ${c.weight != null ? "(${c.weight} кг)" : ""}';
                      return DropdownMenuItem(value: c.id, child: Text(title));
                    }),
                  ],
                  onChanged: (val) => setState(() => _selectedCatchId = val),
                ),
                const SizedBox(height: AppSpacing.lg),
              ],

              AppButton(
                text: loc.translate('newPost'),
                isLoading: _isPublishing,
                onPressed: () => _submit(loc),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
