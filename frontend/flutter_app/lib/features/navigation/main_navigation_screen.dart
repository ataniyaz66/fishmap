import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../core/localization/app_localizations.dart';
import '../../core/theme/app_colors.dart';
import '../ai/screens/ai_assistant_screen.dart';
import '../chat/screens/conversations_screen.dart';
import '../chat/state/chat_provider.dart';
import '../feed/screens/create_post_screen.dart';
import '../feed/screens/feed_screen.dart';
import '../inventory/screens/inventory_screen.dart';
import '../journal/screens/journal_screen.dart';
import '../map/screens/map_screen.dart';
import '../profile/screens/profile_screen.dart';
import '../profile/screens/settings_screen.dart';
import '../social/screens/discover_screen.dart';
import '../social/screens/notifications_screen.dart';
import '../social/state/social_provider.dart';
import '../weather/screens/weather_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  void _navigateToTab(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final social = context.watch<SocialProvider>();
    final chat = context.watch<ChatProvider>();

    // Primary screens: 0: Feed, 1: Map, 2: Anglers/Discover, 3: Messages, 4: Profile, 5: Journal, 6: Tackle
    final screens = [
      const FeedScreen(),
      MapScreen(onNavigateToJournal: () => _navigateToTab(5)),
      const DiscoverScreen(),
      const ConversationsScreen(),
      const ProfileScreen(),
      const JournalScreen(),
      const InventoryScreen(),
    ];

    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth >= 900;

        if (isDesktop) {
          return Scaffold(
            body: Row(
              children: [
                // Modern Desktop Sidebar
                _buildSidebar(context, loc, social, chat),
                const VerticalDivider(
                  width: 1,
                  thickness: 1,
                  color: AppColors.subtleBorder,
                ),
                Expanded(
                  child: IndexedStack(
                    index: _currentIndex,
                    children: screens,
                  ),
                ),
              ],
            ),
          );
        }

        // Mobile Layout: Bottom Navigation Bar (5 tabs)
        return Scaffold(
          body: IndexedStack(
            index: _currentIndex > 4 ? 0 : _currentIndex,
            children: screens.sublist(0, 5),
          ),
          bottomNavigationBar: Container(
            decoration: const BoxDecoration(
              border: Border(
                top: BorderSide(color: AppColors.subtleBorder, width: 1.0),
              ),
            ),
            child: BottomNavigationBar(
              currentIndex: _currentIndex > 4 ? 0 : _currentIndex,
              onTap: _navigateToTab,
              type: BottomNavigationBarType.fixed,
              backgroundColor: AppColors.cardBackground,
              selectedItemColor: AppColors.primary,
              unselectedItemColor: AppColors.textSecondary,
              selectedFontSize: 11,
              unselectedFontSize: 11,
              items: [
                BottomNavigationBarItem(
                  icon: const Icon(Icons.dynamic_feed_outlined),
                  activeIcon: const Icon(Icons.dynamic_feed),
                  label: loc.translate('feed'),
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.map_outlined),
                  activeIcon: const Icon(Icons.map),
                  label: loc.translate('map'),
                ),
                BottomNavigationBarItem(
                  icon: Badge(
                    isLabelVisible: social.pendingRequests.isNotEmpty,
                    label: Text('${social.pendingRequests.length}'),
                    child: const Icon(Icons.people_outline),
                  ),
                  activeIcon: Badge(
                    isLabelVisible: social.pendingRequests.isNotEmpty,
                    label: Text('${social.pendingRequests.length}'),
                    child: const Icon(Icons.people),
                  ),
                  label: loc.translate('anglers'),
                ),
                BottomNavigationBarItem(
                  icon: Badge(
                    isLabelVisible: chat.unreadTotal > 0,
                    label: Text('${chat.unreadTotal}'),
                    child: const Icon(Icons.chat_bubble_outline),
                  ),
                  activeIcon: Badge(
                    isLabelVisible: chat.unreadTotal > 0,
                    label: Text('${chat.unreadTotal}'),
                    child: const Icon(Icons.chat_bubble),
                  ),
                  label: loc.translate('messages'),
                ),
                BottomNavigationBarItem(
                  icon: const Icon(Icons.person_outline),
                  activeIcon: const Icon(Icons.person),
                  label: loc.translate('profile'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildSidebar(
    BuildContext context,
    AppLocalizations loc,
    SocialProvider social,
    ChatProvider chat,
  ) {
    return Container(
      width: 240,
      color: AppColors.cardBackground,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // App Logo Header
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 24, 20, 16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withAlpha(40),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.waves,
                    color: AppColors.primary,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                const Text(
                  'FishMap',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.5,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),

          // "+ New Post" Action Button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(42),
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              icon: const Icon(Icons.add_photo_alternate_outlined, size: 18),
              label: Text(
                loc.translate('newPost'),
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const CreatePostScreen()),
                );
              },
            ),
          ),
          const SizedBox(height: 8),

          // Primary Navigation Links
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              children: [
                _buildSidebarItem(
                  index: 0,
                  icon: Icons.dynamic_feed_outlined,
                  activeIcon: Icons.dynamic_feed,
                  label: loc.translate('feed'),
                ),
                _buildSidebarItem(
                  index: 1,
                  icon: Icons.map_outlined,
                  activeIcon: Icons.map,
                  label: loc.translate('map'),
                ),
                _buildSidebarItem(
                  index: 2,
                  icon: Icons.people_outline,
                  activeIcon: Icons.people,
                  label: loc.translate('anglers'),
                  badgeCount: social.pendingRequests.length,
                ),
                _buildSidebarItem(
                  index: 3,
                  icon: Icons.chat_bubble_outline,
                  activeIcon: Icons.chat_bubble,
                  label: loc.translate('messages'),
                  badgeCount: chat.unreadTotal,
                ),
                _buildSidebarItem(
                  index: 4,
                  icon: Icons.person_outline,
                  activeIcon: Icons.person,
                  label: loc.translate('profile'),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Divider(color: AppColors.subtleBorder, height: 1),
                ),
                _buildSidebarItem(
                  index: 5,
                  icon: Icons.phishing_outlined,
                  activeIcon: Icons.phishing,
                  label: loc.translate('journal'),
                ),
                _buildSidebarItem(
                  index: 6,
                  icon: Icons.inventory_2_outlined,
                  activeIcon: Icons.inventory_2,
                  label: loc.translate('tackle'),
                ),
                _buildSidebarAction(
                  icon: Icons.cloud_outlined,
                  label: loc.translate('weather'),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const WeatherScreen()),
                    );
                  },
                ),
                _buildSidebarAction(
                  icon: Icons.auto_awesome,
                  label: loc.translate('aiAdvisor'),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const AiAssistantScreen(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),

          // Bottom Bar Actions (Notifications & Settings)
          const Divider(color: AppColors.subtleBorder, height: 1),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                IconButton(
                  tooltip: loc.translate('notifications'),
                  icon: Badge(
                    isLabelVisible: social.unreadNotificationsCount > 0,
                    label: Text('${social.unreadNotificationsCount}'),
                    child: const Icon(Icons.notifications_none),
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
                  tooltip: loc.translate('settings'),
                  icon: const Icon(Icons.settings_outlined),
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const SettingsScreen(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSidebarItem({
    required int index,
    required IconData icon,
    required IconData activeIcon,
    required String label,
    int badgeCount = 0,
  }) {
    final isSelected = _currentIndex == index;
    return InkWell(
      onTap: () => _navigateToTab(index),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withAlpha(35) : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Icon(
              isSelected ? activeIcon : icon,
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                  color: isSelected ? Colors.white : AppColors.textSecondary,
                ),
              ),
            ),
            if (badgeCount > 0)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.accent,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '$badgeCount',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSidebarAction({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          children: [
            Icon(icon, color: AppColors.textSecondary, size: 20),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
