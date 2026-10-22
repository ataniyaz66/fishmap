import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../models/user_profile.dart';
import '../state/profile_provider.dart';

class EditProfileScreen extends StatefulWidget {
  final UserProfile? profile;

  const EditProfileScreen({super.key, this.profile});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _displayNameController;
  late final TextEditingController _bioController;
  late final TextEditingController _locationController;
  late final TextEditingController _speciesController;

  String _experienceLevel = 'intermediate';
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final p = widget.profile;
    _displayNameController = TextEditingController(text: p?.displayName ?? '');
    _bioController = TextEditingController(text: p?.bio ?? '');
    _locationController = TextEditingController(text: p?.location ?? '');
    _speciesController = TextEditingController(
      text: p?.favoriteSpecies.join(', ') ?? '',
    );
    if (p?.experienceLevel != null) {
      _experienceLevel = p!.experienceLevel;
    }
  }

  @override
  void dispose() {
    _displayNameController.dispose();
    _bioController.dispose();
    _locationController.dispose();
    _speciesController.dispose();
    super.dispose();
  }

  void _save() async {
    if (!_formKey.currentState!.validate()) return;

    final species = _speciesController.text
        .split(',')
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();

    setState(() => _isSaving = true);
    final profileProvider = context.read<ProfileProvider>();
    final success = await profileProvider.updateProfile(
      displayName: _displayNameController.text,
      bio: _bioController.text,
      location: _locationController.text,
      experienceLevel: _experienceLevel,
      favoriteSpecies: species,
    );

    setState(() => _isSaving = false);
    if (success && mounted) {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(title: const Text('Edit Angler Profile')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                AppTextField(
                  controller: _displayNameController,
                  label: 'Display Name',
                  hint: 'e.g. Captain Mike',
                ),
                const SizedBox(height: AppSpacing.md),

                AppTextField(
                  controller: _locationController,
                  label: 'Home Waters / Location',
                  hint: 'e.g. San Francisco Bay Area, CA',
                  prefixIcon: const Icon(
                    Icons.location_on_outlined,
                    color: AppColors.secondaryText,
                    size: 20,
                  ),
                ),
                const SizedBox(height: AppSpacing.md),

                const Text(
                  'Experience Level',
                  style: AppTypography.labelMedium,
                ),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: _experienceLevel,
                  dropdownColor: AppColors.elevatedSurface,
                  style: AppTypography.bodyLarge,
                  decoration: const InputDecoration(
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 10,
                    ),
                  ),
                  items: const [
                    DropdownMenuItem(
                      value: 'beginner',
                      child: Text('Beginner Angler'),
                    ),
                    DropdownMenuItem(
                      value: 'intermediate',
                      child: Text('Intermediate'),
                    ),
                    DropdownMenuItem(
                      value: 'advanced',
                      child: Text('Advanced Angler'),
                    ),
                    DropdownMenuItem(
                      value: 'pro',
                      child: Text('Tournament Pro / Guide'),
                    ),
                  ],
                  onChanged: (v) {
                    if (v != null) setState(() => _experienceLevel = v);
                  },
                ),
                const SizedBox(height: AppSpacing.md),

                AppTextField(
                  controller: _speciesController,
                  label: 'Favorite Species (comma-separated)',
                  hint: 'Bass, Pike, Trout, Walleye',
                ),
                const SizedBox(height: AppSpacing.md),

                AppTextField(
                  controller: _bioController,
                  label: 'Bio / Angling Philosophy',
                  hint:
                      'Catch & release enthusiast, tournament kayak angler...',
                  maxLines: 4,
                ),
                const SizedBox(height: AppSpacing.xl),

                AppButton(
                  text: 'Save Changes',
                  isLoading: _isSaving,
                  onPressed: _save,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
