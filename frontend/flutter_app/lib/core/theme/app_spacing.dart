import 'package:flutter/material.dart';

/// Spacing and border radii scales based on a 4/8-pt grid system.
class AppSpacing {
  AppSpacing._();

  static const double xxs = 4.0;
  static const double xs = 8.0;
  static const double sm = 12.0;
  static const double md = 16.0;
  static const double lg = 24.0;
  static const double xl = 32.0;
  static const double xxl = 48.0;

  // Corner Radii
  static const double radiusSmall = 10.0;
  static const double radiusMedium = 16.0;
  static const double radiusLarge = 24.0;
  static const double radiusFull = 999.0;

  static const BorderRadius roundedSmall = BorderRadius.all(
    Radius.circular(radiusSmall),
  );
  static const BorderRadius roundedMedium = BorderRadius.all(
    Radius.circular(radiusMedium),
  );
  static const BorderRadius roundedLarge = BorderRadius.all(
    Radius.circular(radiusLarge),
  );
}
