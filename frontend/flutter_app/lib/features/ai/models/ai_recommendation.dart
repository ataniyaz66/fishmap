class AiRecommendation {
  final String primaryLure;
  final String? colorAdvice;
  final String? retrieveTechnique;
  final double confidence;
  final String reasoning;
  final List<String> matchedInventory;

  AiRecommendation({
    required this.primaryLure,
    this.colorAdvice,
    this.retrieveTechnique,
    this.confidence = 0.85,
    required this.reasoning,
    this.matchedInventory = const [],
  });

  factory AiRecommendation.fromJson(Map<String, dynamic> json) {
    final rec = json['data'] is Map<String, dynamic>
        ? json['data'] as Map<String, dynamic>
        : (json['recommendation'] is Map<String, dynamic>
              ? json['recommendation'] as Map<String, dynamic>
              : json);

    double conf = 0.85;
    if (rec['confidence'] != null) {
      conf = double.tryParse(rec['confidence'].toString()) ?? 0.85;
    }

    List<String> matched = [];
    if (rec['matchedInventory'] is List) {
      matched = (rec['matchedInventory'] as List)
          .map((e) => e.toString())
          .toList();
    } else if (rec['matched_inventory'] is List) {
      matched = (rec['matched_inventory'] as List)
          .map((e) => e.toString())
          .toList();
    }

    return AiRecommendation(
      primaryLure:
          rec['primaryLure']?.toString() ??
          rec['primary_lure']?.toString() ??
          'Recommended Lure',
      colorAdvice:
          rec['colorAdvice']?.toString() ?? rec['color_advice']?.toString(),
      retrieveTechnique:
          rec['retrieveTechnique']?.toString() ??
          rec['retrieve_technique']?.toString(),
      confidence: conf,
      reasoning:
          rec['reasoning']?.toString() ?? rec['explanation']?.toString() ?? '',
      matchedInventory: matched,
    );
  }
}
