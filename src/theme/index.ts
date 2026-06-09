export const theme = {
  colors: {
    // Brand / accent (kept as 6-digit hex so `primary + '15'` alpha tricks keep working)
    primary: '#A855F7',
    primaryLight: '#C4A0FF',
    primaryDark: '#7C3AED',
    accent: '#22D3EE',
    onPrimary: '#FFFFFF',

    // Surfaces (deep violet-black)
    background: '#0A0712',
    backgroundSecondary: '#16111F',
    surface: 'rgba(255, 255, 255, 0.045)',
    surfaceElevated: 'rgba(255, 255, 255, 0.07)',
    surfaceSolid: '#181225',

    // Text
    text: '#F4F1FB',
    textSecondary: 'rgba(244, 241, 251, 0.62)',
    textTertiary: 'rgba(244, 241, 251, 0.38)',

    // Borders / hairlines
    border: 'rgba(255, 255, 255, 0.12)',
    borderLight: 'rgba(255, 255, 255, 0.07)',
    glassBorder: 'rgba(255, 255, 255, 0.16)',

    // Status
    error: '#FF5C72',
    success: '#34D399',

    // Pure tile (white card behind QR codes)
    tile: '#FFFFFF',
  },
  gradients: {
    brand: ['#C084FC', '#8B5CF6', '#6D28D9'] as const,
    brandSoft: ['rgba(192,132,252,0.22)', 'rgba(109,40,217,0.10)'] as const,
    background: ['#0A0712', '#130C20', '#0A0712'] as const,
    card: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'] as const,
    glow: ['rgba(168,85,247,0.35)', 'rgba(168,85,247,0)'] as const,
  },
  fonts: {
    family: 'Abel_400Regular',
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 34,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 10,
    md: 16,
    lg: 22,
    xl: 30,
    pill: 999,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 18,
      elevation: 8,
    },
    glow: {
      shadowColor: '#A855F7',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.55,
      shadowRadius: 20,
      elevation: 10,
    },
  },
};

export type Theme = typeof theme;
