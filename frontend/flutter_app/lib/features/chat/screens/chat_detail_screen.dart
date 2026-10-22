import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_avatar.dart';
import '../models/conversation_model.dart';
import '../state/chat_provider.dart';

class ChatDetailScreen extends StatefulWidget {
  final ConversationModel conversation;

  const ChatDetailScreen({super.key, required this.conversation});

  @override
  State<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends State<ChatDetailScreen> {
  final _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isSending = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ChatProvider>().fetchMessages(widget.conversation.id);
    });
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    setState(() => _isSending = true);
    final success = await context.read<ChatProvider>().sendMessage(
      widget.conversation.id,
      text,
    );
    setState(() => _isSending = false);

    if (success) {
      _messageController.clear();
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final chatProvider = context.watch<ChatProvider>();
    final messages = chatProvider.getMessages(widget.conversation.id);
    final currentUserId = chatProvider.getCurrentUserId();

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        titleSpacing: 0,
        title: Row(
          children: [
            AppAvatar(name: widget.conversation.peerName, radius: 16),
            const SizedBox(width: 10),
            Text(
              widget.conversation.peerName,
              style: AppTypography.titleMedium,
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: messages.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 32),
                      child: Text(
                        loc.languageCode == 'ru'
                            ? 'Сообщений пока нет. Напишите первое сообщение, чтобы обсудить снасти или договориться о совместном выезде!'
                            : 'No messages yet. Say hello to plan your next fishing trip!',
                        style: AppTypography.bodyMedium,
                        textAlign: TextAlign.center,
                      ),
                    ),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final msg = messages[index];
                      final isMe = msg.senderId == currentUserId;

                      return Align(
                        alignment: isMe
                            ? Alignment.centerRight
                            : Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.symmetric(vertical: 4),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 10,
                          ),
                          constraints: BoxConstraints(
                            maxWidth: MediaQuery.of(context).size.width * 0.75,
                          ),
                          decoration: BoxDecoration(
                            color: isMe
                                ? AppColors.primaryAccent
                                : AppColors.elevatedSurface,
                            borderRadius: BorderRadius.only(
                              topLeft: const Radius.circular(
                                AppSpacing.radiusMedium,
                              ),
                              topRight: const Radius.circular(
                                AppSpacing.radiusMedium,
                              ),
                              bottomLeft: isMe
                                  ? const Radius.circular(
                                      AppSpacing.radiusMedium,
                                    )
                                  : Radius.zero,
                              bottomRight: isMe
                                  ? Radius.zero
                                  : const Radius.circular(
                                      AppSpacing.radiusMedium,
                                    ),
                            ),
                            border: isMe
                                ? null
                                : Border.all(color: AppColors.subtleBorder),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                msg.content,
                                style: AppTypography.bodyMedium.copyWith(
                                  color: isMe
                                      ? Colors.white
                                      : AppColors.primaryText,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                DateFormat('HH:mm').format(msg.createdAt),
                                style: AppTypography.labelSmall.copyWith(
                                  fontSize: 10,
                                  color: isMe
                                      ? Colors.white70
                                      : AppColors.mutedText,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),

          // Message Input Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: const BoxDecoration(
              color: AppColors.elevatedSurface,
              border: Border(top: BorderSide(color: AppColors.subtleBorder)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      style: AppTypography.bodyMedium,
                      decoration: InputDecoration(
                        hintText: loc.languageCode == 'ru'
                            ? 'Напишите сообщение...'
                            : 'Type a message...',
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 10,
                        ),
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: _isSending
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: AppColors.primaryAccent,
                            ),
                          )
                        : const Icon(
                            Icons.send_rounded,
                            color: AppColors.primaryAccent,
                          ),
                    onPressed: _isSending ? null : _sendMessage,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
