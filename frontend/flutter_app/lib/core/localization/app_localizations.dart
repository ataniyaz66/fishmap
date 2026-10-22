import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// Comprehensive localization support for Russian (ru), Kazakh (kk), and English (en).
class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations) ??
        AppLocalizations(const Locale('ru'));
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static const List<Locale> supportedLocales = [
    Locale('ru'),
    Locale('kk'),
    Locale('en'),
  ];

  String get languageCode => locale.languageCode;

  String translate(String key) => text(key);

  // Dictionary maps: key -> { 'ru': ..., 'kk': ..., 'en': ... }
  static const Map<String, Map<String, String>> _localizedValues = {
    // Navigation
    'feed': {'ru': 'Лента', 'kk': 'Таспа', 'en': 'Feed'},
    'map': {'ru': 'Карта', 'kk': 'Карта', 'en': 'Map'},
    'anglers': {'ru': 'Рыболовы', 'kk': 'Балықшылар', 'en': 'Anglers'},
    'messages': {'ru': 'Сообщения', 'kk': 'Хабарламалар', 'en': 'Messages'},
    'profile': {'ru': 'Профиль', 'kk': 'Профиль', 'en': 'Profile'},
    'journal': {'ru': 'Дневник', 'kk': 'Күнделік', 'en': 'Journal'},
    'tackle': {'ru': 'Снасти', 'kk': 'Құралдар', 'en': 'Tackle'},
    'weather': {'ru': 'Погода', 'kk': 'Ауа райы', 'en': 'Weather'},
    'aiAdvisor': {'ru': 'ИИ-Советник', 'kk': 'ЖИ-Кеңесші', 'en': 'AI Advisor'},
    'settings': {'ru': 'Настройки', 'kk': 'Баптаулар', 'en': 'Settings'},
    'notifications': {
      'ru': 'Уведомления',
      'kk': 'Хабарламалар',
      'en': 'Activity',
    },

    // Actions & Buttons
    'newPost': {'ru': 'Новый пост', 'kk': 'Жаңа жазба', 'en': 'New Post'},
    'logCatch': {'ru': 'Записать улов', 'kk': 'Олжаны жазу', 'en': 'Log Catch'},
    'addSpot': {
      'ru': 'Добавить точку',
      'kk': 'Орын қосу',
      'en': 'Add Fishing Spot',
    },
    'addTackle': {
      'ru': 'Добавить снасть',
      'kk': 'Құрал қосу',
      'en': 'Add Tackle',
    },
    'like': {'ru': 'Нравится', 'kk': 'Ұнайды', 'en': 'Like'},
    'comment': {'ru': 'Комментировать', 'kk': 'Пікір жазу', 'en': 'Comment'},
    'comments': {'ru': 'Комментарии', 'kk': 'Пікірлер', 'en': 'Comments'},
    'share': {'ru': 'Поделиться', 'kk': 'Бөлісу', 'en': 'Share'},
    'save': {'ru': 'Сохранить', 'kk': 'Сақтау', 'en': 'Save'},
    'cancel': {'ru': 'Отмена', 'kk': 'Болдырмау', 'en': 'Cancel'},
    'delete': {'ru': 'Удалить', 'kk': 'Өшіру', 'en': 'Delete'},
    'edit': {'ru': 'Редактировать', 'kk': 'Өңдеу', 'en': 'Edit'},
    'editProfile': {
      'ru': 'Редактировать профиль',
      'kk': 'Профильді өңдеу',
      'en': 'Edit Profile',
    },
    'search': {'ru': 'Поиск', 'kk': 'Іздеу', 'en': 'Search'},
    'refresh': {'ru': 'Обновить', 'kk': 'Жаңарту', 'en': 'Refresh'},
    'publish': {'ru': 'Опубликовать', 'kk': 'Жариялау', 'en': 'Publish'},
    'signOut': {'ru': 'Выйти', 'kk': 'Шығу', 'en': 'Sign Out'},
    'logout': {'ru': 'Выйти', 'kk': 'Шығу', 'en': 'Sign Out'},
    'signIn': {'ru': 'Войти', 'kk': 'Кіру', 'en': 'Sign In'},
    'login': {'ru': 'Войти', 'kk': 'Кіру', 'en': 'Sign In'},
    'register': {'ru': 'Регистрация', 'kk': 'Тіркелу', 'en': 'Register'},

    // Social & Friends
    'findAnglers': {
      'ru': 'Поиск рыболовов',
      'kk': 'Балықшыларды табу',
      'en': 'Find Anglers',
    },
    'searchAnglersHint': {
      'ru': 'Поиск по имени или логину...',
      'kk': 'Аты немесе логин бойынша іздеу...',
      'en': 'Search by name or username...',
    },
    'friendRequests': {
      'ru': 'Заявки в друзья',
      'kk': 'Достық сұраныстары',
      'en': 'Friend Requests',
    },
    'addFriend': {
      'ru': 'Добавить в друзья',
      'kk': 'Дос болу',
      'en': 'Add Friend',
    },
    'requestSent': {
      'ru': 'Запрос отправлен',
      'kk': 'Сұраныс жіберілді',
      'en': 'Request Sent',
    },
    'requestReceived': {
      'ru': 'Входящий запрос',
      'kk': 'Кіріс сұраныс',
      'en': 'Incoming Request',
    },
    'friends': {'ru': 'Друзья', 'kk': 'Достар', 'en': 'Friends'},
    'accept': {'ru': 'Принять', 'kk': 'Қабылдау', 'en': 'Accept'},
    'decline': {'ru': 'Отклонить', 'kk': 'Қабылдамау', 'en': 'Decline'},
    'removeFriend': {
      'ru': 'Удалить из друзей',
      'kk': 'Достардан өшіру',
      'en': 'Remove Friend',
    },
    'startChat': {
      'ru': 'Написать сообщение',
      'kk': 'Хабарлама жазу',
      'en': 'Send Message',
    },
    'noFriendsYet': {
      'ru': 'У вас пока нет друзей',
      'kk': 'Әзірге достарыңыз жоқ',
      'en': 'No friends added yet',
    },
    'noRequests': {
      'ru': 'Нет входящих заявок',
      'kk': 'Кіріс сұраныстар жоқ',
      'en': 'No incoming requests',
    },

    // Feed & Posts
    'communityFeed': {
      'ru': 'Рыболовная лента',
      'kk': 'Балықшылар таспасы',
      'en': 'Angler Feed',
    },
    'feedEmptyTitle': {
      'ru': 'В ленте пока пусто',
      'kk': 'Таспада әзірге жазба жоқ',
      'en': 'Your feed is quiet',
    },
    'feedEmptyDesc': {
      'ru': 'Поделитесь своим первым уловом или найдите других рыболовов!',
      'kk':
          'Алғашқы олжаңызбен бөлісіңіз немесе басқа балықшыларды табыңыз!',
      'en': 'Share your first catch or connect with fellow anglers!',
    },
    'writePostHint': {
      'ru': 'Что ловится сегодня? Поделитесь с сообществом...',
      'kk': 'Бүгін не ауланды? Қауымдастықпен бөлісіңіз...',
      'en': 'What is biting today? Share with the community...',
    },
    'attachSpot': {
      'ru': 'Прикрепить водоём/точку',
      'kk': 'Орынды/су қоймасын қосу',
      'en': 'Tag Fishing Spot',
    },
    'tagSpecies': {
      'ru': 'Указать рыбу',
      'kk': 'Балық түрін көрсету',
      'en': 'Tag Fish Species',
    },

    // Map & Location
    'fishingMap': {
      'ru': 'Интерактивная карта',
      'kk': 'Интерактивті карта',
      'en': 'Fishing Map',
    },
    'mapSearchHint': {
      'ru': 'Поиск водоёма, реки или города...',
      'kk': 'Су қоймасын, өзенді немесе қаланы іздеу...',
      'en': 'Search lakes, rivers, or cities...',
    },
    'myLocation': {
      'ru': 'Моё местоположение',
      'kk': 'Менің орным',
      'en': 'My Location',
    },
    'astanaCenter': {
      'ru': 'Астана, Казахстан',
      'kk': 'Астана, Қазақстан',
      'en': 'Astana, Kazakhstan',
    },
    'spotDetails': {
      'ru': 'Информация о точке',
      'kk': 'Орын туралы ақпарат',
      'en': 'Spot Details',
    },
    'targetSpecies': {
      'ru': 'Целевая рыба',
      'kk': 'Ауланатын балықтар',
      'en': 'Target Species',
    },
    'waterType': {
      'ru': 'Тип водоёма',
      'kk': 'Су қоймасының түрі',
      'en': 'Water Body Type',
    },
    'freshwater': {
      'ru': 'Пресный (река/озеро)',
      'kk': 'Тұщы (өзен/көл)',
      'en': 'Freshwater (river/lake)',
    },
    'saltwater': {
      'ru': 'Морской / Солёный',
      'kk': 'Тұзды су',
      'en': 'Saltwater / Marine',
    },
    'brackish': {
      'ru': 'Солоноватый (лиман/ильмень)',
      'kk': 'Ащылау су',
      'en': 'Brackish Water',
    },

    // Weather & AI
    'marineWeather': {
      'ru': 'Рыболовная погода',
      'kk': 'Балық аулау ауа райы',
      'en': 'Marine Weather',
    },
    'anglingSuitability': {
      'ru': 'Клёв и условия',
      'kk': 'Қабу мүмкіндігі мен жағдай',
      'en': 'Angling Suitability',
    },
    'score': {'ru': 'Индекс клёва', 'kk': 'Қабу индексі', 'en': 'Bite Index'},
    'wind': {'ru': 'Ветер', 'kk': 'Жел', 'en': 'Wind'},
    'pressure': {'ru': 'Давление', 'kk': 'Қысым', 'en': 'Pressure'},
    'temperature': {'ru': 'Температура', 'kk': 'Температура', 'en': 'Temp'},
    'aiAdvisorTitle': {
      'ru': 'Интеллектуальный помощник',
      'kk': 'Зияткерлік көмекші',
      'en': 'AI Fishing Advisor',
    },
    'lureRecommendation': {
      'ru': 'Подбор приманки',
      'kk': 'Жем таңдау',
      'en': 'Lure Recommendation',
    },
    'askAiHint': {
      'ru': 'Спросите совет по тактике, узлам или проводке...',
      'kk': 'Әдіс, түйін немесе балық аулау бойынша сұраңыз...',
      'en': 'Ask tactics, knot advice, or retrieval styles...',
    },

    // Profile & Settings
    'personalBests': {
      'ru': 'Личные трофеи',
      'kk': 'Жеке рекордтар',
      'en': 'Personal Records',
    },
    'catchesCount': {'ru': 'Уловов', 'kk': 'Олжалар', 'en': 'Catches'},
    'postsCount': {'ru': 'Публикаций', 'kk': 'Жазбалар', 'en': 'Posts'},
    'friendsCount': {'ru': 'Друзей', 'kk': 'Достар', 'en': 'Friends'},
    'recentCatches': {
      'ru': 'Последние уловы',
      'kk': 'Соңғы олжалар',
      'en': 'Recent Catches',
    },
    'tackleInventory': {
      'ru': 'Коробка со снастями',
      'kk': 'Құрал-сайман қорабы',
      'en': 'Tackle Box',
    },
    'appLanguage': {
      'ru': 'Язык интерфейса',
      'kk': 'Қолданба тілі',
      'en': 'Application Language',
    },
    'gatewayConfig': {
      'ru': 'Шлюз API',
      'kk': 'API шлюзі',
      'en': 'API Gateway',
    },

    // Fish Species Names
    'carp_sazan': {
      'ru': 'Сазан (Карп)',
      'kk': 'Сазан (Тұқы)',
      'en': 'Common Carp',
    },
    'northern_pike': {
      'ru': 'Щука',
      'kk': 'Шортан',
      'en': 'Northern Pike',
    },
    'crucian_carp': {
      'ru': 'Карась',
      'kk': 'Мөңке',
      'en': 'Crucian Carp',
    },
    'zander_sudak': {'ru': 'Судак', 'kk': 'Көксерке', 'en': 'Zander'},
    'perch_okun': {'ru': 'Окунь', 'kk': 'Алабұға', 'en': 'European Perch'},
    'bream_lesh': {'ru': 'Лещ', 'kk': 'Тыран', 'en': 'Common Bream'},
    'catfish_som': {'ru': 'Сом', 'kk': 'Жайын', 'en': 'Wels Catfish'},
    'roach_plotva': {'ru': 'Плотва (Вобла)', 'kk': 'Қызылкөз (Қаракөз)', 'en': 'Roach'},
    'asp_zherekh': {'ru': 'Жерех', 'kk': 'Ақмарқа', 'en': 'Asp'},
    'trout_forel': {'ru': 'Форель', 'kk': 'Бахтах', 'en': 'Trout'},
    'burbot_nalim': {'ru': 'Налим', 'kk': 'Түрке', 'en': 'Burbot'},
    'silver_carp': {
      'ru': 'Толстолобик',
      'kk': 'Дөңмаңдай',
      'en': 'Silver Carp',
    },

    // Tackle Categories
    'cat_rod': {'ru': 'Удилище', 'kk': 'Қармақ', 'en': 'Rod'},
    'cat_reel': {'ru': 'Катушка', 'kk': 'Ғарнақ', 'en': 'Reel'},
    'cat_line': {'ru': 'Леска / Шнур', 'kk': 'Жіп / Бау', 'en': 'Line'},
    'cat_lure': {'ru': 'Воблер / Блесна', 'kk': 'Жем / Жылтырақ', 'en': 'Hard Lure'},
    'cat_soft_plastic': {
      'ru': 'Силикон / Твистер',
      'kk': 'Силикон жем',
      'en': 'Soft Plastic',
    },
    'cat_terminal_tackle': {
      'ru': 'Оснастка / Крючки',
      'kk': 'Қармақ ілмектері',
      'en': 'Hooks & Rigs',
    },
    'cat_accessory': {
      'ru': 'Инструмент / Подсак',
      'kk': 'Құрал-сайман',
      'en': 'Gear & Tools',
    },
  };

  String text(String key) {
    final entry = _localizedValues[key];
    if (entry == null) return key;
    return entry[locale.languageCode] ?? entry['ru'] ?? entry['en'] ?? key;
  }

  /// Helper getter syntax for high-frequency terms
  String get feed => text('feed');
  String get map => text('map');
  String get anglers => text('anglers');
  String get messages => text('messages');
  String get profile => text('profile');
  String get journal => text('journal');
  String get tackle => text('tackle');
  String get weather => text('weather');
  String get aiAdvisor => text('aiAdvisor');
  String get settings => text('settings');
  String get newPost => text('newPost');
  String get logCatch => text('logCatch');
  String get addSpot => text('addSpot');
  String get addFriend => text('addFriend');
  String get requestSent => text('requestSent');
  String get requestReceived => text('requestReceived');
  String get friends => text('friends');
  String get accept => text('accept');
  String get decline => text('decline');
  String get removeFriend => text('removeFriend');
  String get searchAnglersHint => text('searchAnglersHint');
  String get findAnglers => text('findAnglers');
  String get friendRequests => text('friendRequests');
  String get notifications => text('notifications');
  String get comments => text('comments');
  String get share => text('share');
  String get save => text('save');
  String get cancel => text('cancel');
  String get delete => text('delete');
  String get editProfile => text('editProfile');
  String get refresh => text('refresh');
  String get publish => text('publish');
  String get astanaCenter => text('astanaCenter');

  /// Localize fish name by ID or fallback
  String fishName(String speciesId) {
    final key = speciesId.toLowerCase().replaceAll(' ', '_');
    if (_localizedValues.containsKey(key)) {
      return text(key);
    }
    // Check known IDs
    switch (key) {
      case 'carp':
      case 'sazan':
      case 'common_carp':
        return text('carp_sazan');
      case 'pike':
      case 'northern_pike':
        return text('northern_pike');
      case 'crucian':
      case 'crucian_carp':
        return text('crucian_carp');
      case 'zander':
      case 'sudak':
      case 'walleye':
        return text('zander_sudak');
      case 'perch':
      case 'european_perch':
        return text('perch_okun');
      case 'bream':
      case 'common_bream':
        return text('bream_lesh');
      case 'catfish':
      case 'som':
      case 'wels_catfish':
        return text('catfish_som');
      case 'roach':
      case 'plotva':
      case 'vobla':
        return text('roach_plotva');
      default:
        return speciesId;
    }
  }

  /// Localize tackle category
  String tackleCategory(String cat) {
    final key = 'cat_${cat.toLowerCase().replaceAll(' ', '_')}';
    if (_localizedValues.containsKey(key)) {
      return text(key);
    }
    return cat;
  }
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['ru', 'kk', 'en'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(AppLocalizations(locale));
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
