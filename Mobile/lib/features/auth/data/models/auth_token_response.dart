import 'package:json_annotation/json_annotation.dart';

part 'auth_token_response.g.dart';

@JsonSerializable(fieldRename: FieldRename.snake)
class AuthTokenResponse {
  const AuthTokenResponse({
    required this.accessToken,
    required this.tokenType,
    this.householdId,
  });

  final String accessToken;
  final String tokenType;
  final String? householdId;

  factory AuthTokenResponse.fromJson(Map<String, dynamic> json) =>
      _$AuthTokenResponseFromJson(json);

  Map<String, dynamic> toJson() => _$AuthTokenResponseToJson(this);
}

