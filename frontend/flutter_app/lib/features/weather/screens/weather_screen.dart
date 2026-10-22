import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_error_view.dart';
import '../../../core/widgets/app_loading_indicator.dart';
import '../models/weather_model.dart';
import '../state/weather_provider.dart';

class WeatherScreen extends StatefulWidget {
  const WeatherScreen({super.key});

  @override
  State<WeatherScreen> createState() => _WeatherScreenState();
}

class _WeatherScreenState extends State<WeatherScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<WeatherProvider>().fetchWeather();
    });
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final weatherProvider = context.watch<WeatherProvider>();
    final weather = weatherProvider.weather;

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        title: Text(loc.translate('marineWeather')),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.primaryText),
            tooltip: 'Refresh Weather',
            onPressed: () => weatherProvider.fetchWeather(),
          ),
        ],
      ),
      body: weatherProvider.isLoading && weather == null
          ? const AppLoadingIndicator(
              message: 'Retrieving marine & weather data...',
            )
          : weatherProvider.errorMessage != null && weather == null
          ? AppErrorView(
              message: weatherProvider.errorMessage!,
              onRetry: () => weatherProvider.fetchWeather(),
            )
          : weather == null
          ? const Center(child: Text('No weather data available'))
          : RefreshIndicator(
              onRefresh: () => weatherProvider.fetchWeather(),
              color: AppColors.primaryAccent,
              backgroundColor: AppColors.elevatedSurface,
              child: ListView(
                padding: const EdgeInsets.all(AppSpacing.md),
                children: [
                  _buildConditionCard(loc, weather),
                  const SizedBox(height: AppSpacing.md),
                  _buildSuitabilityCard(loc, weather),
                  const SizedBox(height: AppSpacing.md),
                  _buildBarometerAdviceCard(loc, weather),
                ],
              ),
            ),
    );
  }

  Widget _buildConditionCard(AppLocalizations loc, WeatherModel w) {
    return AppCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${w.temperature.toStringAsFixed(1)}°C',
                    style: AppTypography.displayLarge.copyWith(fontSize: 42),
                  ),
                  const SizedBox(height: 4),
                  Text(w.condition, style: AppTypography.titleMedium),
                ],
              ),
              const Icon(
                Icons.wb_sunny_outlined,
                size: 56,
                color: Colors.amber,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          const Divider(height: 1),
          const SizedBox(height: AppSpacing.md),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildMetricItem(
                label: loc.translate('wind'),
                value: '${w.windSpeed.toStringAsFixed(1)} km/h',
                icon: Icons.air,
              ),
              Container(height: 32, width: 1, color: AppColors.subtleBorder),
              _buildMetricItem(
                label: loc.translate('pressure'),
                value: '${w.pressure.toStringAsFixed(1)} hPa',
                icon: Icons.compress,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricItem({
    required String label,
    required String value,
    required IconData icon,
  }) {
    return Column(
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: AppColors.primaryAccent),
            const SizedBox(width: 6),
            Text(label, style: AppTypography.labelSmall),
          ],
        ),
        const SizedBox(height: 4),
        Text(value, style: AppTypography.titleMedium),
      ],
    );
  }

  Widget _buildSuitabilityCard(AppLocalizations loc, WeatherModel w) {
    Color scoreColor;
    if (w.suitabilityScore >= 7) {
      scoreColor = AppColors.success;
    } else if (w.suitabilityScore >= 5) {
      scoreColor = AppColors.warning;
    } else {
      scoreColor = AppColors.error;
    }

    return AppCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                loc.translate('anglingSuitability'),
                style: AppTypography.titleLarge,
              ),
              AppBadge(
                label: w.suitabilityRating.toUpperCase(),
                color: scoreColor,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // Score bar
          Row(
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: scoreColor.withValues(alpha: 0.15),
                  shape: BoxShape.circle,
                  border: Border.all(color: scoreColor, width: 2),
                ),
                child: Center(
                  child: Text(
                    w.suitabilityScore.toStringAsFixed(1),
                    style: AppTypography.headlineMedium.copyWith(
                      color: scoreColor,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      loc.translate('score'),
                      style: AppTypography.titleMedium,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      loc.languageCode == 'ru'
                          ? 'Расчёт клева на основе барометрического давления, ветра и температуры воды'
                          : 'Computed from barometric tendency, wind velocity, and ambient air temp',
                      style: AppTypography.labelSmall,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBarometerAdviceCard(AppLocalizations loc, WeatherModel w) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.insights,
                color: AppColors.primaryAccent,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                loc.languageCode == 'ru'
                    ? 'Тактический прогноз'
                    : 'Tactical Insight',
                style: AppTypography.titleMedium,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            w.barometerAdvice.isNotEmpty
                ? w.barometerAdvice
                : (loc.languageCode == 'ru'
                    ? 'Стабильное давление благоприятно для активной хищной рыбы.'
                    : 'Stable pressure indicates favorable predatory feeding patterns.'),
            style: AppTypography.bodyMedium,
          ),
        ],
      ),
    );
  }
}
