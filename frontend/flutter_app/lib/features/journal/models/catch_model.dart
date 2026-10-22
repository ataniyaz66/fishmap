class CatchModel {
  final String id;
  final String? spotId;
  final String? spotName;
  final String species;
  final double? weight;
  final double? length;
  final String? lure;
  final String? notes;
  final String? photoUrl;
  final DateTime caughtAt;
  final DateTime? createdAt;

  CatchModel({
    required this.id,
    this.spotId,
    this.spotName,
    required this.species,
    this.weight,
    this.length,
    this.lure,
    this.notes,
    this.photoUrl,
    required this.caughtAt,
    this.createdAt,
  });

  factory CatchModel.fromJson(Map<String, dynamic> json) {
    double? parsedWeight;
    if (json['weight'] != null) {
      parsedWeight = double.tryParse(json['weight'].toString());
    }

    double? parsedLength;
    if (json['length'] != null) {
      parsedLength = double.tryParse(json['length'].toString());
    }

    DateTime parsedDate = DateTime.now();
    final rawDate = json['caughtAt'] ?? json['caught_at'] ?? json['createdAt'];
    if (rawDate != null) {
      parsedDate = DateTime.tryParse(rawDate.toString()) ?? DateTime.now();
    }

    return CatchModel(
      id: json['id']?.toString() ?? '',
      spotId: json['spotId']?.toString() ?? json['spot_id']?.toString(),
      spotName:
          json['spot']?['name']?.toString() ?? json['spotName']?.toString(),
      species: json['species']?.toString() ?? 'Unknown Fish',
      weight: parsedWeight,
      length: parsedLength,
      lure: json['lure']?.toString(),
      notes: json['notes']?.toString(),
      photoUrl: json['photoUrl']?.toString() ?? json['photo_url']?.toString(),
      caughtAt: parsedDate,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'].toString())
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      if (spotId != null) 'spotId': spotId,
      'species': species,
      if (weight != null) 'weight': weight,
      if (length != null) 'length': length,
      if (lure != null) 'lure': lure,
      if (notes != null) 'notes': notes,
      if (photoUrl != null) 'photoUrl': photoUrl,
      'caughtAt': caughtAt.toIso8601String(),
    };
  }
}
