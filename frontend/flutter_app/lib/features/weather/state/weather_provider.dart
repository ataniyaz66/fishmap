import 'package:flutter/material.dart';
import '../../../core/config/api_config.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exceptions.dart';
import '../models/weather_model.dart';

class WeatherProvider extends ChangeNotifier {
  final ApiClient apiClient;

  WeatherModel? _weather;
  bool _isLoading = false;
  String? _errorMessage;

  WeatherProvider({required this.apiClient});

  WeatherModel? get weather => _weather;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchWeather({
    double latitude = 37.7749,
    double longitude = -122.4194,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await apiClient.get(
        ApiConfig.weatherCurrent,
        queryParameters: {'latitude': latitude, 'longitude': longitude},
      );

      if (res is Map<String, dynamic>) {
        _weather = WeatherModel.fromJson(res);
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
}
