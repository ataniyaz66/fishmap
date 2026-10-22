import 'package:flutter/material.dart';
import '../../../core/config/api_config.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exceptions.dart';
import '../models/user_profile.dart';

class ProfileProvider extends ChangeNotifier {
  final ApiClient apiClient;

  UserProfile? _profile;
  bool _isLoading = false;
  String? _errorMessage;

  ProfileProvider({required this.apiClient});

  UserProfile? get profile => _profile;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchProfile() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await apiClient.get(ApiConfig.usersMe);

      if (res is Map<String, dynamic>) {
        final data = res['data'] is Map<String, dynamic>
            ? res['data'] as Map<String, dynamic>
            : res;
        _profile = UserProfile.fromJson(data);
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

  Future<bool> updateProfile({
    String? displayName,
    String? bio,
    String? location,
    String? experienceLevel,
    List<String>? favoriteSpecies,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final body = <String, dynamic>{};
      if (displayName != null) body['displayName'] = displayName.trim();
      if (bio != null) body['bio'] = bio.trim();
      if (location != null) body['location'] = location.trim();
      if (experienceLevel != null) body['experienceLevel'] = experienceLevel;
      if (favoriteSpecies != null) body['favoriteSpecies'] = favoriteSpecies;

      final res = await apiClient.patch(ApiConfig.usersMe, body: body);

      if (res is Map<String, dynamic>) {
        final data = res['data'] is Map<String, dynamic>
            ? res['data'] as Map<String, dynamic>
            : res;
        _profile = UserProfile.fromJson(data);
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } on ApiException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return false;
  }

  Future<UserProfile?> fetchUserProfile(String userId) async {
    try {
      final res = await apiClient.get('${ApiConfig.usersList}/$userId');
      if (res is Map<String, dynamic>) {
        final data = res['data'] is Map<String, dynamic>
            ? res['data'] as Map<String, dynamic>
            : res;
        return UserProfile.fromJson(data);
      }
    } catch (_) {}
    return null;
  }
}
