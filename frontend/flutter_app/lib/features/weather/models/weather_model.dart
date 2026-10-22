class WeatherModel {
  final double temperature;
  final double windSpeed;
  final double pressure;
  final int weatherCode;
  final String condition;
  final int suitabilityScore;
  final String suitabilityRating;
  final List<String> reasons;
  final DateTime updatedAt;

  String get barometerAdvice => reasons.isNotEmpty ? reasons.join('. ') : '';

  WeatherModel({
    required this.temperature,
    required this.windSpeed,
    required this.pressure,
    this.weatherCode = 0,
    required this.condition,
    this.suitabilityScore = 5,
    this.suitabilityRating = 'Moderate',
    this.reasons = const [],
    required this.updatedAt,
  });

  factory WeatherModel.fromJson(Map<String, dynamic> json) {
    final cur = json['data'] is Map<String, dynamic>
        ? json['data'] as Map<String, dynamic>
        : (json['current'] is Map<String, dynamic>
              ? json['current'] as Map<String, dynamic>
              : json);

    double temp = 0.0;
    if (cur['temperatureC'] != null) {
      temp = double.tryParse(cur['temperatureC'].toString()) ?? 0.0;
    } else if (cur['temperature'] != null) {
      temp = double.tryParse(cur['temperature'].toString()) ?? 0.0;
    }

    double wind = 0.0;
    if (cur['windSpeedKmh'] != null) {
      wind = double.tryParse(cur['windSpeedKmh'].toString()) ?? 0.0;
    } else if (cur['windSpeed'] != null) {
      wind = double.tryParse(cur['windSpeed'].toString()) ?? 0.0;
    } else if (cur['wind_speed'] != null) {
      wind = double.tryParse(cur['wind_speed'].toString()) ?? 0.0;
    }

    double press = 1013.25;
    if (cur['pressureHpa'] != null) {
      press = double.tryParse(cur['pressureHpa'].toString()) ?? 1013.25;
    } else if (cur['pressure'] != null) {
      press = double.tryParse(cur['pressure'].toString()) ?? 1013.25;
    }

    int score = 5;
    String rating = 'Fair';
    List<String> reas = [];

    final suitabilityMap = cur['fishingSuitability'] is Map
        ? cur['fishingSuitability'] as Map
        : (cur['suitability'] is Map ? cur['suitability'] as Map : null);

    if (suitabilityMap != null) {
      score = int.tryParse(suitabilityMap['score']?.toString() ?? '5') ?? 5;
      rating = suitabilityMap['rating']?.toString() ?? 'Fair';
      final recs =
          suitabilityMap['recommendations'] ?? suitabilityMap['reasons'];
      if (recs is List) {
        reas = recs.map((e) => e.toString()).toList();
      }
    }

    return WeatherModel(
      temperature: temp,
      windSpeed: wind,
      pressure: press,
      weatherCode: int.tryParse(cur['weatherCode']?.toString() ?? '0') ?? 0,
      condition:
          cur['conditions']?.toString() ??
          cur['condition']?.toString() ??
          'Clear',
      suitabilityScore: score,
      suitabilityRating: rating,
      reasons: reas,
      updatedAt: DateTime.now(),
    );
  }
}
