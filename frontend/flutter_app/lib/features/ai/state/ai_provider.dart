import 'package:flutter/material.dart';
import '../../../core/config/api_config.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exceptions.dart';
import '../models/ai_recommendation.dart';

class AiProvider extends ChangeNotifier {
  final ApiClient apiClient;

  AiRecommendation? _latestRecommendation;
  String? _assistAnswer;
  bool _isLoading = false;
  String? _errorMessage;

  AiProvider({required this.apiClient});

  AiRecommendation? get latestRecommendation => _latestRecommendation;
  String? get assistAnswer => _assistAnswer;
  String? get assistantResponse => _assistAnswer;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<bool> recommendLure({
    required String targetSpecies,
    String waterType = 'freshwater',
    String weather = 'clear',
    String waterClarity = 'clear',
    String depth = 'medium',
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final body = {
        'species': targetSpecies,
        'targetSpecies': targetSpecies,
        'water_type': waterType,
        'waterType': waterType,
        'weather': weather,
        'waterClarity': waterClarity,
        'depth': depth,
      };

      final res = await apiClient.post(ApiConfig.aiRecommendLure, body: body);

      if (res is Map<String, dynamic>) {
        final data = res['data'] is Map<String, dynamic>
            ? res['data'] as Map<String, dynamic>
            : res;
        _latestRecommendation = AiRecommendation.fromJson(data);
        _isLoading = false;
        notifyListeners();
        return true;
      }

      throw ApiException(
        code: 'INVALID_AI_RESPONSE',
        message: 'Failed to parse AI advice.',
      );
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

  Future<bool> askAssist(String query) async {
    if (query.trim().isEmpty) return false;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await apiClient.post(
        ApiConfig.aiAssist,
        body: {'query': query.trim()},
      );

      if (res is Map<String, dynamic>) {
        final data = res['data'] is Map<String, dynamic>
            ? res['data'] as Map<String, dynamic>
            : res;
        _assistAnswer =
            data['reply']?.toString() ??
            data['response']?.toString() ??
            data['answer']?.toString() ??
            'No response generated.';
        _isLoading = false;
        notifyListeners();
        return true;
      }

      throw ApiException(
        code: 'INVALID_AI_RESPONSE',
        message: 'Unexpected assistant response.',
      );
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
