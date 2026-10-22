import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/config/api_config.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/api_exceptions.dart';
import '../models/auth_tokens.dart';
import '../models/user_model.dart';

enum AuthStatus { initial, authenticated, unauthenticated }

class AuthProvider extends ChangeNotifier {
  final ApiClient apiClient;

  AuthStatus _status = AuthStatus.initial;
  UserModel? _currentUser;
  AuthTokens? _tokens;
  bool _isLoading = false;
  String? _errorMessage;

  AuthProvider({required this.apiClient}) {
    apiClient.onUnauthorized = _handleUnauthorized;
  }

  AuthStatus get status => _status;
  UserModel? get currentUser => _currentUser;
  AuthTokens? get tokens => _tokens;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isAuthenticated =>
      _status == AuthStatus.authenticated && _currentUser != null;

  void _handleUnauthorized() {
    logout(silent: true);
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  Future<void> restoreSession() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final accessToken = prefs.getString('fishmap_access_token');
      final refreshToken = prefs.getString('fishmap_refresh_token');
      final userJson = prefs.getString('fishmap_current_user');

      if (accessToken != null && refreshToken != null) {
        _tokens = AuthTokens(
          accessToken: accessToken,
          refreshToken: refreshToken,
        );
        apiClient.setAccessToken(accessToken);

        if (userJson != null) {
          try {
            _currentUser = UserModel.fromJson(jsonDecode(userJson));
          } catch (_) {}
        }

        // Verify session against /api/v1/auth/me
        try {
          final res = await apiClient.get(ApiConfig.authMe);
          if (res is Map<String, dynamic> && res['user'] != null) {
            _currentUser = UserModel.fromJson(
              res['user'] as Map<String, dynamic>,
            );
            await prefs.setString(
              'fishmap_current_user',
              jsonEncode(_currentUser!.toJson()),
            );
            _status = AuthStatus.authenticated;
          } else {
            _status = AuthStatus.authenticated;
          }
        } on ApiException catch (e) {
          if (e.statusCode == 401) {
            // Attempt token refresh
            final refreshed = await _attemptTokenRefresh(refreshToken);
            if (!refreshed) {
              await _clearLocalSession();
              _status = AuthStatus.unauthenticated;
            }
          } else {
            // Non-auth error (e.g. offline) — still keep local session
            _status = AuthStatus.authenticated;
          }
        }
      } else {
        _status = AuthStatus.unauthenticated;
      }
    } catch (_) {
      _status = AuthStatus.unauthenticated;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> _attemptTokenRefresh(String refreshToken) async {
    try {
      final res = await apiClient.post(
        ApiConfig.authRefresh,
        body: {'refreshToken': refreshToken},
      );

      final tokensMap = res is Map<String, dynamic>
          ? (res['tokens'] is Map<String, dynamic>
                ? res['tokens'] as Map<String, dynamic>
                : res)
          : null;

      if (tokensMap != null && tokensMap['accessToken'] != null) {
        final newTokens = AuthTokens.fromJson(tokensMap);
        await _saveTokens(newTokens);
        _tokens = newTokens;
        apiClient.setAccessToken(newTokens.accessToken);
        _status = AuthStatus.authenticated;
        return true;
      }
    } catch (_) {}
    return false;
  }

  Future<bool> login({
    required String identifier,
    required String password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final trimmed = identifier.trim();
      final body = trimmed.contains('@')
          ? {'email': trimmed.toLowerCase(), 'password': password}
          : {'username': trimmed, 'password': password};

      final response = await apiClient.post(ApiConfig.authLogin, body: body);

      if (response is Map<String, dynamic>) {
        final userJson = response['user'] as Map<String, dynamic>?;
        final tokensJson = response['tokens'] is Map<String, dynamic>
            ? response['tokens'] as Map<String, dynamic>
            : response;

        if (userJson != null && tokensJson['accessToken'] != null) {
          _currentUser = UserModel.fromJson(userJson);
          _tokens = AuthTokens.fromJson(tokensJson);

          apiClient.setAccessToken(_tokens!.accessToken);
          await _saveTokens(_tokens!);
          await _saveUser(_currentUser!);

          _status = AuthStatus.authenticated;
          _isLoading = false;
          notifyListeners();
          return true;
        }
      }

      throw ApiException(
        code: 'INVALID_RESPONSE',
        message: 'Unexpected login response.',
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

  Future<bool> register({
    required String email,
    required String username,
    required String password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await apiClient.post(
        ApiConfig.authRegister,
        body: {
          'email': email.trim().toLowerCase(),
          'username': username.trim(),
          'password': password,
        },
      );

      if (response is Map<String, dynamic> && response['user'] != null) {
        // Successful registration; automatically authenticate to establish session
        return await login(identifier: username.trim(), password: password);
      }

      throw ApiException(
        code: 'INVALID_RESPONSE',
        message: 'Unexpected registration response.',
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

  Future<void> logout({bool silent = false}) async {
    if (!silent && _tokens != null) {
      try {
        await apiClient.post(
          ApiConfig.authLogout,
          body: {'refreshToken': _tokens!.refreshToken},
        );
      } catch (_) {}
    }

    await _clearLocalSession();
    _currentUser = null;
    _tokens = null;
    apiClient.setAccessToken(null);
    _status = AuthStatus.unauthenticated;
    _errorMessage = null;
    notifyListeners();
  }

  Future<void> _saveTokens(AuthTokens tokens) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('fishmap_access_token', tokens.accessToken);
    await prefs.setString('fishmap_refresh_token', tokens.refreshToken);
  }

  Future<void> _saveUser(UserModel user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('fishmap_current_user', jsonEncode(user.toJson()));
  }

  Future<void> _clearLocalSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('fishmap_access_token');
    await prefs.remove('fishmap_refresh_token');
    await prefs.remove('fishmap_current_user');
  }
}
