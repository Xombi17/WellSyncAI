import 'package:dio/dio.dart';

class ApiException implements Exception {
  ApiException({
    required this.message,
    this.statusCode,
    this.error,
  });

  final String message;
  final int? statusCode;
  final Object? error;

  factory ApiException.fromDio(DioException exception) {
    final response = exception.response;
    final responseData = response?.data;

    String resolvedMessage = 'Something went wrong. Please try again.';
    if (responseData is Map<String, dynamic>) {
      final detail = responseData['detail'];
      if (detail is String && detail.trim().isNotEmpty) {
        resolvedMessage = detail;
      }
    }

    if (exception.type == DioExceptionType.connectionTimeout ||
        exception.type == DioExceptionType.receiveTimeout ||
        exception.type == DioExceptionType.sendTimeout) {
      resolvedMessage = 'The server took too long to respond.';
    }

    if (exception.type == DioExceptionType.connectionError) {
      resolvedMessage = 'You appear to be offline. Check your connection and try again.';
    }

    return ApiException(
      message: resolvedMessage,
      statusCode: response?.statusCode,
      error: exception,
    );
  }

  @override
  String toString() => 'ApiException(statusCode: $statusCode, message: $message)';
}

