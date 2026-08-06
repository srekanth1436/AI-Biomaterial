import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand Palette
  static const Color primary = Color(0xFF10B981);       // Emerald 500
  static const Color primaryDark = Color(0xFF059669);   // Emerald 600
  static const Color primaryLight = Color(0xFF34D399);  // Emerald 400
  static const Color surfaceDark = Color(0xFF070A12);   // Slate 950 Deep
  static const Color cardDark = Color(0xFF0F172A);      // Slate 900 Glass
  static const Color cardBorder = Color(0xFF1E293B);    // Slate 800
  static const Color accentBlue = Color(0xFF3B82F6);    // Blue 500
  static const Color accentCyan = Color(0xFF06B6D4);    // Cyan 500
  static const Color accentPurple = Color(0xFF8B5CF6);  // Purple 500
  static const Color accentAmber = Color(0xFFF59E0B);   // Amber 500

  // Gradients
  static const LinearGradient emeraldCyanGradient = LinearGradient(
    colors: [Color(0xFF10B981), Color(0xFF06B6D4)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroGradient = LinearGradient(
    colors: [Color(0xFF022C22), Color(0xFF0F172A), Color(0xFF064E3B)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient cardGradient = LinearGradient(
    colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient glassmorphismGradient = LinearGradient(
    colors: [Color(0x2610B981), Color(0x0D06B6D4)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static ThemeData get darkTheme {
    return ThemeData.dark().copyWith(
      scaffoldBackgroundColor: surfaceDark,
      primaryColor: primary,
      colorScheme: const ColorScheme.dark(
        primary: primary,
        secondary: primaryDark,
        surface: cardDark,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      appBarTheme: const AppBarTheme(
        backgroundColor: surfaceDark,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: cardDark,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: cardBorder),
        ),
      ),
    );
  }
}
