part of 'auth_token_response.dart';

AuthTokenResponse _$AuthTokenResponseFromJson(Map<String, dynamic> json) =>
    AuthTokenResponse(
      accessToken: json['access_token'] as String,
      tokenType: json['token_type'] as String,
      householdId: json['household_id'] as String?,
    );

Map<String, dynamic> _$AuthTokenResponseToJson(AuthTokenResponse instance) =>
    <String, dynamic>{
      'access_token': instance.accessToken,
      'token_type': instance.tokenType,
      'household_id': instance.householdId,
    };

