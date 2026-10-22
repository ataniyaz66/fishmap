import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/config/api_config.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/localization/locale_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../auth/state/auth_provider.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late final TextEditingController _apiUrlController;

  @override
  void initState() {
    super.initState();
    _apiUrlController = TextEditingController(text: ApiConfig.baseUrl);
  }

  @override
  void dispose() {
    _apiUrlController.dispose();
    super.dispose();
  }

  void _saveApiUrl() {
    final newUrl = _apiUrlController.text.trim();
    if (newUrl.isNotEmpty) {
      ApiConfig.baseUrl = newUrl;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('API Gateway URL updated.'),
          backgroundColor: AppColors.success,
        ),
      );
    }
  }

  void _confirmLogout(AppLocalizations loc) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.elevatedSurface,
        title: Text(loc.translate('logout'), style: AppTypography.titleLarge),
        content: Text(
          loc.languageCode == 'ru'
              ? 'Вы уверены, что хотите выйти из учетной записи?'
              : (loc.languageCode == 'kk'
                  ? 'FishMap жүйесінен шыққыңыз келетініне сенімдісіз бе?'
                  : 'Are you sure you want to sign out of FishMap?'),
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
              Navigator.of(context).pop();
              context.read<AuthProvider>().logout();
            },
            child: Text(
              loc.translate('logout'),
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
    final localeProvider = context.watch<LocaleProvider>();
    final auth = context.watch<AuthProvider>();
    final user = auth.currentUser;

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(title: Text(loc.translate('settings'))),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.md),
        children: [
          // Language Selection Card
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.language,
                      color: AppColors.primaryAccent,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      loc.translate('appLanguage'),
                      style: AppTypography.titleMedium,
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _buildLanguageChoice(
                      title: 'Русский',
                      code: 'ru',
                      currentCode: localeProvider.languageCode,
                      onTap: () => localeProvider.setLanguageCode('ru'),
                    ),
                    const SizedBox(width: 8),
                    _buildLanguageChoice(
                      title: 'Қазақша',
                      code: 'kk',
                      currentCode: localeProvider.languageCode,
                      onTap: () => localeProvider.setLanguageCode('kk'),
                    ),
                    const SizedBox(width: 8),
                    _buildLanguageChoice(
                      title: 'English',
                      code: 'en',
                      currentCode: localeProvider.languageCode,
                      onTap: () => localeProvider.setLanguageCode('en'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Account Info Card
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  loc.languageCode == 'ru'
                      ? 'Данные аккаунта'
                      : (loc.languageCode == 'kk'
                          ? 'Тіркелгі мәліметтері'
                          : 'Account Information'),
                  style: AppTypography.titleMedium,
                ),
                const SizedBox(height: AppSpacing.md),
                _buildInfoRow(
                  loc.languageCode == 'ru'
                      ? 'Имя пользователя'
                      : (loc.languageCode == 'kk'
                          ? 'Пайдаланушы аты'
                          : 'Username'),
                  user?.username ?? '—',
                ),
                const SizedBox(height: 8),
                _buildInfoRow('Email', user?.email ?? '—'),
                const SizedBox(height: 8),
                _buildInfoRow(
                  loc.languageCode == 'ru'
                      ? 'Роль'
                      : (loc.languageCode == 'kk' ? 'Рөлі' : 'Role'),
                  user?.role.toUpperCase() ?? 'USER',
                ),
                const SizedBox(height: 8),
                _buildInfoRow(
                  loc.languageCode == 'ru'
                      ? 'Статус'
                      : (loc.languageCode == 'kk' ? 'Күйі' : 'Status'),
                  user?.status.toUpperCase() ?? 'ACTIVE',
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Environment & API Gateway Setting
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.dns_outlined,
                      color: AppColors.primaryAccent,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      loc.translate('gatewayConfig'),
                      style: AppTypography.titleMedium,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.sm),
                Text(
                  loc.languageCode == 'ru'
                      ? 'Настройка хоста шлюза для локальной разработки или эмуляторов.'
                      : (loc.languageCode == 'kk'
                          ? 'Жергілікті әзірлеу немесе эмуляторлар үшін API шлюзін баптау.'
                          : 'Configure the backend host target for local development or device emulators.'),
                  style: AppTypography.bodyMedium,
                ),
                const SizedBox(height: AppSpacing.md),
                AppTextField(
                  controller: _apiUrlController,
                  label: 'Gateway URL',
                  hint: 'http://localhost:4000',
                ),
                const SizedBox(height: AppSpacing.sm),
                Wrap(
                  spacing: 6,
                  children: [
                    ActionChip(
                      label: const Text('Localhost (4000)'),
                      onPressed: () {
                        setState(
                          () =>
                              _apiUrlController.text = 'http://localhost:4000',
                        );
                        _saveApiUrl();
                      },
                    ),
                    ActionChip(
                      label: const Text('Android (10.0.2.2:4000)'),
                      onPressed: () {
                        setState(
                          () => _apiUrlController.text = 'http://10.0.2.2:4000',
                        );
                        _saveApiUrl();
                      },
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                AppButton(
                  text: loc.languageCode == 'ru'
                      ? 'Применить URL'
                      : (loc.languageCode == 'kk'
                          ? 'URL қолдану'
                          : 'Apply Gateway URL'),
                  variant: AppButtonVariant.secondary,
                  onPressed: _saveApiUrl,
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Sign Out Action
          AppCard(
            child: ListTile(
              contentPadding: EdgeInsets.zero,
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.error.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.logout,
                  color: AppColors.error,
                  size: 20,
                ),
              ),
              title: Text(
                loc.translate('logout'),
                style: AppTypography.titleMedium,
              ),
              subtitle: Text(
                loc.languageCode == 'ru'
                    ? 'Завершить сеанс на этом устройстве'
                    : (loc.languageCode == 'kk'
                        ? 'Бұл құрылғыдағы сессияны аяқтау'
                        : 'End your session on this device'),
                style: AppTypography.labelSmall,
              ),
              onTap: () => _confirmLogout(loc),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageChoice({
    required String title,
    required String code,
    required String currentCode,
    required VoidCallback onTap,
  }) {
    final isSelected = currentCode == code;
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected
                ? AppColors.primaryAccent
                : AppColors.surface.withAlpha(80),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected
                  ? AppColors.primaryAccent
                  : AppColors.subtleBorder,
            ),
          ),
          child: Text(
            title,
            style: TextStyle(
              fontSize: 13,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              color: isSelected ? Colors.white : AppColors.secondaryText,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTypography.labelMedium),
        Text(value, style: AppTypography.bodyLarge),
      ],
    );
  }
}
