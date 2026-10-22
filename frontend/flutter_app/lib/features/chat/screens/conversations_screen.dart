import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_avatar.dart';
import '../../../core/widgets/app_card.dart';
import '../../../core/widgets/app_empty_state.dart';
import '../../../core/widgets/app_error_view.dart';
import '../../../core/widgets/app_loading_indicator.dart';
import '../state/chat_provider.dart';
import 'chat_detail_screen.dart';

class ConversationsScreen extends StatefulWidget {
  const ConversationsScreen({super.key});

  @override
  State<ConversationsScreen> createState() => _ConversationsScreenState();
}

class _ConversationsScreenState extends State<ConversationsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ChatProvider>().fetchConversations();
    });
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final chat = context.watch<ChatProvider>();
    final convs = chat.conversations;

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        title: Text(loc.translate('messages')),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.primaryText),
            tooltip: 'Refresh',
            onPressed: () => chat.fetchConversations(),
          ),
        ],
      ),
      body: chat.isLoading && convs.isEmpty
          ? const AppLoadingIndicator(message: 'Loading conversations...')
          : chat.errorMessage != null && convs.isEmpty
          ? AppErrorView(
              message: chat.errorMessage!,
              onRetry: () => chat.fetchConversations(),
            )
          : convs.isEmpty
          ? AppEmptyState(
              icon: Icons.chat_bubble_outline,
              title: loc.languageCode == 'ru'
                  ? 'Диалогов пока нет'
                  : (loc.languageCode == 'kk'
                      ? 'Әзірге сұхбаттар жоқ'
                      : 'No conversations yet'),
              description: loc.languageCode == 'ru'
                  ? 'Связывайтесь с рыболовами, обсуждайте водоёмы, снасти и тактику ловли!'
                  : 'Connect with fellow anglers to discuss spots, gear, and tactics.',
            )
          : RefreshIndicator(
              onRefresh: () => chat.fetchConversations(),
              color: AppColors.primaryAccent,
              backgroundColor: AppColors.elevatedSurface,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                itemCount: convs.length,
                separatorBuilder: (context, index) =>
                    const SizedBox(height: AppSpacing.sm),
                itemBuilder: (context, index) {
                  final conv = convs[index];
                  return AppCard(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => ChatDetailScreen(conversation: conv),
                        ),
                      );
                    },
                    child: Row(
                      children: [
                        AppAvatar(name: conv.peerName, radius: 22),
                        const SizedBox(width: AppSpacing.md),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    conv.peerName,
                                    style: AppTypography.titleMedium,
                                  ),
                                  if (conv.lastMessageAt != null)
                                    Text(
                                      DateFormat(
                                        'HH:mm',
                                      ).format(conv.lastMessageAt!),
                                      style: AppTypography.labelSmall,
                                    ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      conv.lastMessage ?? '',
                                      style: AppTypography.bodyMedium.copyWith(
                                        color: AppColors.secondaryText,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  if (conv.unreadCount > 0)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 7,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        color: AppColors.primaryAccent,
                                        borderRadius: BorderRadius.circular(
                                          10,
                                        ),
                                      ),
                                      child: Text(
                                        '${conv.unreadCount}',
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
    );
  }
}
