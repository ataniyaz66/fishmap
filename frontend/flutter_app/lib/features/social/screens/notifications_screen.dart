import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../models/notification_model.dart';
import '../state/social_provider.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<SocialProvider>().fetchNotifications();
    });
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final social = context.watch<SocialProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.translate('notifications')),
        actions: [
          if (social.notifications.any((n) => !n.read))
            TextButton(
              onPressed: () {
                social.markAllNotificationsRead();
              },
              child: Text(
                loc.languageCode == 'ru'
                    ? 'Прочитать все'
                    : (loc.languageCode == 'kk' ? 'Бәрін оқу' : 'Mark all read'),
                style: const TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                ),
              ),
            ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => social.fetchNotifications(),
        child: social.isLoadingNotifications
            ? const Center(child: CircularProgressIndicator())
            : social.notifications.isEmpty
                ? Center(
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            Icons.notifications_none,
                            size: 64,
                            color: AppColors.textMuted,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            loc.languageCode == 'ru'
                                ? 'Нет новых уведомлений'
                                : (loc.languageCode == 'kk'
                                    ? 'Жаңа хабарламалар жоқ'
                                    : 'No new notifications'),
                            style: const TextStyle(
                              color: AppColors.textSecondary,
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    itemCount: social.notifications.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final item = social.notifications[index];
                      return _buildNotificationCard(
                        context,
                        loc,
                        social,
                        item,
                      );
                    },
                  ),
      ),
    );
  }

  Widget _buildNotificationCard(
    BuildContext context,
    AppLocalizations loc,
    SocialProvider social,
    NotificationModel item,
  ) {
    IconData icon;
    Color iconColor;
    String title;

    switch (item.type) {
      case 'like':
        icon = Icons.favorite;
        iconColor = Colors.redAccent;
        title = loc.languageCode == 'ru'
            ? 'Вашу публикацию оценили'
            : (loc.languageCode == 'kk'
                ? 'Жазбаңызға баға берілді'
                : 'Liked your post');
        break;
      case 'comment':
        icon = Icons.chat_bubble;
        iconColor = AppColors.primary;
        title = loc.languageCode == 'ru'
            ? 'Новый комментарий к записи'
            : (loc.languageCode == 'kk'
                ? 'Жазбаңызға жаңа пікір'
                : 'New comment on your post');
        break;
      case 'friend_request':
        icon = Icons.person_add;
        iconColor = AppColors.success;
        title = loc.languageCode == 'ru'
            ? 'Новая заявка в друзья'
            : (loc.languageCode == 'kk'
                ? 'Жаңа дос сұранысы'
                : 'New friend request');
        break;
      case 'friend_accept':
        icon = Icons.check_circle;
        iconColor = Colors.amber;
        title = loc.languageCode == 'ru'
            ? 'Заявка в друзья принята'
            : (loc.languageCode == 'kk'
                ? 'Дос сұранысы қабылданды'
                : 'Friend request accepted');
        break;
      default:
        icon = Icons.notifications;
        iconColor = AppColors.primary;
        title = loc.translate('notifications');
    }

    final timeString =
        '${item.createdAt.hour.toString().padLeft(2, '0')}:${item.createdAt.minute.toString().padLeft(2, '0')}';

    return InkWell(
      onTap: () {
        if (!item.read) {
          social.markNotificationRead(item.id);
        }
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: item.read
              ? AppColors.cardBackground
              : AppColors.primary.withAlpha(20),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: item.read
                ? AppColors.subtleBorder
                : AppColors.primary.withAlpha(80),
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconColor.withAlpha(30),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontWeight:
                          item.read ? FontWeight.normal : FontWeight.w600,
                      color: Colors.white,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    timeString,
                    style: const TextStyle(
                      color: AppColors.textMuted,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
            if (!item.read)
              Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
