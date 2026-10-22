class FishSpecies {
  final String id;
  final String nameRu;
  final String nameKk;
  final String nameEn;
  final String scientificName;
  final double recordWeightKg;
  final double minSizeCm;
  final String description;
  final String waterType;

  const FishSpecies({
    required this.id,
    required this.nameRu,
    required this.nameKk,
    required this.nameEn,
    required this.scientificName,
    required this.recordWeightKg,
    required this.minSizeCm,
    required this.description,
    this.waterType = 'freshwater',
  });

  String getLocalizedName(String languageCode) {
    switch (languageCode) {
      case 'kk':
        return nameKk;
      case 'en':
        return nameEn;
      case 'ru':
      default:
        return nameRu;
    }
  }
}
