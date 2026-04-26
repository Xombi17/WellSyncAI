part of 'medicine_safety_response.dart';

MedicineSafetyResponse _$MedicineSafetyResponseFromJson(Map<String, dynamic> json) =>
    MedicineSafetyResponse(
      detectedMedicine: json['detected_medicine'] as String,
      confidence: (json['confidence'] as num).toDouble(),
      bucket: $enumDecode(_$SafetyBucketEnumMap, json['bucket']),
      concernChecked: json['concern_checked'] as String,
      whyCaution: json['why_caution'] as String,
      nextStep: json['next_step'] as String,
      disclaimer: json['disclaimer'] as String,
      rawOcrText: json['raw_ocr_text'] as String?,
      ocrModelUsed: json['ocr_model_used'] as String?,
    );

Map<String, dynamic> _$MedicineSafetyResponseToJson(
        MedicineSafetyResponse instance) =>
    <String, dynamic>{
      'detected_medicine': instance.detectedMedicine,
      'confidence': instance.confidence,
      'bucket': _$SafetyBucketEnumMap[instance.bucket]!,
      'concern_checked': instance.concernChecked,
      'why_caution': instance.whyCaution,
      'next_step': instance.nextStep,
      'disclaimer': instance.disclaimer,
      'raw_ocr_text': instance.rawOcrText,
      'ocr_model_used': instance.ocrModelUsed,
    };

const _$SafetyBucketEnumMap = <SafetyBucket, String>{
  SafetyBucket.commonUse: 'common_use',
  SafetyBucket.useWithCaution: 'use_with_caution',
  SafetyBucket.insufficientInfo: 'insufficient_info',
  SafetyBucket.consultDoctorUrgently: 'consult_doctor_urgently',
};

