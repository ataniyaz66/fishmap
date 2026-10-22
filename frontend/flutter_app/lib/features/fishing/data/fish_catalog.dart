import '../models/fish_species.dart';

class FishCatalog {
  FishCatalog._();

  static const List<FishSpecies> allSpecies = [
    FishSpecies(
      id: 'carp_sazan',
      nameRu: 'Сазан (Карп)',
      nameKk: 'Сазан (Тұқы)',
      nameEn: 'Common Carp',
      scientificName: 'Cyprinus carpio',
      recordWeightKg: 28.5,
      minSizeCm: 35.0,
      description:
          'Мощная донная рыба, обитающая в бассейнах Сырдарьи, Или, Балхаша и водохранилищ.',
      waterType: 'freshwater',
    ),
    FishSpecies(
      id: 'northern_pike',
      nameRu: 'Щука',
      nameKk: 'Шортан',
      nameEn: 'Northern Pike',
      scientificName: 'Esox lucius',
      recordWeightKg: 22.0,
      minSizeCm: 45.0,
      description:
          'Главный хищник рек и озёр Северного и Центрального Казахстана (Ишим, Иртыш, Нура).',
      waterType: 'freshwater',
    ),
    FishSpecies(
      id: 'zander_sudak',
      nameRu: 'Судак',
      nameKk: 'Көксерке',
      nameEn: 'Zander',
      scientificName: 'Sander lucioperca',
      recordWeightKg: 15.2,
      minSizeCm: 40.0,
      description:
          'Ценный хищник с отличным ночным зрением. Популярен на Капшагае, Балхаше и водохранилищах.',
      waterType: 'freshwater',
    ),
    FishSpecies(
      id: 'crucian_carp',
      nameRu: 'Карась (Золотой/Серебряный)',
      nameKk: 'Мөңке',
      nameEn: 'Crucian Carp',
      scientificName: 'Carassius carassius / gibelio',
      recordWeightKg: 3.2,
      minSizeCm: 18.0,
      description:
          'Выносливая мирная рыба, широко распространённая по всему Казахстану.',
      waterType: 'freshwater',
    ),
    FishSpecies(
      id: 'perch_okun',
      nameRu: 'Окунь',
      nameKk: 'Алабұға',
      nameEn: 'European Perch',
      scientificName: 'Perca fluviatilis',
      recordWeightKg: 2.8,
      minSizeCm: 15.0,
      description:
          'Полосатый хищник стайного образа жизни. Отлично ловится на микроджиг и блёсны.',
      waterType: 'freshwater',
    ),
    FishSpecies(
      id: 'catfish_som',
      nameRu: 'Сом обыкновенный',
      nameKk: 'Жайын',
      nameEn: 'Wels Catfish',
      scientificName: 'Silurus glanis',
      recordWeightKg: 110.0,
      minSizeCm: 70.0,
      description:
          'Крупнейший пресноводный гигант водоёмов юга и запада Казахстана (Сырдарья, Балхаш, Или).',
      waterType: 'freshwater',
    ),
    FishSpecies(
      id: 'bream_lesh',
      nameRu: 'Лещ',
      nameKk: 'Тыран',
      nameEn: 'Common Bream',
      scientificName: 'Abramis brama',
      recordWeightKg: 6.0,
      minSizeCm: 25.0,
      description:
          'Широкотелая донная рыба, излюбленный объект фидерной и поплавочной ловли.',
      waterType: 'freshwater',
    ),
    FishSpecies(
      id: 'roach_plotva',
      nameRu: 'Плотва / Вобла',
      nameKk: 'Қызылкөз / Қаракөз',
      nameEn: 'Roach / Caspian Roach',
      scientificName: 'Rutilus rutilus',
      recordWeightKg: 1.8,
      minSizeCm: 14.0,
      description:
          'Многочисленная стайная рыба. Каспийская вобла — легендарный бренд региона.',
      waterType: 'freshwater',
    ),
    FishSpecies(
      id: 'asp_zherekh',
      nameRu: 'Жерех',
      nameKk: 'Ақмарқа',
      nameEn: 'Asp',
      scientificName: 'Leuciscus aspius',
      recordWeightKg: 9.5,
      minSizeCm: 40.0,
      description:
          'Стремительный верховой хищник с мощными поклёвками на течении.',
      waterType: 'freshwater',
    ),
    FishSpecies(
      id: 'trout_forel',
      nameRu: 'Форель ручьевая / радужная',
      nameKk: 'Бахтах',
      nameEn: 'Trout',
      scientificName: 'Salmo trutta / Oncorhynchus mykiss',
      recordWeightKg: 8.0,
      minSizeCm: 25.0,
      description:
          'Обитатель горных холодных рек Заилийского Алатау, Алтая и Тянь-Шаня.',
      waterType: 'freshwater',
    ),
    FishSpecies(
      id: 'burbot_nalim',
      nameRu: 'Налим',
      nameKk: 'Түрке',
      nameEn: 'Burbot',
      scientificName: 'Lota lota',
      recordWeightKg: 12.0,
      minSizeCm: 40.0,
      description:
          'Единственный пресноводный представитель тресковых. Активен поздней осенью и зимой.',
      waterType: 'freshwater',
    ),
    FishSpecies(
      id: 'silver_carp',
      nameRu: 'Толстолобик',
      nameKk: 'Дөңмаңдай',
      nameEn: 'Silver Carp',
      scientificName: 'Hypophthalmichthys molitrix',
      recordWeightKg: 35.0,
      minSizeCm: 50.0,
      description:
          'Крупный фильтратор, обитает в тёплых водохранилищах и реках юга.',
      waterType: 'freshwater',
    ),
  ];

  static FishSpecies? findById(String id) {
    try {
      return allSpecies.firstWhere(
        (s) => s.id.toLowerCase() == id.toLowerCase(),
      );
    } catch (_) {
      return null;
    }
  }

  static String getDisplayName(String rawSpecies, String languageCode) {
    final lower = rawSpecies.toLowerCase().trim();
    for (final sp in allSpecies) {
      if (sp.id.toLowerCase() == lower ||
          sp.nameRu.toLowerCase().contains(lower) ||
          sp.nameEn.toLowerCase().contains(lower) ||
          sp.nameKk.toLowerCase().contains(lower)) {
        return sp.getLocalizedName(languageCode);
      }
    }
    return rawSpecies;
  }

  static List<FishSpecies> search(String query, String languageCode) {
    if (query.trim().isEmpty) return allSpecies;
    final q = query.toLowerCase().trim();
    return allSpecies.where((s) {
      return s.getLocalizedName(languageCode).toLowerCase().contains(q) ||
          s.nameRu.toLowerCase().contains(q) ||
          s.nameKk.toLowerCase().contains(q) ||
          s.nameEn.toLowerCase().contains(q) ||
          s.scientificName.toLowerCase().contains(q);
    }).toList();
  }
}
