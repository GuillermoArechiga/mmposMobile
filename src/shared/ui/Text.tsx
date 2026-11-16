import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native'
import { theme } from '@/shared/theme/theme'

type Variant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption' | 'money'
type Tone = 'default' | 'secondary' | 'muted' | 'subtle' | 'primary' | 'error' | 'onPrimary'

export type TextProps = RNTextProps & {
  variant?: Variant
  tone?: Tone
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
}

const VARIANT: Record<Variant, TextStyle> = {
  display: {
    fontFamily: theme.font.display,
    fontSize: theme.fontSize['3xl'],
    letterSpacing: -0.02 * theme.fontSize['3xl'],
    lineHeight: theme.fontSize['3xl'] * theme.lineHeight.tight
  },
  title: {
    fontFamily: theme.font.display,
    fontSize: theme.fontSize['2xl'],
    letterSpacing: -0.02 * theme.fontSize['2xl'],
    lineHeight: theme.fontSize['2xl'] * theme.lineHeight.snug
  },
  heading: {
    fontFamily: theme.font.semibold,
    fontSize: theme.fontSize.lg,
    lineHeight: theme.fontSize.lg * theme.lineHeight.snug
  },
  body: {
    fontFamily: theme.font.regular,
    fontSize: theme.fontSize.base,
    lineHeight: theme.fontSize.base * theme.lineHeight.normal
  },
  // Labels: 12px medium at 50–60% content (design tokens, typography.rules).
  label: { fontFamily: theme.font.medium, fontSize: theme.fontSize.xs, color: theme.color.textMuted },
  caption: {
    fontFamily: theme.font.regular,
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * theme.lineHeight.normal
  },
  // Totals and prices: tabular digits so columns line up.
  money: { fontFamily: theme.font.bold, fontSize: theme.fontSize.lg, fontVariant: ['tabular-nums'] }
}

const TONE: Record<Tone, string> = {
  default: theme.color.text,
  secondary: theme.color.textSecondary,
  muted: theme.color.textMuted,
  subtle: theme.color.textSubtle,
  primary: theme.color.primary,
  error: theme.color.error,
  onPrimary: theme.color.on.primary
}

const WEIGHT = {
  regular: theme.font.regular,
  medium: theme.font.medium,
  semibold: theme.font.semibold,
  bold: theme.font.bold
}

/**
 * The only Text to use in the app: bundled fonts, design-system sizes and
 * tones, and font scaling capped so large accessibility sizes don't break
 * POS layouts.
 */
export function Text({ variant = 'body', tone, weight, style, ...props }: TextProps) {
  const base = VARIANT[variant]
  return (
    <RNText
      maxFontSizeMultiplier={1.6}
      {...props}
      style={[
        { color: TONE.default },
        base,
        tone ? { color: TONE[tone] } : null,
        weight ? { fontFamily: WEIGHT[weight] } : null,
        style
      ]}
    />
  )
}
