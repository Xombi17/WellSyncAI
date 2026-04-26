import 'package:json_annotation/json_annotation.dart';

part 'medicine_safety_response.g.dart';

enum SafetyBucket {
  commonUse,
  useWithCaution,
  insufficientInfo,
  consultDoctorUrgently,
}

@JsonSerializable(fieldRename: FieldRename.snake)
class MedicineSafetyResponse {
  const MedicineSafetyResponse({
    required this.detectedMedicine,
    required this.confidence,
    required this.bucket,
    required this.concernChecked,
    required this.whyCaution,
    required this.nextStep,
    required this.disclaimer,
    this.rawOcrText,
    this.ocrModelUsed,
  });

  final String detectedMedicine;
  final double confidence;
  final SafetyBucket bucket;
  final String concernChecked;
  final String whyCaution;
  final String nextStep;
  final String disclaimer;
  final String? rawOcrText;
  final String? ocrModelUsed;

  factory MedicineSafetyResponse.fromJson(Map<String, dynamic> json) =>
      _$MedicineSafetyResponseFromJson(json);

  Map<String, dynamic> toJson() => _$MedicineSafetyResponseToJson(this);
}

