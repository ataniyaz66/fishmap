import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../profile/screens/profile_screen.dart';
import '../models/friend_request_model.dart';
import '../models/user_summary.dart';
import '../state/social_provider.dart';

class DiscoverScreen extends StatefulWidget {
  const DiscoverScreen({super.key});

  @override
  State<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends State<DiscoverScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final social = context.read<SocialProvider>();
      social.fetchFriends();
      social.fetchPendingRequests();
      // Load initial suggestions
      social.searchAnglers('');
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String val) {
    context.read<SocialProvider>().searchAnglers(val);
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final social = context.watch<SocialProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(loc.translate('anglers')),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primary,
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: AppColors.textSecondary,
          tabs: [
            Tab(text: loc.translate('searchAnglers')),
            Tab(
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(loc.translate('friendRequests')),
                  if (social.pendingRequests.isNotEmpty) ...[
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.accent,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '${social.pendingRequests.length}',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Tab 1: Search & Suggestions
          _buildSearchTab(context, loc, social),

          // Tab 2: Incoming Friend Requests
          _buildRequestsTab(context, loc, social),
        ],
      ),
    );
  }

  Widget _buildSearchTab(
    BuildContext context,
    AppLocalizations loc,
    SocialProvider social,
  ) {
    return Column(
      children: [
        // Search Input Bar
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: TextField(
            controller: _searchController,
            onChanged: _onSearchChanged,
            decoration: InputDecoration(
              hintText: loc.translate('searchAnglers'),
              prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear, size: 20),
                      onPressed: () {
                        _searchController.clear();
                        _onSearchChanged('');
                      },
                    )
                  : null,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 12,
              ),
            ),
          ),
        ),

        // Angler Results List
        Expanded(
          child: RefreshIndicator(
            onRefresh: () async {
              await social.fetchFriends();
              await social.searchAnglers(_searchController.text);
            },
            child: _buildResultsList(context, loc, social),
          ),
        ),
      ],
    );
  }

  Widget _buildResultsList(
    BuildContext context,
    AppLocalizations loc,
    SocialProvider social,
  ) {
    if (social.isSearching) {
      return const Center(child: CircularProgressIndicator());
    }

    if (social.searchResults.isEmpty) {
      return Center(
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.people_outline,
                size: 64,
                color: AppColors.textMuted,
              ),
              const SizedBox(height: 16),
              Text(
                loc.translate('noAnglersFound'),
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 16,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: social.searchResults.length,
      separatorBuilder: (context, index) => const SizedBox(height: 10),
      itemBuilder: (context, index) {
        final user = social.searchResults[index];
        return _buildAnglerCard(context, loc, social, user);
      },
    );
  }

  Widget _buildAnglerCard(
    BuildContext context,
    AppLocalizations loc,
    SocialProvider social,
    UserSummary user,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.subtleBorder),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        leading: CircleAvatar(
          radius: 24,
          backgroundColor: AppColors.primary.withAlpha(50),
          backgroundImage: user.avatarUrl != null && user.avatarUrl!.isNotEmpty
              ? NetworkImage(user.avatarUrl!)
              : null,
          child: user.avatarUrl == null || user.avatarUrl!.isEmpty
              ? Text(
                  user.displayName.isNotEmpty
                      ? user.displayName[0].toUpperCase()
                      : '?',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                    fontSize: 18,
                  ),
                )
              : null,
        ),
        title: Text(
          user.displayName,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 15,
            color: Colors.white,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (user.location != null && user.location!.isNotEmpty) ...[
              const SizedBox(height: 2),
              Row(
                children: [
                  const Icon(
                    Icons.location_on_outlined,
                    size: 13,
                    color: AppColors.textSecondary,
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      user.location!,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ],
            if (user.bio != null && user.bio!.isNotEmpty) ...[
              const SizedBox(height: 2),
              Text(
                user.bio!,
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textMuted,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ],
        ),
        trailing: _buildRelationshipButton(context, loc, social, user),
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => ProfileScreen(userId: user.authUserId),
            ),
          );
        },
      ),
    );
  }

  Widget _buildRelationshipButton(
    BuildContext context,
    AppLocalizations loc,
    SocialProvider social,
    UserSummary user,
  ) {
    if (user.relationshipStatus == 'self') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(8),
        ),
        child: const Text(
          'Вы',
          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
        ),
      );
    }

    if (user.relationshipStatus == 'friends') {
      return OutlinedButton.icon(
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          minimumSize: const Size(0, 32),
          side: const BorderSide(color: AppColors.success),
        ),
        icon: const Icon(Icons.check, size: 14, color: AppColors.success),
        label: Text(
          loc.translate('friends'),
          style: const TextStyle(fontSize: 12, color: AppColors.success),
        ),
        onPressed: () {
          _confirmRemoveFriend(context, loc, social, user);
        },
      );
    }

    if (user.relationshipStatus == 'pending_sent') {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppColors.subtleBorder),
        ),
        child: Text(
          loc.translate('requestSent'),
          style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
        ),
      );
    }

    // Default: Not friends -> show "+ Add Friend"
    return ElevatedButton.icon(
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        minimumSize: const Size(0, 32),
      ),
      icon: const Icon(Icons.person_add, size: 14),
      label: Text(
        loc.translate('addFriend'),
        style: const TextStyle(fontSize: 12),
      ),
      onPressed: () async {
        final success = await social.sendFriendRequest(user.authUserId);
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                success
                    ? loc.translate('requestSent')
                    : (social.errorMessage ?? 'Error'),
              ),
              backgroundColor: success ? AppColors.surface : AppColors.error,
              duration: const Duration(seconds: 2),
            ),
          );
        }
      },
    );
  }

  void _confirmRemoveFriend(
    BuildContext context,
    AppLocalizations loc,
    SocialProvider social,
    UserSummary user,
  ) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(loc.translate('removeFriend')),
        content: Text('${loc.translate('removeFriend')} ${user.displayName}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text(loc.translate('cancel')),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
            ),
            onPressed: () {
              Navigator.of(ctx).pop();
              social.removeFriend(user.authUserId);
            },
            child: Text(loc.translate('removeFriend')),
          ),
        ],
      ),
    );
  }

  Widget _buildRequestsTab(
    BuildContext context,
    AppLocalizations loc,
    SocialProvider social,
  ) {
    return RefreshIndicator(
      onRefresh: () => social.fetchPendingRequests(),
      child: social.isLoadingRequests
          ? const Center(child: CircularProgressIndicator())
          : social.pendingRequests.isEmpty
              ? Center(
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.mail_outline,
                          size: 64,
                          color: AppColors.textMuted,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          loc.translate('noFriendRequests'),
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
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  itemCount: social.pendingRequests.length,
                  separatorBuilder: (context, index) =>
                      const SizedBox(height: 10),
                  itemBuilder: (context, index) {
                    final req = social.pendingRequests[index];
                    return _buildRequestCard(context, loc, social, req);
                  },
                ),
    );
  }

  Widget _buildRequestCard(
    BuildContext context,
    AppLocalizations loc,
    SocialProvider social,
    FriendRequestModel req,
  ) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.subtleBorder),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: AppColors.primary.withAlpha(50),
            child: const Icon(Icons.person, color: AppColors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${loc.translate('anglers')}: ${req.requesterId.length > 8 ? req.requesterId.substring(0, 8) : req.requesterId}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  loc.translate('incomingRequest'),
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            tooltip: loc.translate('decline'),
            icon: const Icon(Icons.close, color: AppColors.error),
            onPressed: () {
              social.declineFriendRequest(req.id);
            },
          ),
          const SizedBox(width: 4),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              minimumSize: const Size(0, 36),
            ),
            onPressed: () {
              social.acceptFriendRequest(
                req.id,
                requesterId: req.requesterId,
              );
            },
            child: Text(
              loc.translate('accept'),
              style: const TextStyle(fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }
}
