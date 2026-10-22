import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_avatar.dart';
import '../../social/screens/notifications_screen.dart';
import '../../social/state/social_provider.dart';
import '../models/post_model.dart';
import '../state/feed_provider.dart';
import 'create_post_screen.dart';
import 'post_comments_sheet.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final Map<String, bool> _likedAnimations = {};

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<FeedProvider>().fetchFeed();
    });
  }

  void _openCreatePost() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (_) => const CreatePostScreen()),
    );
  }

  void _openComments(PostModel post) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => PostCommentsSheet(post: post),
    );
  }

  void _onDoubleTapPhoto(String postId) {
    setState(() {
      _likedAnimations[postId] = true;
    });
    final feed = context.read<FeedProvider>();
    final post = feed.posts.firstWhere((p) => p.id == postId);
    if (!post.hasLiked) {
      feed.toggleLike(postId);
    }
    Future.delayed(const Duration(milliseconds: 700), () {
      if (mounted) {
        setState(() {
          _likedAnimations[postId] = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final feed = context.watch<FeedProvider>();
    final social = context.watch<SocialProvider>();
    final posts = feed.posts;

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppColors.primary.withAlpha(40),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.waves, color: AppColors.primary, size: 20),
            ),
            const SizedBox(width: 10),
            Text(
              loc.translate('communityFeed'),
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: loc.translate('notifications'),
            icon: Badge(
              isLabelVisible: social.unreadNotificationsCount > 0,
              label: Text('${social.unreadNotificationsCount}'),
              child: const Icon(Icons.notifications_outlined),
            ),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => const NotificationsScreen(),
                ),
              );
            },
          ),
          IconButton(
            tooltip: 'Refresh',
            icon: const Icon(Icons.refresh),
            onPressed: () => feed.fetchFeed(),
          ),
        ],
      ),
      body: feed.isLoading && posts.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : feed.errorMessage != null && posts.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.error_outline,
                        color: AppColors.error,
                        size: 48,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        feed.errorMessage!,
                        style: const TextStyle(color: AppColors.textSecondary),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () => feed.fetchFeed(),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : posts.isEmpty
                  ? Center(
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.phishing,
                              size: 72,
                              color: AppColors.textMuted,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              loc.translate('feedEmptyTitle'),
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Padding(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 32),
                              child: Text(
                                loc.translate('feedEmptyDesc'),
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                            const SizedBox(height: 20),
                            ElevatedButton.icon(
                              icon: const Icon(Icons.add_photo_alternate),
                              label: Text(loc.translate('newPost')),
                              onPressed: _openCreatePost,
                            ),
                          ],
                        ),
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: () => feed.fetchFeed(),
                      color: AppColors.primary,
                      child: ListView.separated(
                        padding: const EdgeInsets.only(top: 8, bottom: 90),
                        itemCount: posts.length,
                        separatorBuilder: (context, index) =>
                            const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          return _buildModernPostCard(
                            context,
                            loc,
                            posts[index],
                            feed,
                          );
                        },
                      ),
                    ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_a_photo_outlined),
        label: Text(loc.translate('newPost')),
        onPressed: _openCreatePost,
      ),
    );
  }

  Widget _buildModernPostCard(
    BuildContext context,
    AppLocalizations loc,
    PostModel post,
    FeedProvider feed,
  ) {
    final hasMedia = post.mediaUrls.isNotEmpty;
    final isHeartAnimating = _likedAnimations[post.id] == true;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        border: Border.symmetric(
          horizontal: BorderSide(
            color: AppColors.subtleBorder.withAlpha(50),
            width: 0.5,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Author Header
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 12, 14, 10),
            child: Row(
              children: [
                // Avatar with modern gradient ring
                Container(
                  padding: const EdgeInsets.all(2),
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [AppColors.primary, Color(0xFF00D2FF)],
                    ),
                  ),
                  child: AppAvatar(
                    name: post.authorName,
                    imageUrl: post.authorAvatar,
                    radius: 18,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        post.authorName,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 14,
                          color: Colors.white,
                        ),
                      ),
                      Row(
                        children: [
                          Text(
                            DateFormat('dd.MM • HH:mm').format(post.createdAt),
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textMuted,
                            ),
                          ),
                          if (post.spotName != null &&
                              post.spotName!.isNotEmpty) ...[
                            const SizedBox(width: 6),
                            const Text('•',
                                style: TextStyle(
                                    color: AppColors.textMuted, fontSize: 10)),
                            const SizedBox(width: 6),
                            const Icon(
                              Icons.location_on,
                              size: 11,
                              color: AppColors.primary,
                            ),
                            const SizedBox(width: 2),
                            Flexible(
                              child: Text(
                                post.spotName!,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w500,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.more_horiz,
                      color: AppColors.textSecondary, size: 20),
                  onPressed: () {
                    _showPostOptions(context, loc, post);
                  },
                ),
              ],
            ),
          ),

          // Post Media (Photo) or Stylized Fishing Banner
          GestureDetector(
            onDoubleTap: () => _onDoubleTapPhoto(post.id),
            child: Stack(
              alignment: Alignment.center,
              children: [
                if (hasMedia)
                  AspectRatio(
                    aspectRatio: 4 / 3,
                    child: Image.network(
                      post.mediaUrls.first,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          _buildPlaceholderPhoto(),
                      loadingBuilder: (context, child, progress) {
                        if (progress == null) return child;
                        return Container(
                          color: AppColors.surface,
                          child: const Center(
                            child: CircularProgressIndicator(strokeWidth: 2),
                          ),
                        );
                      },
                    ),
                  )
                else
                  _buildContentCard(post),

                // Animated double-tap heart
                if (isHeartAnimating)
                  AnimatedScale(
                    scale: isHeartAnimating ? 1.3 : 0.0,
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.elasticOut,
                    child: const Icon(
                      Icons.favorite,
                      size: 90,
                      color: Colors.white,
                    ),
                  ),
              ],
            ),
          ),

          // Engagement bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            child: Row(
              children: [
                // Like Button
                IconButton(
                  icon: Icon(
                    post.hasLiked ? Icons.favorite : Icons.favorite_border,
                    color: post.hasLiked ? Colors.redAccent : Colors.white,
                    size: 24,
                  ),
                  onPressed: () => feed.toggleLike(post.id),
                ),
                Text(
                  '${post.likesCount}',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: post.hasLiked ? Colors.redAccent : Colors.white,
                  ),
                ),
                const SizedBox(width: 14),

                // Comment Button
                IconButton(
                  icon: const Icon(
                    Icons.chat_bubble_outline,
                    color: Colors.white,
                    size: 22,
                  ),
                  onPressed: () => _openComments(post),
                ),
                Text(
                  '${post.commentsCount}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(width: 14),

                // Share Button
                IconButton(
                  icon: const Icon(
                    Icons.share_outlined,
                    color: Colors.white,
                    size: 22,
                  ),
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: post.content));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          loc.languageCode == 'ru'
                              ? 'Текст публикации скопирован!'
                              : 'Post text copied!',
                        ),
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  },
                ),
                const Spacer(),

                // Save / Bookmark Icon
                IconButton(
                  icon: const Icon(
                    Icons.bookmark_border,
                    color: Colors.white,
                    size: 22,
                  ),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          loc.languageCode == 'ru'
                              ? 'Сохранено в закладки'
                              : 'Saved to bookmarks',
                        ),
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),

          // Post Caption
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 0, 14, 12),
            child: RichText(
              text: TextSpan(
                style: const TextStyle(color: Colors.white, fontSize: 14),
                children: [
                  TextSpan(
                    text: '${post.authorName} ',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  TextSpan(text: post.content),
                ],
              ),
            ),
          ),

          // Comments sheet trigger link
          if (post.commentsCount > 0)
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 12),
              child: GestureDetector(
                onTap: () => _openComments(post),
                child: Text(
                  loc.languageCode == 'ru'
                      ? 'Посмотреть все комментарии (${post.commentsCount})'
                      : (loc.languageCode == 'kk'
                          ? 'Барлық пікірлерді көру (${post.commentsCount})'
                          : 'View all ${post.commentsCount} comments'),
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 13,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildContentCard(PostModel post) {
    return Container(
      width: double.infinity,
      constraints: const BoxConstraints(minHeight: 140),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.surface,
            AppColors.cardBackground,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Center(
        child: Text(
          post.content,
          style: const TextStyle(
            fontSize: 16,
            height: 1.4,
            color: Colors.white,
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  Widget _buildPlaceholderPhoto() {
    return Container(
      color: AppColors.surface,
      child: const Center(
        child: Icon(Icons.phishing, size: 48, color: AppColors.primary),
      ),
    );
  }

  void _showPostOptions(
    BuildContext context,
    AppLocalizations loc,
    PostModel post,
  ) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.cardBackground,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.share, color: Colors.white),
              title: Text(loc.translate('share')),
              onTap: () {
                Navigator.of(ctx).pop();
                Clipboard.setData(ClipboardData(text: post.content));
              },
            ),
            ListTile(
              leading: const Icon(Icons.copy, color: Colors.white),
              title: Text(loc.languageCode == 'ru' ? 'Скопировать текст' : 'Copy text'),
              onTap: () {
                Navigator.of(ctx).pop();
                Clipboard.setData(ClipboardData(text: post.content));
              },
            ),
          ],
        ),
      ),
    );
  }
}
