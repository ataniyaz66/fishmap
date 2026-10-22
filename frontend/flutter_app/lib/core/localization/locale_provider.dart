import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocaleProvider extends ChangeNotifier {
  static const String _prefKey = 'fishmap_language_code';

  Locale _locale = const Locale('ru');

  Locale get locale => _locale;
  String get languageCode => _locale.languageCode;

  LocaleProvider() {
    _loadSavedLocale();
  }

  Future<void> _loadSavedLocale() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedCode = prefs.getString(_prefKey);

      if (savedCode != null && ['ru', 'kk', 'en'].contains(savedCode)) {
        _locale = Locale(savedCode);
      } else {
        // Check device platform locale
        final deviceLocale = ui.PlatformDispatcher.instance.locale;
        final devCode = deviceLocale.languageCode.toLowerCase();
        if (['ru', 'kk', 'en'].contains(devCode)) {
          _locale = Locale(devCode);
        } else {
          // Default to Russian per requirements
          _locale = const Locale('ru');
        }
      }
      notifyListeners();
    } catch (_) {}
  }

  Future<void> setLocale(Locale newLocale) async {
    if (!['ru', 'kk', 'en'].contains(newLocale.languageCode)) return;
    if (_locale == newLocale) return;

    _locale = newLocale;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefKey, newLocale.languageCode);
    } catch (_) {}
  }

  Future<void> setLanguageCode(String code) async {
    await setLocale(Locale(code));
  }
}
