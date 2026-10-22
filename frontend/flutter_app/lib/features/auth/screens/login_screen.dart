import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/localization/locale_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../state/auth_provider.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();
    final success = await authProvider.login(
      identifier: _identifierController.text,
      password: _passwordController.text,
    );

    if (success && mounted) {
      // Navigation is automatically handled by the Auth wrapper / main switch
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final localeProvider = context.watch<LocaleProvider>();
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          // Quick Language switcher menu
          PopupMenuButton<String>(
            icon: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.language, size: 18),
                const SizedBox(width: 4),
                Text(
                  localeProvider.languageCode.toUpperCase(),
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                ),
              ],
            ),
            onSelected: (code) => localeProvider.setLanguageCode(code),
            itemBuilder: (_) => [
              const PopupMenuItem(value: 'ru', child: Text('Русский')),
              const PopupMenuItem(value: 'kk', child: Text('Қазақша')),
              const PopupMenuItem(value: 'en', child: Text('English')),
            ],
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.md,
            ),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // App Icon & Brand
                  const Icon(
                    Icons.waves,
                    size: 54,
                    color: AppColors.primaryAccent,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Text(
                    loc.languageCode == 'ru'
                        ? 'Добро пожаловать в FishMap'
                        : (loc.languageCode == 'kk'
                            ? 'FishMap-ке қош келдіңіз'
                            : 'Welcome to FishMap'),
                    style: AppTypography.displayLarge,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    loc.languageCode == 'ru'
                        ? 'Социальная сеть для рыболовов: карта, уловы, снасти и общение'
                        : (loc.languageCode == 'kk'
                            ? 'Балықшылар әлеуметтік желісі: карта, олжалар және сұхбат'
                            : 'Connect with anglers, discover spots, and log your catches'),
                    style: AppTypography.bodyMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.xl),

                  // Error Display
                  if (auth.errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      decoration: BoxDecoration(
                        color: AppColors.error.withValues(alpha: 0.1),
                        borderRadius: AppSpacing.roundedSmall,
                        border: Border.all(
                          color: AppColors.error.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.error_outline,
                            color: AppColors.error,
                            size: 20,
                          ),
                          const SizedBox(width: AppSpacing.xs),
                          Expanded(
                            child: Text(
                              auth.errorMessage!,
                              style: AppTypography.bodyMedium.copyWith(
                                color: AppColors.error,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: AppSpacing.md),
                  ],

                  // Form Fields
                  AppTextField(
                    controller: _identifierController,
                    label: loc.languageCode == 'ru'
                        ? 'Email или имя пользователя'
                        : 'Email or Username',
                    hint: 'angler@example.com',
                    prefixIcon: const Icon(
                      Icons.person_outline,
                      color: AppColors.secondaryText,
                      size: 20,
                    ),
                    keyboardType: TextInputType.emailAddress,
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return loc.languageCode == 'ru'
                            ? 'Введите email или имя'
                            : 'Please enter your email or username';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: AppSpacing.md),

                  AppTextField(
                    controller: _passwordController,
                    label: loc.languageCode == 'ru' ? 'Пароль' : 'Password',
                    hint: '••••••••',
                    isPassword: true,
                    prefixIcon: const Icon(
                      Icons.lock_outline,
                      color: AppColors.secondaryText,
                      size: 20,
                    ),
                    textInputAction: TextInputAction.done,
                    onSubmitted: (_) => _submit(),
                    validator: (val) {
                      if (val == null || val.isEmpty) {
                        return loc.languageCode == 'ru'
                            ? 'Введите пароль'
                            : 'Please enter your password';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // Submit Button
                  AppButton(
                    text: loc.translate('signIn'),
                    isLoading: auth.isLoading,
                    onPressed: _submit,
                  ),
                  const SizedBox(height: AppSpacing.xl),

                  // Navigate to Register
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        loc.languageCode == 'ru'
                            ? 'Ещё нет аккаунта?'
                            : (loc.languageCode == 'kk'
                                ? 'Әлі тіркелмедіңіз бе?'
                                : "Don't have an account?"),
                        style: AppTypography.bodyMedium,
                      ),
                      TextButton(
                        onPressed: () {
                          auth.clearError();
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => const RegisterScreen(),
                            ),
                          );
                        },
                        child: Text(
                          loc.translate('register'),
                          style: AppTypography.button.copyWith(
                            color: AppColors.primaryAccent,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
