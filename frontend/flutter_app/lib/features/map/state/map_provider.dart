import 'package:flutter/material.dart';
import '../../../core/config/api_config.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exceptions.dart';
import '../models/fishing_spot.dart';

class MapProvider extends ChangeNotifier {
  final ApiClient apiClient;

  List<FishingSpot> _spots = [];
  FishingSpot? _selectedSpot;
  bool _isLoading = false;
  String? _errorMessage;
  String _waterTypeFilter = 'all';

  MapProvider({required this.apiClient});

  List<FishingSpot> get spots {
    if (_waterTypeFilter == 'all') return _spots;
    return _spots
        .where(
          (s) => s.waterType.toLowerCase() == _waterTypeFilter.toLowerCase(),
        )
        .toList();
  }

  FishingSpot? get selectedSpot => _selectedSpot;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  String get waterTypeFilter => _waterTypeFilter;

  void setWaterTypeFilter(String filter) {
    _waterTypeFilter = filter;
    notifyListeners();
  }

  void selectSpot(FishingSpot? spot) {
    _selectedSpot = spot;
    notifyListeners();
  }

  Future<void> fetchSpots({
    double? latitude,
    double? longitude,
    double? radius,
    String? search,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final queryParams = <String, dynamic>{};
      if (latitude != null) queryParams['latitude'] = latitude;
      if (longitude != null) queryParams['longitude'] = longitude;
      if (radius != null) queryParams['radius'] = radius;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;

      final res = await apiClient.get(
        ApiConfig.fishingSpots,
        queryParameters: queryParams,
      );

      final dynamic rawList = res is Map<String, dynamic>
          ? (res['data'] ?? res['spots'])
          : res;

      if (rawList is List) {
        _spots = rawList
            .map((item) => FishingSpot.fromJson(item as Map<String, dynamic>))
            .toList();
      } else {
        _spots = [];
      }
    } on ApiException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createSpot({
    required String name,
    required double latitude,
    required double longitude,
    String waterType = 'freshwater',
    List<String> targetSpecies = const [],
    String? description,
    bool isPublic = true,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final body = {
        'name': name.trim(),
        'latitude': latitude,
        'longitude': longitude,
        'water_type': waterType,
        'waterType': waterType,
        'visibility': isPublic ? 'public' : 'private',
        'targetSpecies': targetSpecies,
        if (description != null && description.trim().isNotEmpty)
          'description': description.trim(),
      };

      final res = await apiClient.post(ApiConfig.fishingSpots, body: body);

      FishingSpot? newSpot;
      if (res is Map<String, dynamic>) {
        final data = res['data'] is Map<String, dynamic>
            ? res['data'] as Map<String, dynamic>
            : (res['spot'] is Map<String, dynamic>
                  ? res['spot'] as Map<String, dynamic>
                  : res);
        if (data['id'] != null) {
          newSpot = FishingSpot.fromJson(data);
        }
      }

      if (newSpot != null) {
        _spots.insert(0, newSpot);
        _selectedSpot = newSpot;
      } else {
        await fetchSpots();
      }

      _isLoading = false;
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _errorMessage = e.message;
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
