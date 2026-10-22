class FishingSpot {
  final String id;
  final String name;
  final String? description;
  final double latitude;
  final double longitude;
  final String waterType;
  final List<String> targetSpecies;
  final bool isPublic;
  final double? distance;
  final String? creatorId;
  final DateTime? createdAt;

  FishingSpot({
    required this.id,
    required this.name,
    this.description,
    required this.latitude,
    required this.longitude,
    this.waterType = 'freshwater',
    this.targetSpecies = const [],
    this.isPublic = true,
    this.distance,
    this.creatorId,
    this.createdAt,
  });

  factory FishingSpot.fromJson(Map<String, dynamic> json) {
    List<String> species = [];
    if (json['targetSpecies'] is List) {
      species = (json['targetSpecies'] as List)
          .map((e) => e.toString())
          .toList();
    } else if (json['target_species'] is List) {
      species = (json['target_species'] as List)
          .map((e) => e.toString())
          .toList();
    }

    double lat = 0.0;
    double lng = 0.0;
    if (json['latitude'] != null) {
      lat = double.tryParse(json['latitude'].toString()) ?? 0.0;
    }
    if (json['longitude'] != null) {
      lng = double.tryParse(json['longitude'].toString()) ?? 0.0;
    }

    double? dist;
    if (json['distance'] != null) {
      dist = double.tryParse(json['distance'].toString());
    }

    return FishingSpot(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Unnamed Spot',
      description: json['description']?.toString(),
      latitude: lat,
      longitude: lng,
      waterType:
          json['waterType']?.toString() ??
          json['water_type']?.toString() ??
          'freshwater',
      targetSpecies: species,
      isPublic: json['isPublic'] == true || json['is_public'] == true,
      distance: dist,
      creatorId:
          json['creatorId']?.toString() ??
          json['userId']?.toString() ??
          json['user_id']?.toString(),
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'latitude': latitude,
      'longitude': longitude,
      'waterType': waterType,
      'targetSpecies': targetSpecies,
      'isPublic': isPublic,
      if (distance != null) 'distance': distance,
    };
  }
}
