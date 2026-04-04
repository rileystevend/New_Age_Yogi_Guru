/**
 * New Age Yogi Guru color palette
 * Warm earth tones inspired by yoga studio aesthetics
 */

const palette = {
  // Primary - warm terracotta
  terracotta: '#C67B5C',
  terracottaLight: '#D4956F',
  terracottaDark: '#A65E3F',

  // Secondary - sage green
  sage: '#8B9E7E',
  sageLight: '#A8B89D',
  sageDark: '#6B7E5E',

  // Neutrals - warm cream to charcoal
  cream: '#F5E6D3',
  sand: '#E8D5C0',
  warmGray: '#B0A090',
  charcoal: '#3A3530',
  darkBrown: '#2C2520',

  // Accents
  gold: '#D4A843',
  softWhite: '#FAF7F2',
  deepPlum: '#5C3D5E',

  // Semantic
  error: '#C44B4B',
  success: '#6B8E5A',
  warning: '#D4A843',
};

export default {
  light: {
    text: palette.charcoal,
    textSecondary: palette.warmGray,
    background: palette.softWhite,
    surface: '#FFFFFF',
    tint: palette.terracotta,
    tabIconDefault: palette.warmGray,
    tabIconSelected: palette.terracotta,
    border: palette.sand,
    ...palette,
  },
  dark: {
    text: palette.cream,
    textSecondary: palette.warmGray,
    background: palette.darkBrown,
    surface: palette.charcoal,
    tint: palette.terracottaLight,
    tabIconDefault: palette.warmGray,
    tabIconSelected: palette.terracottaLight,
    border: '#4A4540',
    ...palette,
  },
};
