"""
Medicine Safety Service
------------------------
Deterministic rule-based classifier for medicine safety.
The LLM is used ONLY to simplify the output, not to make safety decisions.

Safety buckets (from PRD):
  - common_use              → generally used without special precautions
  - use_with_caution        → notable warnings or interactions
  - insufficient_info       → not enough known, consult professional
  - consult_doctor_urgently → high risk signal detected
"""

import re

import structlog

from app.schemas.medicine import SafetyBucket

log = structlog.get_logger()


# ─────────────────────────────────────────────────────────────────────────────
# Simple drug safety knowledge base
# In production, replace/supplement with a proper drug database
# ─────────────────────────────────────────────────────────────────────────────

# Format: medicine_name_fragment (lowercase) → (bucket, concern, why_caution, next_step)
_SAFETY_RULES: list[tuple[str, SafetyBucket, str, str, str]] = [
    # Pattern,                    Bucket,                    Concern,         Why,                                         Next step
    (
        "paracetamol",
        "common_use",
        "general use",
        "Paracetamol is generally safe when taken at the correct dose.",
        "Follow package dosage. Avoid high doses for prolonged periods.",
    ),
    (
        "acetaminophen",
        "common_use",
        "general use",
        "Acetaminophen is generally safe at recommended doses.",
        "Follow package dosage carefully.",
    ),
    (
        "crocin",
        "common_use",
        "general use",
        "Crocin contains paracetamol (acetaminophen) and is generally safe at recommended doses.",
        "Follow package dosage. Do not exceed recommended dose.",
    ),
    (
        "dolo",
        "common_use",
        "general use",
        "Dolo contains paracetamol (acetaminophen) and is generally safe at recommended doses.",
        "Follow package dosage. Do not exceed recommended dose.",
    ),
    (
        "calpol",
        "common_use",
        "general use",
        "Calpol contains paracetamol (acetaminophen) and is generally safe at recommended doses.",
        "Follow package dosage. Do not exceed recommended dose.",
    ),
    (
        "meftal",
        "use_with_caution",
        "stomach",
        "Meftal (mefenamic acid) can cause stomach irritation and should be taken with food.",
        "Take with food. Avoid on empty stomach. Consult doctor if you have stomach issues.",
    ),
    (
        "ibuprofen",
        "use_with_caution",
        "pregnancy / stomach",
        "Ibuprofen should be avoided in pregnancy (especially 3rd trimester) and can irritate the stomach.",
        "Avoid in pregnancy. Take with food. Consult a doctor if unsure.",
    ),
    (
        "aspirin",
        "use_with_caution",
        "pregnancy / children",
        "Aspirin is not safe for children under 16 and should be avoided in pregnancy.",
        "Do not give to children. Avoid in pregnancy. Consult a doctor.",
    ),
    (
        "metformin",
        "use_with_caution",
        "kidney function",
        "Metformin requires monitoring of kidney function and may need dose adjustment.",
        "Take only as prescribed. Get regular kidney function tests.",
    ),
    (
        "amoxicillin",
        "use_with_caution",
        "allergy",
        "Amoxicillin is a penicillin antibiotic. Allergic reactions are possible.",
        "Check for penicillin allergy before use. Complete the full course as prescribed.",
    ),
    (
        "ciprofloxacin",
        "use_with_caution",
        "pregnancy",
        "Ciprofloxacin is generally avoided in pregnancy and growing children.",
        "Avoid in pregnancy and children unless prescribed. Consult a doctor.",
    ),
    (
        "doxycycline",
        "use_with_caution",
        "pregnancy / children",
        "Doxycycline is contraindicated in pregnancy and children under 8.",
        "Do not use in pregnancy or children under 8. Consult a doctor.",
    ),
    (
        "warfarin",
        "consult_doctor_urgently",
        "bleeding risk",
        "Warfarin thins blood and has many drug interactions. Incorrect use can cause serious bleeding.",
        "Only use as prescribed. Do not change dose or stop without doctor advice.",
    ),
    (
        "methotrexate",
        "consult_doctor_urgently",
        "pregnancy / toxicity",
        "Methotrexate is highly toxic and causes severe birth defects. It must not be used without specialist supervision.",
        "Consult your specialist immediately. Do not take if pregnant or planning pregnancy.",
    ),
    (
        "thalidomide",
        "consult_doctor_urgently",
        "pregnancy",
        "Thalidomide causes severe birth defects and is absolutely contraindicated in pregnancy.",
        "Do not use in pregnancy under any circumstances. Consult a doctor immediately.",
    ),
    (
        "misoprostol",
        "consult_doctor_urgently",
        "pregnancy",
        "Misoprostol causes uterine contractions and can trigger miscarriage or preterm labour.",
        "Do not use in pregnancy unless under direct medical supervision.",
    ),
    (
        "isotretinoin",
        "consult_doctor_urgently",
        "pregnancy",
        "Isotretinoin (Accutane/Roaccutane) causes severe birth defects. Strict pregnancy prevention is mandatory.",
        "Do not use during pregnancy. Requires strict contraception. Consult your dermatologist.",
    ),
    (
        "lithium",
        "consult_doctor_urgently",
        "pregnancy / toxicity",
        "Lithium has a narrow therapeutic window and risks toxicity. It crosses the placenta.",
        "Use only as prescribed. Monitor blood levels regularly. Consult doctor in pregnancy.",
    ),
    (
        "diazepam",
        "use_with_caution",
        "dependence / pregnancy",
        "Benzodiazepines like diazepam can cause dependence and affect the baby in pregnancy.",
        "Use only as prescribed for short periods. Avoid in pregnancy if possible. Consult doctor.",
    ),
    (
        "codeine",
        "use_with_caution",
        "breastfeeding / children",
        "Codeine converts to morphine and is unsafe in breastfeeding and children under 12.",
        "Avoid in breastfeeding mothers and children. Consult a doctor.",
    ),
    (
        "tramadol",
        "use_with_caution",
        "pregnancy / dependence",
        "Tramadol carries dependence risk and is not recommended in pregnancy.",
        "Use only as prescribed. Avoid in pregnancy. Consult doctor.",
    ),
    (
        "chloramphenicol",
        "consult_doctor_urgently",
        "newborns",
        "Chloramphenicol can cause 'grey baby syndrome' in newborns and is avoided in pregnancy and infants.",
        "Do not use in newborns or during late pregnancy without specialist supervision.",
    ),
    (
        "tetracycline",
        "use_with_caution",
        "pregnancy / children",
        "Tetracycline stains developing teeth and bones. Avoid in children under 8 and pregnant women.",
        "Do not use in pregnancy or children under 8.",
    ),
    (
        "phenytoin",
        "consult_doctor_urgently",
        "pregnancy",
        "Phenytoin can cause birth defects (fetal hydantoin syndrome).",
        "Only use under specialist supervision in pregnancy. Regular monitoring required.",
    ),
    (
        "valproate",
        "consult_doctor_urgently",
        "pregnancy",
        "Valproate/Valproic acid causes major birth defects and developmental delay.",
        "Do not use in pregnancy or women of childbearing age without specialist supervision.",
    ),
    (
        "valproic acid",
        "consult_doctor_urgently",
        "pregnancy",
        "Valproic acid causes major birth defects and developmental delay.",
        "Do not use in pregnancy or women of childbearing age without specialist supervision.",
    ),
    (
        "sodium valproate",
        "consult_doctor_urgently",
        "pregnancy",
        "Sodium valproate causes major birth defects and developmental delay.",
        "Do not use in pregnancy or women of childbearing age without specialist supervision.",
    ),
    # ─────────────────────────────────────────────────────────────────────────────
    # Common Indian medicines and brands
    # ─────────────────────────────────────────────────────────────────────────────
    # Fever/Pain relief
    (
        " PCM ",
        "common_use",
        "general use",
        "PCM contains paracetamol and is commonly used for fever and pain relief.",
        "Follow package dosage. Do not exceed recommended dose.",
    ),
    (
        "sumo",
        "common_use",
        "general use",
        "Sumo contains paracetamol and is commonly used for fever and pain relief.",
        "Follow package dosage. Do not exceed recommended dose.",
    ),
    (
        "combiflam",
        "common_use",
        "general use",
        "Combiflam contains ibuprofen (NSAID) and is used for pain and inflammation.",
        "Take with food. Avoid on empty stomach. Do not use in pregnancy without consulting doctor.",
    ),
    (
        "disprin",
        "use_with_caution",
        "pregnancy / children",
        "Disprin contains aspirin. Not safe for children under 16 or in pregnancy.",
        "Do not give to children. Avoid in pregnancy. Consult a doctor.",
    ),
    (
        "anacin",
        "use_with_caution",
        "pregnancy / children",
        "Anacin contains aspirin. Not safe for children under 16 or in pregnancy.",
        "Do not give to children. Avoid in pregnancy. Consult a doctor.",
    ),
    (
        "gelusil",
        "common_use",
        "general use",
        "Gelusil is an antacid used for acidity and heartburn. Generally safe.",
        "Use as needed. Consult doctor if symptoms persist.",
    ),
    (
        "digene",
        "common_use",
        "general use",
        "Digene is an antacid used for acidity and heartburn. Generally safe.",
        "Use as needed. Consult doctor if symptoms persist.",
    ),
    # Antibiotics
    (
        "azithromycin",
        "use_with_caution",
        "allergy / interactions",
        "Azithromycin is an antibiotic. May cause allergic reactions and drug interactions.",
        "Take as prescribed. Complete the full course. Consult doctor if allergic reactions occur.",
    ),
    (
        "ciplox",
        "use_with_caution",
        "pregnancy / children",
        "Ciplox contains ciprofloxacin, a fluoroquinolone antibiotic. Avoid in pregnancy and children.",
        "Avoid in pregnancy and children unless prescribed. Consult a doctor.",
    ),
    (
        "metronidazole",
        "use_with_caution",
        "pregnancy",
        "Metronidazole is an antibiotic. Should be avoided in early pregnancy unless essential.",
        "Consult doctor before use during pregnancy. Do not consume alcohol with it.",
    ),
    (
        "cefexime",
        "use_with_caution",
        "allergy",
        "Cefixime is a cephalosporin antibiotic. May cause allergic reactions in some people.",
        "Take as prescribed. Consult doctor if you have penicillin or cephalosporin allergy.",
    ),
    (
        "amoxyclav",
        "use_with_caution",
        "allergy / liver",
        "Amoxyclav (amoxicillin + clavulanic acid) is an antibiotic. Monitor liver function with long use.",
        "Take with food to reduce stomach upset. Complete the full course as prescribed.",
    ),
    # Diabetes
    (
        "glimepiride",
        "use_with_caution",
        "blood sugar",
        "Glimepiride is a diabetes medicine. Can cause low blood sugar (hypoglycemia).",
        "Take as prescribed. Monitor blood sugar regularly. Do not skip meals.",
    ),
    (
        "glipizide",
        "use_with_caution",
        "blood sugar",
        "Glipizide is a diabetes medicine. Can cause low blood sugar (hypoglycemia).",
        "Take as prescribed. Monitor blood sugar regularly. Do not skip meals.",
    ),
    (
        "voglibose",
        "use_with_caution",
        "digestion",
        "Voglibose is a diabetes medicine that affects carbohydrate digestion. May cause gas and bloating.",
        "Take with first bite of food. Consult doctor if digestive issues persist.",
    ),
    # Blood pressure / Heart
    (
        "amlodipine",
        "use_with_caution",
        "blood pressure",
        "Amlodipine is a blood pressure medicine. May cause swelling in ankles.",
        "Take as prescribed. Report any severe swelling or dizziness to doctor.",
    ),
    (
        "atenolol",
        "use_with_caution",
        "blood pressure / heart",
        "Atenolol is a beta-blocker for blood pressure and heart. Do not stop suddenly.",
        "Do not stop taking suddenly without consulting doctor. May cause fatigue or dizziness.",
    ),
    (
        "losartan",
        "use_with_caution",
        "blood pressure / kidney",
        "Losartan is a blood pressure medicine. May affect kidney function in some people.",
        "Take as prescribed. Monitor kidney function with regular tests.",
    ),
    (
        "metoprolol",
        "use_with_caution",
        "blood pressure / heart",
        "Metoprolol is a beta-blocker for blood pressure and heart. Do not stop suddenly.",
        "Do not stop taking suddenly without consulting doctor. May cause fatigue or dizziness.",
    ),
    # Thyroid
    (
        "thyroxine",
        "use_with_caution",
        "thyroid",
        "Thyroxine is a thyroid hormone replacement. Must be taken on empty stomach.",
        "Take on empty stomach, 30 mins before breakfast. Do not skip doses. Get regular tests.",
    ),
    # Mental health
    (
        "sertraline",
        "use_with_caution",
        "mental health",
        "Sertraline is an antidepressant. May take 2-4 weeks to show full effect.",
        "Take as prescribed. Do not stop suddenly. Consult doctor if mood worsens.",
    ),
    (
        "fluoxetine",
        "use_with_caution",
        "mental health",
        "Fluoxetine is an antidepressant. May take 2-4 weeks to show full effect.",
        "Take as prescribed. Do not stop suddenly. Consult doctor if mood worsens.",
    ),
    (
        "paroxetine",
        "use_with_caution",
        "mental health",
        "Paroxetine is an antidepressant. May cause withdrawal symptoms if stopped suddenly.",
        "Do not stop taking suddenly. Consult doctor before changing dose.",
    ),
    # Stomach/Acid
    (
        "pantoprazole",
        "use_with_caution",
        "stomach",
        "Pantoprazole reduces stomach acid. Long-term use may affect vitamin B12 absorption.",
        "Take on empty stomach, 30 mins before breakfast. Consult doctor for long-term use.",
    ),
    (
        "omeprazole",
        "use_with_caution",
        "stomach",
        "Omeprazole reduces stomach acid. Long-term use may affect vitamin B12 and magnesium.",
        "Take on empty stomach, 30 mins before breakfast. Consult doctor for long-term use.",
    ),
    (
        "rabeprazole",
        "use_with_caution",
        "stomach",
        "Rabeprazole reduces stomach acid. Long-term use may affect nutrient absorption.",
        "Take on empty stomach as prescribed. Consult doctor for long-term use.",
    ),
    (
        "domperidone",
        "use_with_caution",
        "heart / pregnancy",
        "Domperidone is for nausea/vomiting. May cause heart rhythm issues in some people.",
        "Use as prescribed. Consult doctor if you have heart problems or are pregnant.",
    ),
    # Pain/Inflammation
    (
        "diclofenac",
        "use_with_caution",
        "stomach / heart",
        "Diclofenac is an NSAID for pain. Can cause stomach issues and may affect heart.",
        "Take with food. Avoid in pregnancy. Consult doctor if you have heart or kidney issues.",
    ),
    (
        "nimesulide",
        "use_with_caution",
        "liver / stomach",
        "Nimesulide is an NSAID for pain. Has risk of liver damage with prolonged use.",
        "Use for short term only. Avoid in liver problems. Take with food.",
    ),
    (
        " serratiopeptidase ",
        "use_with_caution",
        "bleeding",
        "Serratiopeptidase is an enzyme for inflammation. May increase bleeding risk.",
        "Use as prescribed. Consult doctor before surgery. Avoid if you have bleeding disorders.",
    ),
    # Cough/Cold
    (
        "phenylephrine",
        "use_with_caution",
        "blood pressure",
        "Phenylephrine is a decongestant. May raise blood pressure.",
        "Avoid if you have high blood pressure or heart disease. Consult doctor if on BP medicines.",
    ),
    (
        "pheniramine",
        "use_with_caution",
        "drowsiness",
        "Pheniramine is an antihistamine for allergies/cold. Causes drowsiness.",
        "May cause sleepiness. Avoid driving after taking. Use with caution in elderly.",
    ),
    (
        " cetirizine",
        "common_use",
        "general use",
        "Cetirizine is an antihistamine for allergies. Generally safe and non-drowsy.",
        "Use as needed for allergies. May cause mild drowsiness in some people.",
    ),
    (
        " loratadine",
        "common_use",
        "general use",
        "Loratadine is an antihistamine for allergies. Generally safe and non-drowsy.",
        "Use as needed for allergies. Generally does not cause drowsiness.",
    ),
    (
        "levocetirizine",
        "common_use",
        "general use",
        "Levocetirizine is an antihistamine for allergies. Generally safe.",
        "Use as needed for allergies. May cause mild drowsiness.",
    ),
    # Others
    (
        "iron",
        "use_with_caution",
        "stomach",
        "Iron supplements can cause stomach upset and constipation.",
        "Take with food. Drink plenty of water. Consult doctor if constipated.",
    ),
    (
        "folic acid",
        "common_use",
        "general use",
        "Folic acid is a vitamin supplement. Generally safe, especially in pregnancy.",
        "Use as prescribed. Important for pregnant women and those planning pregnancy.",
    ),
    (
        "calcium",
        "common_use",
        "general use",
        "Calcium supplements are generally safe for bone health.",
        "Take with food for better absorption. Do not take with iron or zinc supplements.",
    ),
    (
        "vitamin d",
        "common_use",
        "general use",
        "Vitamin D supplements are generally safe. Helps bone health.",
        "Use as prescribed. Can be taken with calcium. Get blood levels tested if needed.",
    ),
    (
        "zinc",
        "use_with_caution",
        "stomach",
        "Zinc supplements can cause stomach upset if taken on empty stomach.",
        "Take with food. Do not take with calcium or iron at the same time.",
    ),
]


# ─────────────────────────────────────────────────────────────────────────────
# Normalisation helpers
# ─────────────────────────────────────────────────────────────────────────────


def _normalize(text: str) -> str:
    """Lowercase and remove special characters for fuzzy matching."""
    return re.sub(r"[^a-z0-9 ]", " ", text.lower()).strip()


# ─────────────────────────────────────────────────────────────────────────────
# Main classifier
# ─────────────────────────────────────────────────────────────────────────────


def classify_medicine(
    medicine_name: str,
    concern: str | None = None,
) -> tuple[SafetyBucket, str, str, str, float]:
    """
    Classify a medicine into a safety bucket using deterministic rules.

    Returns:
        (bucket, concern_checked, why_caution, next_step, confidence)
    """
    normalized = _normalize(medicine_name)

    best_match: tuple | None = None

    for pattern, bucket, concern_key, why, next_step in _SAFETY_RULES:
        if _normalize(pattern) in normalized:
            # If caller specified a concern, prefer a matching rule
            if concern and concern_key and concern.lower() in concern_key.lower():
                best_match = (bucket, concern_key, why, next_step, 0.90)
                break
            if best_match is None:
                best_match = (bucket, concern_key, why, next_step, 0.80)

    if best_match:
        return best_match  # type: ignore

    # Unknown medicine → return conservative insufficient_info
    log.info("medicine_not_in_rules", medicine=medicine_name)
    return (
        "insufficient_info",
        concern or "general safety",
        (f"'{medicine_name}' is not in our current database. We cannot confirm its safety profile."),
        "Please consult a pharmacist or doctor before using this medicine.",
        0.30,
    )
