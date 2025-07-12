import 'package:flutter/material.dart';

class AppTheme {
  // Color palette
  static const Color primaryTomato = Color(0xFFEF4444);
  static const Color primaryCream = Color(0xFFFAF8F5);
  static const Color primaryCharcoal = Color(0xFF2F2F2F);
  static const Color primaryBasil = Color(0xFF4CAF50);
  static const Color primaryMustard = Color(0xFFF4C430);

  static const Color textPrimary = Color(0xFF2F2F2F);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textLight = Color(0xFFFFFFFF);

  static const Color backgroundMain = Color(0xFFFAF8F5);
  static const Color backgroundCard = Color(0xFFFFFFFF);

  static const Color statusEasy = Color(0xFF4CAF50);
  static const Color statusMedium = Color(0xFFF4C430);
  static const Color statusHard = Color(0xFFEF4444);

  // Color scheme
  static const ColorScheme colorScheme = ColorScheme(
    brightness: Brightness.light,
    primary: primaryTomato,
    onPrimary: textLight,
    secondary: primaryBasil,
    onSecondary: textLight,
    error: Color(0xFFEF4444),
    onError: textLight,
    background: backgroundMain,
    onBackground: textPrimary,
    surface: backgroundCard,
    onSurface: textPrimary,
  );

  // Spacing
  static const double spacingXs = 4.0;
  static const double spacingSm = 8.0;
  static const double spacingMd = 16.0;
  static const double spacingLg = 24.0;
  static const double spacingXl = 32.0;
  static const double spacingXxl = 48.0;

  // Border radius
  static const double radiusXs = 4.0;
  static const double radiusSm = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 24.0;
  static const double radiusFull = 9999.0;

  // Text styles
  static const TextStyle heading1 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: textPrimary,
  );

  static const TextStyle heading2 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: textPrimary,
  );

  static const TextStyle heading3 = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w500,
    color: textPrimary,
  );

  static const TextStyle bodyText = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    color: textPrimary,
  );

  static const TextStyle bodyTextSmall = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: textSecondary,
  );

  static const TextStyle captionText = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w500,
    color: textSecondary,
    letterSpacing: 1.0,
  );

  // Button styles
  static ButtonStyle get primaryButtonStyle => ElevatedButton.styleFrom(
    backgroundColor: primaryTomato,
    foregroundColor: textLight,
    padding: const EdgeInsets.symmetric(
      horizontal: spacingLg,
      vertical: spacingMd,
    ),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(radiusMd),
    ),
  );

  static ButtonStyle get secondaryButtonStyle => OutlinedButton.styleFrom(
    foregroundColor: textPrimary,
    side: const BorderSide(color: Color(0xFFE5E7EB)),
    padding: const EdgeInsets.symmetric(
      horizontal: spacingLg,
      vertical: spacingMd,
    ),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(radiusMd),
    ),
  );

  // Card decoration
  static BoxDecoration get cardDecoration => BoxDecoration(
    color: backgroundCard,
    borderRadius: BorderRadius.circular(radiusMd),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.1),
        blurRadius: 4,
        offset: const Offset(0, 2),
      ),
    ],
  );

  static BoxDecoration get elevatedCardDecoration => BoxDecoration(
    color: backgroundCard,
    borderRadius: BorderRadius.circular(radiusMd),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.15),
        blurRadius: 8,
        offset: const Offset(0, 4),
      ),
    ],
  );
}