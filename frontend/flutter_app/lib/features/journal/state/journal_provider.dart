import 'package:flutter/material.dart';
import '../../../core/config/api_config.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exceptions.dart';
import '../models/catch_model.dart';

class JournalProvider extends ChangeNotifier {
  final ApiClient apiClient;

  List<CatchModel> _catches = [];
  Map<String, dynamic>? _analytics;
  bool _isLoading = false;
  String? _errorMessage;

  JournalProvider({required this.apiClient});

  List<CatchModel> get catches => _catches;
  Map<String, dynamic>? get analytics => _analytics;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  int get totalCatches => _catches.length;

  double get maxWeight {
    if (_catches.isEmpty) return 0.0;
    double max = 0.0;
    for (final c in _catches) {
      if (c.weight != null && c.weight! > max) {
        max = c.weight!;
      }
    }
    return max;
  }

  Future<void> fetchCatches() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await apiClient.get(ApiConfig.fishingCatches);

      final dynamic rawList = res is Map<String, dynamic>
          ? (res['data'] ?? res['catches'])
          : res;

      if (rawList is List) {
        _catches = rawList
            .map((item) => CatchModel.fromJson(item as Map<String, dynamic>))
            .toList();
      } else {
        _catches = [];
      }

      await fetchAnalytics();
    } on ApiException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchAnalytics() async {
    try {
      final res = await apiClient.get(ApiConfig.fishingAnalytics);
      final dynamic rawData = res is Map<String, dynamic>
          ? (res['data'] ?? res['analytics'])
          : res;
      if (rawData is Map<String, dynamic>) {
        _analytics = rawData;
      }
    } catch (_) {
      // Analytics are progressive enhancement
    }
  }

  Future<bool> recordCatch({
    required String species,
    String? spotId,
    double? weight,
    double? length,
    String? lure,
    String? notes,
    DateTime? caughtAt,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final body = <String, dynamic>{
        'species': species.trim(),
        'caught_at': (caughtAt ?? DateTime.now()).toIso8601String(),
        'visibility': 'public',
      };
      if (spotId != null && spotId.isNotEmpty) {
        body['spot_id'] = spotId;
        body['spotId'] = spotId;
      }
      if (weight != null) body['weight'] = weight;
      if (length != null) body['length'] = length;
      if (lure != null && lure.isNotEmpty) {
        body['bait'] = lure.trim();
        body['lure'] = lure.trim();
      }
      if (notes != null && notes.isNotEmpty) body['notes'] = notes.trim();

      final res = await apiClient.post(ApiConfig.fishingCatches, body: body);

      CatchModel? newCatch;
      if (res is Map<String, dynamic>) {
        final data = res['data'] is Map<String, dynamic>
            ? res['data'] as Map<String, dynamic>
            : (res['catch'] is Map<String, dynamic>
                  ? res['catch'] as Map<String, dynamic>
                  : res);
        if (data['id'] != null) {
          newCatch = CatchModel.fromJson(data);
        }
      }

      if (newCatch != null) {
        _catches.insert(0, newCatch);
      } else {
        await fetchCatches();
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
