import 'dart:convert';

class OfflineMutation {
  const OfflineMutation({
    required this.id,
    required this.endpoint,
    required this.method,
    required this.payload,
    required this.timestamp,
  });

  final String id;
  final String endpoint;
  final String method;
  final Map<String, dynamic> payload;
  final int timestamp;

  Map<String, dynamic> toJson() => <String, dynamic>{
        'id': id,
        'endpoint': endpoint,
        'method': method,
        'payload': payload,
        'timestamp': timestamp,
      };

  factory OfflineMutation.fromJson(Map<String, dynamic> json) {
    return OfflineMutation(
      id: json['id'] as String,
      endpoint: json['endpoint'] as String,
      method: json['method'] as String,
      payload: (json['payload'] as Map?)?.cast<String, dynamic>() ?? <String, dynamic>{},
      timestamp: (json['timestamp'] as num).toInt(),
    );
  }

  String encode() => jsonEncode(toJson());
}

