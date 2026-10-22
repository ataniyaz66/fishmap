import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import 'api_exceptions.dart';

/// Reusable HTTP API client for FishMap.
class ApiClient {
  final http.Client _client;
  String? _accessToken;
  VoidCallback? onUnauthorized;

  ApiClient({http.Client? client}) : _client = client ?? http.Client();

  void setAccessToken(String? token) {
    _accessToken = token;
  }

  String? get accessToken => _accessToken;

  Map<String, String> _buildHeaders([Map<String, String>? extra]) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (_accessToken != null && _accessToken!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $_accessToken';
    }
    if (extra != null) {
      headers.addAll(extra);
    }
    return headers;
  }

  Uri _buildUri(String path, [Map<String, dynamic>? queryParameters]) {
    final base = ApiConfig.baseUrl.endsWith('/')
        ? ApiConfig.baseUrl.substring(0, ApiConfig.baseUrl.length - 1)
        : ApiConfig.baseUrl;
    final normalizedPath = path.startsWith('/') ? path : '/$path';
    final fullUrl = '$base$normalizedPath';

    final uri = Uri.parse(fullUrl);
    if (queryParameters == null || queryParameters.isEmpty) {
      return uri;
    }

    final queryMap = <String, String>{};
    queryParameters.forEach((key, value) {
      if (value != null) {
        queryMap[key] = value.toString();
      }
    });

    return uri.replace(queryParameters: queryMap);
  }

  Future<dynamic> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
  }) async {
    return _send(
      'GET',
      path,
      queryParameters: queryParameters,
      headers: headers,
    );
  }

  Future<dynamic> post(
    String path, {
    dynamic body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
  }) async {
    return _send(
      'POST',
      path,
      body: body,
      queryParameters: queryParameters,
      headers: headers,
    );
  }

  Future<dynamic> put(
    String path, {
    dynamic body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
  }) async {
    return _send(
      'PUT',
      path,
      body: body,
      queryParameters: queryParameters,
      headers: headers,
    );
  }

  Future<dynamic> patch(
    String path, {
    dynamic body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
  }) async {
    return _send(
      'PATCH',
      path,
      body: body,
      queryParameters: queryParameters,
      headers: headers,
    );
  }

  Future<dynamic> delete(
    String path, {
    dynamic body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
  }) async {
    return _send(
      'DELETE',
      path,
      body: body,
      queryParameters: queryParameters,
      headers: headers,
    );
  }

  Future<dynamic> _send(
    String method,
    String path, {
    dynamic body,
    Map<String, dynamic>? queryParameters,
    Map<String, String>? headers,
  }) async {
    final uri = _buildUri(path, queryParameters);
    final requestHeaders = _buildHeaders(headers);

    http.Response response;

    try {
      final request = http.Request(method, uri);
      request.headers.addAll(requestHeaders);

      if (body != null) {
        request.body = jsonEncode(body);
      }

      final streamedResponse = await _client
          .send(request)
          .timeout(ApiConfig.connectTimeout);
      response = await http.Response.fromStream(
        streamedResponse,
      ).timeout(ApiConfig.receiveTimeout);
    } on SocketException catch (e) {
      throw ApiException.networkError(e.message);
    } on TimeoutException {
      throw ApiException.timeout();
    } on http.ClientException catch (e) {
      throw ApiException.networkError(e.message);
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException.networkError(e.toString());
    }

    return _processResponse(response);
  }

  dynamic _processResponse(http.Response response) {
    dynamic parsedBody;
    if (response.body.isNotEmpty) {
      try {
        parsedBody = jsonDecode(response.body);
      } catch (_) {
        parsedBody = response.body;
      }
    }

    final status = response.statusCode;

    if (status >= 200 && status < 300) {
      return parsedBody;
    }

    if (status == 401) {
      throw ApiException.fromResponse(status, parsedBody);
    }

    throw ApiException.fromResponse(status, parsedBody);
  }
}
