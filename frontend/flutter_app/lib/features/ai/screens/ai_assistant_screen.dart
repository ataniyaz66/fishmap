import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_button.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_text_field.dart';
import '../../fishing/data/fish_catalog.dart';
import '../models/ai_recommendation.dart';
import '../state/ai_provider.dart';

class AiAssistantScreen extends StatefulWidget {
  const AiAssistantScreen({super.key});

  @override
  State<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends State<AiAssistantScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Lure recommender inputs
  String _selectedSpecies = 'carp_sazan';
  final String _waterType = 'freshwater';
  final String _weather = 'overcast';
  String _waterClarity = 'clear';
  String _depth = 'medium';

  // Ask assistant
  final _promptController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _promptController.dispose();
    super.dispose();
  }

  void _requestRecommendation(AppLocalizations loc) {
    final sp = FishCatalog.findById(_selectedSpecies);
    final targetName = sp != null ? sp.getLocalizedName(loc.languageCode) : _selectedSpecies;

    context.read<AiProvider>().recommendLure(
      targetSpecies: targetName,
      waterType: _waterType,
      weather: _weather,
      waterClarity: _waterClarity,
      depth: _depth,
    );
  }

  void _askAssistant() {
    if (_promptController.text.trim().isEmpty) return;
    context.read<AiProvider>().askAssist(_promptController.text);
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final aiProvider = context.watch<AiProvider>();

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        title: Text(loc.translate('aiAdvisorTitle')),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primaryAccent,
          labelColor: AppColors.primaryAccent,
          unselectedLabelColor: AppColors.secondaryText,
          tabs: [
            Tab(text: loc.translate('lureRecommendation')),
            Tab(
              text: loc.languageCode == 'ru'
                  ? 'Советы и тактика'
                  : 'Angling Advice',
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildLureRecommenderTab(loc, aiProvider),
          _buildAssistTab(loc, aiProvider),
        ],
      ),
    );
  }

  Widget _buildLureRecommenderTab(AppLocalizations loc, AiProvider ai) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.psychology,
                      color: AppColors.primaryAccent,
                      size: 22,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      loc.languageCode == 'ru'
                          ? 'Условия и параметры'
                          : 'Tactical Parameters',
                      style: AppTypography.titleMedium,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

                Text(
                  loc.translate('tagSpecies'),
                  style: AppTypography.labelMedium,
                ),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  initialValue: _selectedSpecies,
                  dropdownColor: AppColors.elevatedSurface,
                  style: AppTypography.bodyLarge,
                  decoration: const InputDecoration(
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 10,
                    ),
                  ),
                  items: FishCatalog.allSpecies
                      .map(
                        (s) => DropdownMenuItem(
                          value: s.id,
                          child: Text(s.getLocalizedName(loc.languageCode)),
                        ),
                      )
                      .toList(),
                  onChanged: (v) {
                    if (v != null) setState(() => _selectedSpecies = v);
                  },
                ),
                const SizedBox(height: AppSpacing.sm),

                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            loc.languageCode == 'ru'
                                ? 'Прозрачность'
                                : 'Water Clarity',
                            style: AppTypography.labelMedium,
                          ),
                          const SizedBox(height: 6),
                          DropdownButtonFormField<String>(
                            initialValue: _waterClarity,
                            dropdownColor: AppColors.elevatedSurface,
                            style: AppTypography.bodyLarge,
                            decoration: const InputDecoration(
                              contentPadding: EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 10,
                              ),
                            ),
                            items: [
                              DropdownMenuItem(
                                value: 'clear',
                                child: Text(
                                  loc.languageCode == 'ru'
                                      ? 'Прозрачная'
                                      : 'Clear',
                                ),
                              ),
                              DropdownMenuItem(
                                value: 'stained',
                                child: Text(
                                  loc.languageCode == 'ru'
                                      ? 'Мутноватая'
                                      : 'Stained',
                                ),
                              ),
                              DropdownMenuItem(
                                value: 'muddy',
                                child: Text(
                                  loc.languageCode == 'ru' ? 'Мутная' : 'Muddy',
                                ),
                              ),
                            ],
                            onChanged: (v) {
                              if (v != null) setState(() => _waterClarity = v);
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            loc.languageCode == 'ru' ? 'Глубина' : 'Depth Zone',
                            style: AppTypography.labelMedium,
                          ),
                          const SizedBox(height: 6),
                          DropdownButtonFormField<String>(
                            initialValue: _depth,
                            dropdownColor: AppColors.elevatedSurface,
                            style: AppTypography.bodyLarge,
                            decoration: const InputDecoration(
                              contentPadding: EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 10,
                              ),
                            ),
                            items: [
                              DropdownMenuItem(
                                value: 'shallow',
                                child: Text(
                                  loc.languageCode == 'ru'
                                      ? 'Мелководье (<1.5м)'
                                      : 'Shallow (<5ft)',
                                ),
                              ),
                              DropdownMenuItem(
                                value: 'medium',
                                child: Text(
                                  loc.languageCode == 'ru'
                                      ? 'Средняя (1.5-4м)'
                                      : 'Mid (5-15ft)',
                                ),
                              ),
                              DropdownMenuItem(
                                value: 'deep',
                                child: Text(
                                  loc.languageCode == 'ru'
                                      ? 'Глубоко (>4м)'
                                      : 'Deep (>15ft)',
                                ),
                              ),
                            ],
                            onChanged: (v) {
                              if (v != null) setState(() => _depth = v);
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

                AppButton(
                  text: loc.translate('lureRecommendation'),
                  icon: Icons.auto_awesome,
                  isLoading: ai.isLoading,
                  onPressed: () => _requestRecommendation(loc),
                ),
              ],
            ),
          ),

          if (ai.latestRecommendation != null) ...[
            const SizedBox(height: AppSpacing.lg),
            _buildRecommendationCard(loc, ai.latestRecommendation!),
          ],
        ],
      ),
    );
  }

  Widget _buildRecommendationCard(
    AppLocalizations loc,
    AiRecommendation rec,
  ) {
    return AppCard(
      padding: const EdgeInsets.all(AppSpacing.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(
                    Icons.verified,
                    color: AppColors.success,
                    size: 22,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    loc.languageCode == 'ru'
                        ? 'Рекомендация ИИ'
                        : 'AI Recommendation',
                    style: AppTypography.titleLarge,
                  ),
                ],
              ),
              AppBadge(
                label: '${(rec.confidence * 100).toInt()}% Match',
                color: AppColors.primaryAccent,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          Text(
            rec.primaryLure,
            style: AppTypography.headlineMedium.copyWith(
              color: AppColors.primaryAccent,
            ),
          ),
          const SizedBox(height: AppSpacing.sm),

          if (rec.retrieveTechnique != null) ...[
            _buildDetailRow(
              loc.languageCode == 'ru' ? 'Проводка' : 'Retrieve Technique',
              rec.retrieveTechnique!,
            ),
            const SizedBox(height: 6),
          ],

          if (rec.colorAdvice != null) ...[
            _buildDetailRow(
              loc.languageCode == 'ru' ? 'Цвет' : 'Color Advice',
              rec.colorAdvice!,
            ),
            const SizedBox(height: 6),
          ],

          const SizedBox(height: 8),
          Text(
            loc.languageCode == 'ru' ? 'Обоснование' : 'Tactical Reasoning',
            style: AppTypography.labelMedium,
          ),
          const SizedBox(height: 4),
          Text(rec.reasoning, style: AppTypography.bodyMedium),

          if (rec.matchedInventory.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.md),
            const Divider(height: 1),
            const SizedBox(height: AppSpacing.sm),
            Text(
              loc.languageCode == 'ru'
                  ? 'Из вашей коробки со снастями'
                  : 'Matched From Your Tackle Box',
              style: AppTypography.labelMedium,
            ),
            const SizedBox(height: 6),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: rec.matchedInventory.map((item) {
                return AppBadge(
                  label: item,
                  icon: Icons.check,
                  color: AppColors.success,
                );
              }).toList(),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 140,
          child: Text(label, style: AppTypography.labelMedium),
        ),
        Expanded(child: Text(value, style: AppTypography.bodyLarge)),
      ],
    );
  }

  Widget _buildAssistTab(AppLocalizations loc, AiProvider ai) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          AppCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.chat_bubble_outline,
                      color: AppColors.primaryAccent,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      loc.languageCode == 'ru'
                          ? 'Спросить рыболовного ИИ-эксперта'
                          : 'Ask Angling AI',
                      style: AppTypography.titleMedium,
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),
                AppTextField(
                  controller: _promptController,
                  hint: loc.translate('askAiHint'),
                  maxLines: 3,
                ),
                const SizedBox(height: AppSpacing.sm),

                // Quick Prompt Chips
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    ActionChip(
                      label: Text(
                        loc.languageCode == 'ru'
                            ? 'Как вязать узел Palomar?'
                            : 'Palomar knot guide',
                        style: const TextStyle(fontSize: 12),
                      ),
                      onPressed: () {
                        _promptController.text = loc.languageCode == 'ru'
                            ? 'Как правильно вязать узел Palomar и для каких лесок он подходит?'
                            : 'How do I tie a Palomar knot and when should I use it?';
                      },
                    ),
                    ActionChip(
                      label: Text(
                        loc.languageCode == 'ru'
                            ? 'Джиг на судака осенью'
                            : 'Autumn zander jigging',
                        style: const TextStyle(fontSize: 12),
                      ),
                      onPressed: () {
                        _promptController.text = loc.languageCode == 'ru'
                            ? 'Какая лучшая тактика джиговой ловли судака осенью на глубине?'
                            : 'What is the best technique for autumn deep-water zander jigging?';
                      },
                    ),
                    ActionChip(
                      label: Text(
                        loc.languageCode == 'ru'
                            ? 'Ловля сазана на реке'
                            : 'River carp tactics',
                        style: const TextStyle(fontSize: 12),
                      ),
                      onPressed: () {
                        _promptController.text = loc.languageCode == 'ru'
                            ? 'Какую прикормку и насадку выбрать для ловли сазана на течении?'
                            : 'What groundbait and hookbait works best for river carp on current?';
                      },
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

                AppButton(
                  text: loc.languageCode == 'ru'
                      ? 'Получить ответ'
                      : 'Ask Advisor',
                  isLoading: ai.isLoading,
                  onPressed: _askAssistant,
                ),
              ],
            ),
          ),

          if (ai.assistantResponse != null) ...[
            const SizedBox(height: AppSpacing.md),
            AppCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.auto_awesome,
                        color: AppColors.primaryAccent,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        loc.languageCode == 'ru'
                            ? 'Ответ советника'
                            : 'Advisor Response',
                        style: AppTypography.titleMedium,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    ai.assistantResponse!,
                    style: AppTypography.bodyLarge.copyWith(height: 1.5),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
