import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_avatar.dart';
import '../models/post_model.dart';
import '../state/feed_provider.dart';

class PostCommentsSheet extends StatefulWidget {
  final PostModel post;

  const PostCommentsSheet({super.key, required this.post});

  @override
  State<PostCommentsSheet> createState() => _PostCommentsSheetState();
}

class _PostCommentsSheetState extends State<PostCommentsSheet> {
  final _commentController = TextEditingController();
  bool _isSending = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<FeedProvider>().fetchComments(widget.post.id);
    });
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _sendComment() async {
    final text = _commentController.text.trim();
    if (text.isEmpty) return;

    setState(() => _isSending = true);
    final success = await context.read<FeedProvider>().addComment(
      widget.post.id,
      text,
    );
    setState(() => _isSending = false);

    if (success) {
      _commentController.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final feedProvider = context.watch<FeedProvider>();
    final comments = feedProvider.getComments(widget.post.id);

    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      decoration: const BoxDecoration(
        color: AppColors.elevatedSurface,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppSpacing.radiusLarge),
        ),
      ),
      child: Column(
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 38,
              height: 4,
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              decoration: BoxDecoration(
                color: AppColors.subtleBorder,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${loc.translate('comments')} (${widget.post.commentsCount})',
                  style: AppTypography.titleMedium,
                ),
                IconButton(
                  icon: const Icon(
                    Icons.close,
                    color: AppColors.secondaryText,
                    size: 20,
                  ),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Comments list
          Expanded(
            child: comments.isEmpty
                ? Center(
                    child: Text(
                      loc.languageCode == 'ru'
                          ? 'Комментариев пока нет. Будьте первым!'
                          : (loc.languageCode == 'kk'
                              ? 'Әзірге пікірлер жоқ. Алғашқы болыңыз!'
                              : 'No comments yet. Start the conversation!'),
                      style: AppTypography.bodyMedium,
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: comments.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final c = comments[index];
                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          AppAvatar(name: c.authorName, radius: 16),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      c.authorName,
                                      style: AppTypography.titleMedium.copyWith(
                                        fontSize: 13,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      DateFormat(
                                        'dd.MM, HH:mm',
                                      ).format(c.createdAt),
                                      style: AppTypography.labelSmall,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  c.content,
                                  style: AppTypography.bodyMedium,
                                ),
                              ],
                            ),
                          ),
                        ],
                      );
                    },
                  ),
          ),

          // Bottom comment input bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: const BoxDecoration(
              color: AppColors.primaryBackground,
              border: Border(top: BorderSide(color: AppColors.subtleBorder)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _commentController,
                    style: AppTypography.bodyMedium,
                    decoration: InputDecoration(
                      hintText: loc.languageCode == 'ru'
                          ? 'Написать комментарий...'
                          : 'Add a comment...',
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 10,
                      ),
                    ),
                    onSubmitted: (_) => _sendComment(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: _isSending
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: AppColors.primaryAccent,
                          ),
                        )
                      : const Icon(
                          Icons.send_rounded,
                          color: AppColors.primaryAccent,
                        ),
                  onPressed: _isSending ? null : _sendComment,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
