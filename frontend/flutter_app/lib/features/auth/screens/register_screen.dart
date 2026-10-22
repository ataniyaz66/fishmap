import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_text_field.dart';
import '../state/auth_provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();
    final success = await authProvider.register(
      email: _emailController.text,
      username: _usernameController.text,
      password: _passwordController.text,
    );

    if (success && mounted) {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(title: Text(loc.translate('register'))),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.xl,
            ),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    loc.languageCode == 'ru'
                        ? 'Присоединяйтесь к FishMap'
                        : (loc.languageCode == 'kk'
                            ? 'FishMap қауымдастығына қосылыңыз'
                            : 'Join FishMap Community'),
                    style: AppTypography.headlineMedium,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    loc.languageCode == 'ru'
                        ? 'Ведите дневник трофеев, открывайте новые водоёмы и общайтесь с рыболовами!'
                        : 'Track your personal bests, share spots, and connect with local anglers',
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
                    controller: _usernameController,
                    label: loc.languageCode == 'ru'
                        ? 'Имя пользователя (логин)'
                        : 'Username',
                    hint: 'рыболов_astana',
                    prefixIcon: const Icon(
                      Icons.person_outline,
                      color: AppColors.secondaryText,
                      size: 20,
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return loc.languageCode == 'ru'
                            ? 'Введите имя пользователя'
                            : 'Please enter a username';
                      }
                      if (val.trim().length < 3) {
                        return loc.languageCode == 'ru'
                            ? 'Минимум 3 символа'
                            : 'Must be at least 3 characters';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: AppSpacing.md),

                  AppTextField(
                    controller: _emailController,
                    label: 'Email',
                    hint: 'angler@example.com',
                    keyboardType: TextInputType.emailAddress,
                    prefixIcon: const Icon(
                      Icons.email_outlined,
                      color: AppColors.secondaryText,
                      size: 20,
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'Please enter your email';
                      }
                      if (!val.contains('@') || !val.contains('.')) {
                        return 'Please enter a valid email';
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
                        return 'Please enter a password';
                      }
                      if (val.length < 6) {
                        return 'Password must be at least 6 characters';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: AppSpacing.lg),

                  // Submit Button
                  AppButton(
                    text: loc.translate('register'),
                    isLoading: auth.isLoading,
                    onPressed: _submit,
                  ),
                  const SizedBox(height: AppSpacing.xl),

                  // Already have account
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        loc.languageCode == 'ru'
                            ? 'Уже есть аккаунт?'
                            : 'Already have an account?',
                        style: AppTypography.bodyMedium,
                      ),
                      TextButton(
                        onPressed: () => Navigator.of(context).pop(),
                        child: Text(
                          loc.translate('login'),
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
