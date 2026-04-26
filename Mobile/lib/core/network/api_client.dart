import 'package:dio/dio.dart';

import 'api_exception.dart';

typedef JsonMap = Map<String, dynamic>;
typedef JsonDecoder<T> = T Function(dynamic data);

class ApiClient {
  ApiClient(this._dio);

  final Dio _dio;

  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    required JsonDecoder<T> decoder,
  }) async {
    return _send(
      () => _dio.get<dynamic>(
        path,
        queryParameters: queryParameters,
        options: options,
      ),
      decoder,
    );
  }

  Future<T> post<T>(
    String path, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    required JsonDecoder<T> decoder,
  }) async {
    return _send(
      () => _dio.post<dynamic>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      ),
      decoder,
    );
  }

  Future<T> patch<T>(
    String path, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    required JsonDecoder<T> decoder,
  }) async {
    return _send(
      () => _dio.patch<dynamic>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      ),
      decoder,
    );
  }

  Future<T> delete<T>(
    String path, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    required JsonDecoder<T> decoder,
  }) async {
    return _send(
      () => _dio.delete<dynamic>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      ),
      decoder,
    );
  }

  Future<T> upload<T>(
    String path, {
    required FormData data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    required JsonDecoder<T> decoder,
  }) async {
    return _send(
      () => _dio.post<dynamic>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      ),
      decoder,
    );
  }

  Future<T> _send<T>(
    Future<Response<dynamic>> Function() request,
    JsonDecoder<T> decoder,
  ) async {
    try {
      final response = await request();
      return decoder(response.data);
    } on DioException catch (error) {
      throw ApiException.fromDio(error);
    } catch (error) {
      throw ApiException(
        message: 'Unexpected client error.',
        error: error,
      );
    }
  }
}

