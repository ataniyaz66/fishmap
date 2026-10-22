import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/widgets/app_avatar.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_card.dart';
import '../../ai/screens/ai_assistant_screen.dart';
import '../../auth/state/auth_provider.dart';
import '../../chat/screens/conversations_screen.dart';
import '../../journal/state/journal_provider.dart';
import '../../map/state/map_provider.dart';
import '../../social/state/social_provider.dart';
import '../../weather/screens/weather_screen.dart';
import '../models/user_profile.dart';
import '../state/profile_provider.dart';
import 'edit_profile_screen.dart';
import 'settings_screen.dart';

class ProfileScreen extends StatefulWidget {
  final String? userId;

  const ProfileScreen({super.key, this.userId});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  UserProfile? _otherProfile;
  bool _isLoadingOther = false;

  bool get _isSelf {
    final currentUserId = context.read<AuthProvider>().currentUser?.id;
    return widget.userId == null ||
        widget.userId!.isEmpty ||
        widget.userId == currentUserId;
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_isSelf) {
        context.read<ProfileProvider>().fetchProfile();
        context.read<JournalProvider>().fetchCatches();
        context.read<MapProvider>().fetchSpots();
        context.read<SocialProvider>().fetchFriends();
      } else {
        _loadOtherProfile();
      }
    });
  }

  Future<void> _loadOtherProfile() async {
    if (widget.userId == null) return;
    setState(() => _isLoadingOther = true);
    final profile =
        await context.read<ProfileProvider>().fetchUserProfile(widget.userId!);
    if (mounted) {
      setState(() {
        _otherProfile = profile;
        _isLoadingOther = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final auth = context.watch<AuthProvider>();
    final profileProvider = context.watch<ProfileProvider>();
    final journal = context.watch<JournalProvider>();
    final mapProv = context.watch<MapProvider>();
    final social = context.watch<SocialProvider>();

    final user = auth.currentUser;
    final isSelf = _isSelf;

    final profile = isSelf ? profileProvider.profile : _otherProfile;
    final displayName =
        (profile?.displayName != null && profile!.displayName!.isNotEmpty)
            ? profile.displayName!
            : (isSelf ? (user?.username ?? 'Angler') : 'Angler');

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        title: Text(isSelf ? loc.translate('profile') : displayName),
        actions: [
          if (isSelf)
            IconButton(
              icon: const Icon(Icons.settings_outlined),
              tooltip: loc.translate('settings'),
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const SettingsScreen()),
                );
              },
            ),
        ],
      ),
      body: _isLoadingOther || (isSelf && profileProvider.isLoading && profile == null)
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () async {
                if (isSelf) {
                  await profileProvider.fetchProfile();
                  await social.fetchFriends();
                } else {
                  await _loadOtherProfile();
                }
              },
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Profile Header Card
                  AppCard(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        AppAvatar(
                          name: displayName,
                          imageUrl: profile?.avatarUrl,
                          radius: 44,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          displayName,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        if (isSelf &&
                            user?.username != null &&
                            user!.username != displayName) ...[
                          const SizedBox(height: 2),
                          Text(
                            '@${user.username}',
                            style: const TextStyle(
                              color: AppColors.textSecondary,
                              fontSize: 14,
                            ),
                          ),
                        ],
                        const SizedBox(height: 10),

                        // Badges Row
                        Wrap(
                          spacing: 8,
                          alignment: WrapAlignment.center,
                          children: [
                            AppBadge(
                              label: (profile?.experienceLevel ??
                                      'intermediate')
                                  .toUpperCase(),
                              color: AppColors.primary,
                              icon: Icons.military_tech_outlined,
                            ),
                            if (profile?.location != null &&
                                profile!.location!.isNotEmpty)
                              AppBadge(
                                label: profile.location!,
                                color: AppColors.surface,
                                textColor: Colors.white,
                                icon: Icons.location_on_outlined,
                              ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Social Stats Row
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 12,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.surface.withAlpha(50),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              _buildStatItem(
                                '${journal.catches.length}',
                                loc.translate('catchesCount'),
                              ),
                              _buildStatDivider(),
                              _buildStatItem(
                                '${mapProv.spots.length}',
                                loc.languageCode == 'ru'
                                    ? 'Точек'
                                    : (loc.languageCode == 'kk'
                                        ? 'Орындар'
                                        : 'Spots'),
                              ),
                              _buildStatDivider(),
                              _buildStatItem(
                                '${social.friendIds.length}',
                                loc.translate('friendsCount'),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Action Buttons: Edit if self, or Friend/Message if other
                        if (isSelf)
                          OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              minimumSize: const Size.fromHeight(40),
                            ),
                            icon: const Icon(Icons.edit_outlined, size: 16),
                            label: Text(loc.translate('editProfile')),
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) =>
                                      EditProfileScreen(profile: profile),
                                ),
                              );
                            },
                          )
                        else
                          _buildOtherUserActions(context, loc, social),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Bio Card
                  if (profile?.bio != null && profile!.bio!.isNotEmpty) ...[
                    AppCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            loc.languageCode == 'ru'
                                ? 'О себе'
                                : (loc.languageCode == 'kk'
                                    ? 'Өзім туралы'
                                    : 'About Me'),
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            profile.bio!,
                            style: const TextStyle(
                              fontSize: 14,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Favorite Species Card
                  if (profile != null && profile.favoriteSpecies.isNotEmpty) ...[
                    AppCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            loc.languageCode == 'ru'
                                ? 'Любимые виды рыб'
                                : (loc.languageCode == 'kk'
                                    ? 'Сүйікті балық түрлері'
                                    : 'Favorite Species'),
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: profile.favoriteSpecies.map((s) {
                              return Chip(
                                backgroundColor: AppColors.surface,
                                label: Text(
                                  s,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: Colors.white,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Quick Feature Hub (if self)
                  if (isSelf) ...[
                    Text(
                      loc.languageCode == 'ru'
                          ? 'Сервисы и инструменты'
                          : (loc.languageCode == 'kk'
                              ? 'Құралдар мен қызметтер'
                              : 'Angler Hub'),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 10),
                    _buildFeatureTile(
                      icon: Icons.auto_awesome,
                      iconColor: AppColors.primary,
                      title: loc.translate('aiAdvisor'),
                      subtitle: loc.languageCode == 'ru'
                          ? 'Умный подбор приманок и тактики'
                          : (loc.languageCode == 'kk'
                              ? 'Ақылды жем таңдау және тактика'
                              : 'Tactical advice & lure matching'),
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => const AiAssistantScreen(),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 10),
                    _buildFeatureTile(
                      icon: Icons.cloud_outlined,
                      iconColor: Colors.amber,
                      title: loc.translate('marineWeather'),
                      subtitle: loc.languageCode == 'ru'
                          ? 'Давление, ветер и прогноз клёва'
                          : (loc.languageCode == 'kk'
                              ? 'Қысым, жел және ауа райы'
                              : 'Pressure, wind & bite forecast'),
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => const WeatherScreen(),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 10),
                    _buildFeatureTile(
                      icon: Icons.chat_bubble_outline,
                      iconColor: Colors.tealAccent,
                      title: loc.translate('messages'),
                      subtitle: loc.languageCode == 'ru'
                          ? 'Диалоги с рыболовами'
                          : (loc.languageCode == 'kk'
                              ? 'Балықшылармен сұхбат'
                              : 'Direct conversations'),
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => const ConversationsScreen(),
                          ),
                        );
                      },
                    ),
                  ],
                ],
              ),
            ),
    );
  }

  Widget _buildOtherUserActions(
    BuildContext context,
    AppLocalizations loc,
    SocialProvider social,
  ) {
    final targetId = widget.userId ?? '';
    final isFriend = social.isFriend(targetId);

    return Row(
      children: [
        Expanded(
          child: isFriend
              ? OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.success),
                  ),
                  icon: const Icon(Icons.check, color: AppColors.success, size: 16),
                  label: Text(
                    loc.translate('friends'),
                    style: const TextStyle(color: AppColors.success),
                  ),
                  onPressed: () {
                    social.removeFriend(targetId);
                  },
                )
              : ElevatedButton.icon(
                  icon: const Icon(Icons.person_add, size: 16),
                  label: Text(loc.translate('addFriend')),
                  onPressed: () async {
                    final ok = await social.sendFriendRequest(targetId);
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            ok
                                ? loc.translate('requestSent')
                                : (social.errorMessage ?? 'Failed'),
                          ),
                        ),
                      );
                    }
                  },
                ),
        ),
        const SizedBox(width: 10),
        IconButton.filledTonal(
          icon: const Icon(Icons.message_outlined),
          tooltip: loc.translate('messages'),
          onPressed: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => const ConversationsScreen()),
            );
          },
        ),
      ],
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildStatDivider() {
    return Container(
      width: 1,
      height: 28,
      color: AppColors.subtleBorder,
    );
  }

  Widget _buildFeatureTile({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return AppCard(
      onTap: onTap,
      child: ListTile(
        contentPadding: EdgeInsets.zero,
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: iconColor.withAlpha(35),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: iconColor, size: 22),
        ),
        title: Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 15,
            color: Colors.white,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(
            fontSize: 12,
            color: AppColors.textSecondary,
          ),
        ),
        trailing: const Icon(
          Icons.chevron_right,
          color: AppColors.textSecondary,
        ),
      ),
    );
  }
}
