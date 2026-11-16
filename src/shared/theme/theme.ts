/**
 * Semantic theme for React Native, derived from the generated design tokens
 * (mmPosWeb/design is the single source). Components use these names —
 * never literal colours or sizes (see noLiteralColors.test.ts).
 *
 * Dark only, like the shipped web and POS themes: the design system's light
 * theme is still "proposed" (docs/decisions.md D6).
 */
import { tokens } from './tokens.generated.ts'
import { withOpacity } from './color.ts'

const c = tokens.color
const [, s1, s2, s3, s4, s5, s6, s8, s10, s12, s16] = tokens.space

export const theme = {
  color: {
    page: c.base200,
    surface: c.base100,
    chrome: c.base300,
    border: c.base300,
    text: c.content,
    textSecondary: withOpacity(c.content, tokens.opacity.textSecondary),
    textMuted: withOpacity(c.content, tokens.opacity.textMuted),
    textSubtle: withOpacity(c.content, tokens.opacity.textSubtle),
    textFaint: withOpacity(c.content, tokens.opacity.textFaint),
    primary: c.primary,
    secondary: c.secondary,
    accent: c.accent,
    neutral: c.neutral,
    info: c.info,
    success: c.success,
    warning: c.warning,
    error: c.error,
    on: c.on,
    primaryTint: withOpacity(c.primary, tokens.opacity.tintBackground),
    infoTint: withOpacity(c.info, tokens.opacity.tintBackground),
    warningTint: withOpacity(c.warning, tokens.opacity.tintBackground),
    errorTint: withOpacity(c.error, tokens.opacity.tintBackground),
    module: c.module
  },
  space: { xs: s1, sm: s2, md: s3, lg: s4, xl: s5, xxl: s6, x3: s8, x4: s10, x5: s12, x6: s16 },
  gutter: tokens.pageGutter,
  cardPadding: tokens.cardPadding,
  cardPaddingLarge: tokens.cardPaddingLarge,
  radius: tokens.radius,
  borderWidth: tokens.borderWidth,
  fontSize: tokens.fontSize,
  lineHeight: tokens.lineHeight,
  touch: tokens.touch,
  icon: tokens.icon,
  motion: tokens.motion,
  opacity: tokens.opacity,
  // Font family names registered by useAppFonts (src/shared/theme/fonts.ts).
  font: {
    display: 'PlusJakartaSans_800ExtraBold',
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold'
  }
} as const

export type Theme = typeof theme
export type ToneName = 'primary' | 'info' | 'success' | 'warning' | 'error' | 'neutral'
