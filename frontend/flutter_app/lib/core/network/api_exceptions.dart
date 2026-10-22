/// Structured Exception class representing API and Network errors.
class ApiException implements Exception {
  final int? statusCode;
  final String code;
  final String message;
  final dynamic details;

  ApiException({
    this.statusCode,
    required this.code,
    required this.message,
    this.details,
  });

  factory ApiException.fromResponse(int statusCode, dynamic body) {
    if (body is Map<String, dynamic>) {
      final errorObj = body['error'];
      if (errorObj is Map<String, dynamic>) {
        return ApiException(
          statusCode: statusCode,
          code: errorObj['code']?.toString() ?? 'API_ERROR',
          message:
              errorObj['message']?.toString() ??
              'An unexpected error occurred.',
          details: errorObj['details'],
        );
      }
      if (body['message'] != null) {
        return ApiException(
          statusCode: statusCode,
          code: body['code']?.toString() ?? 'API_ERROR',
          message: body['message'].toString(),
        );
      }
    }

    return ApiException(
      statusCode: statusCode,
      code: 'HTTP_$statusCode',
      message: 'Server returned HTTP status $statusCode.',
    );
  }

  factory ApiException.networkError([String? customMessage]) {
    return ApiException(
      code: 'NETWORK_ERROR',
      message:
          customMessage ??
          'Unable to connect to FishMap server. Please check your network.',
    );
  }

  factory ApiException.timeout() {
    return ApiException(
      code: 'TIMEOUT',
      message: 'Request timed out. Please try again.',
    );
  }

  factory ApiException.unauthorized() {
    return ApiException(
      statusCode: 401,
      code: 'UNAUTHORIZED',
      message: 'Your session has expired. Please sign in again.',
    );
  }

  @override
  String toString() => message;
}
