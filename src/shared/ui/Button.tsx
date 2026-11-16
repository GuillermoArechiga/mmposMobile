import { ActivityIndicator, Pressable, StyleSheet } from 'react-native'
import { theme } from '@/shared/theme/theme'
import { Text } from './Text'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'

type Props = {
  label: string
  onPress: () => void
  variant?: Variant
  disabled?: boolean
  loading?: boolean
}

/**
 * 48px tall (POS touch target). At most one `primary` per screen
 * (design guidelines: "one green, one primary button per view").
 */
export function Button({ label, onPress, variant = 'primary', disabled, loading }: Props) {
  const inactive = disabled || loading
  const palette = PALETTE[variant]
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.background, borderColor: palette.border },
        pressed && !inactive && { opacity: 0.85 },
        inactive && { opacity: theme.opacity.disabled }
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <Text weight="semibold" style={{ color: palette.text }}>
          {label}
        </Text>
      )}
    </Pressable>
  )
}

const PALETTE: Record<Variant, { background: string; border: string; text: string }> = {
  primary: { background: theme.color.primary, border: theme.color.primary, text: theme.color.on.primary },
  outline: { background: 'transparent', border: theme.color.neutral, text: theme.color.text },
  ghost: { background: 'transparent', border: 'transparent', text: theme.color.textSecondary },
  danger: { background: theme.color.error, border: theme.color.error, text: theme.color.on.error }
}

const styles = StyleSheet.create({
  base: {
    minHeight: theme.touch.button,
    paddingHorizontal: theme.space.xl,
    borderRadius: theme.radius.field,
    borderWidth: theme.borderWidth,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
