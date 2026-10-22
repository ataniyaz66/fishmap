import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import '../../../core/localization/app_localizations.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/app_badge.dart';
import '../../../core/widgets/app_empty_state.dart';
import '../../../core/widgets/app_error_view.dart';
import '../../../core/widgets/app_loading_indicator.dart';
import '../models/fishing_spot.dart';
import '../state/map_provider.dart';
import 'create_spot_dialog.dart';
import 'spot_details_sheet.dart';

class MapScreen extends StatefulWidget {
  final VoidCallback? onNavigateToJournal;

  const MapScreen({super.key, this.onNavigateToJournal});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final MapController _mapController = MapController();
  bool _isListView = false;

  // Default coordinate: Astana, Kazakhstan (51.1694, 71.4491)
  static const LatLng _defaultCenter = LatLng(51.1694, 71.4491);
  double _currentZoom = 11.5;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<MapProvider>().fetchSpots();
    });
  }

  void _showSpotDetails(FishingSpot spot) {
    context.read<MapProvider>().selectSpot(spot);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => SpotDetailsSheet(
        spot: spot,
        onAddCatch: () {
          if (widget.onNavigateToJournal != null) {
            widget.onNavigateToJournal!();
          }
        },
      ),
    );
  }

  void _openCreateSpotDialog([LatLng? location]) {
    final lat = location?.latitude ?? _defaultCenter.latitude;
    final lng = location?.longitude ?? _defaultCenter.longitude;

    showDialog(
      context: context,
      builder: (_) => CreateSpotDialog(initialLat: lat, initialLng: lng),
    );
  }

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    final mapProvider = context.watch<MapProvider>();
    final spots = mapProvider.spots;

    return Scaffold(
      backgroundColor: AppColors.primaryBackground,
      appBar: AppBar(
        title: Text(loc.translate('map')),
        actions: [
          IconButton(
            icon: Icon(
              _isListView ? Icons.map_outlined : Icons.list_alt_outlined,
              color: AppColors.primaryText,
            ),
            tooltip: _isListView ? loc.translate('map') : 'Список',
            onPressed: () => setState(() => _isListView = !_isListView),
          ),
          IconButton(
            icon: const Icon(Icons.refresh, color: AppColors.primaryText),
            tooltip: 'Refresh Spots',
            onPressed: () => mapProvider.fetchSpots(),
          ),
        ],
      ),
      body: Stack(
        children: [
          if (_isListView)
            _buildListView(loc, mapProvider)
          else
            _buildMapView(loc, mapProvider, spots),

          // Top filter bar
          Positioned(
            top: 12,
            left: 16,
            right: 16,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip(loc.translate('allSpots'), 'all', mapProvider),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    loc.translate('freshwater'),
                    'freshwater',
                    mapProvider,
                  ),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    loc.translate('saltwater'),
                    'saltwater',
                    mapProvider,
                  ),
                  const SizedBox(width: 8),
                  _buildFilterChip(
                    loc.translate('brackish'),
                    'brackish',
                    mapProvider,
                  ),
                ],
              ),
            ),
          ),

          // Map Controls (only in map view)
          if (!_isListView) ...[
            Positioned(
              right: 16,
              bottom: 96,
              child: Column(
                children: [
                  _buildMapControlButton(
                    icon: Icons.add,
                    onPressed: () {
                      _currentZoom = (_currentZoom + 1).clamp(3.0, 18.0);
                      _mapController.move(
                        _mapController.camera.center,
                        _currentZoom,
                      );
                    },
                  ),
                  const SizedBox(height: 8),
                  _buildMapControlButton(
                    icon: Icons.remove,
                    onPressed: () {
                      _currentZoom = (_currentZoom - 1).clamp(3.0, 18.0);
                      _mapController.move(
                        _mapController.camera.center,
                        _currentZoom,
                      );
                    },
                  ),
                  const SizedBox(height: 8),
                  _buildMapControlButton(
                    icon: Icons.my_location,
                    onPressed: () {
                      if (spots.isNotEmpty) {
                        _mapController.move(
                          LatLng(spots.first.latitude, spots.first.longitude),
                          13.0,
                        );
                      } else {
                        _mapController.move(_defaultCenter, 11.5);
                      }
                    },
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppColors.primaryAccent,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_location_alt_outlined),
        label: Text(loc.translate('addSpot')),
        onPressed: () => _openCreateSpotDialog(),
      ),
    );
  }

  Widget _buildMapView(
    AppLocalizations loc,
    MapProvider provider,
    List<FishingSpot> spots,
  ) {
    if (provider.isLoading && spots.isEmpty) {
      return const AppLoadingIndicator(message: 'Loading fishing spots...');
    }

    if (provider.errorMessage != null && spots.isEmpty) {
      return AppErrorView(
        message: provider.errorMessage!,
        onRetry: () => provider.fetchSpots(),
      );
    }

    final initialPoint = spots.isNotEmpty
        ? LatLng(spots.first.latitude, spots.first.longitude)
        : _defaultCenter;

    return FlutterMap(
      mapController: _mapController,
      options: MapOptions(
        initialCenter: initialPoint,
        initialZoom: _currentZoom,
        onTap: (_, latLng) => _openCreateSpotDialog(latLng),
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.fishmap',
        ),
        MarkerLayer(
          markers: spots.map((spot) {
            final isSelected = provider.selectedSpot?.id == spot.id;
            final isSalt = spot.waterType.toLowerCase() == 'saltwater';

            return Marker(
              point: LatLng(spot.latitude, spot.longitude),
              width: 44,
              height: 44,
              child: GestureDetector(
                onTap: () => _showSpotDetails(spot),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? Colors.white
                        : (isSalt ? Colors.teal : AppColors.primaryAccent),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected
                          ? AppColors.primaryAccent
                          : Colors.white,
                      width: 2.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.35),
                        blurRadius: 6,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.location_on,
                    size: 24,
                    color: isSelected ? AppColors.primaryAccent : Colors.white,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildListView(AppLocalizations loc, MapProvider provider) {
    if (provider.isLoading) {
      return const AppLoadingIndicator(message: 'Loading fishing spots...');
    }

    if (provider.errorMessage != null) {
      return AppErrorView(
        message: provider.errorMessage!,
        onRetry: () => provider.fetchSpots(),
      );
    }

    final spots = provider.spots;
    if (spots.isEmpty) {
      return AppEmptyState(
        icon: Icons.location_off_outlined,
        title: loc.languageCode == 'ru'
            ? 'Рыболовные точки не найдены'
            : (loc.languageCode == 'kk'
                ? 'Балық аулау орындары табылмады'
                : 'No fishing spots found'),
        description: loc.languageCode == 'ru'
            ? 'Добавьте первую точку на водоёме!'
            : (loc.languageCode == 'kk'
                ? 'Су қоймасында алғашқы орынды қосыңыз!'
                : 'Be the first angler to map a spot in this area!'),
        actionText: loc.translate('addSpot'),
        onAction: () => _openCreateSpotDialog(),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.only(top: 60, bottom: 90, left: 16, right: 16),
      itemCount: spots.length,
      separatorBuilder: (context, index) =>
          const SizedBox(height: AppSpacing.sm),
      itemBuilder: (context, index) {
        final spot = spots[index];
        return Card(
          child: ListTile(
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 8,
            ),
            leading: CircleAvatar(
              backgroundColor: spot.waterType == 'saltwater'
                  ? Colors.teal.withValues(alpha: 0.2)
                  : AppColors.primaryAccent.withValues(alpha: 0.2),
              child: Icon(
                Icons.water,
                color: spot.waterType == 'saltwater'
                    ? Colors.teal
                    : AppColors.primaryAccent,
              ),
            ),
            title: Text(spot.name, style: AppTypography.titleMedium),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text(
                  '${spot.latitude.toStringAsFixed(3)}, ${spot.longitude.toStringAsFixed(3)}',
                  style: AppTypography.labelSmall,
                ),
                if (spot.targetSpecies.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    'Species: ${spot.targetSpecies.join(", ")}',
                    style: AppTypography.bodyMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ],
            ),
            trailing: AppBadge(
              label: spot.waterType.toUpperCase(),
              color: spot.waterType == 'saltwater'
                  ? Colors.teal
                  : AppColors.primaryAccent,
            ),
            onTap: () => _showSpotDetails(spot),
          ),
        );
      },
    );
  }

  Widget _buildFilterChip(String label, String value, MapProvider provider) {
    final isSelected = provider.waterTypeFilter == value;
    return GestureDetector(
      onTap: () => provider.setWaterTypeFilter(value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primaryAccent
              : AppColors.elevatedSurface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? AppColors.primaryAccent
                : AppColors.subtleBorder,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.2),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Text(
          label,
          style: AppTypography.labelMedium.copyWith(
            color: isSelected ? Colors.white : AppColors.primaryText,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _buildMapControlButton({
    required IconData icon,
    required VoidCallback onPressed,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.elevatedSurface,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.subtleBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.25),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: IconButton(
        icon: Icon(icon, color: AppColors.primaryText, size: 20),
        onPressed: onPressed,
      ),
    );
  }
}
