import type { ReactNode } from 'react'
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native'
import { theme } from '@/shared/theme/theme'

type Props = {
  children: ReactNode
  onPress?: () => void
  accessibilityLabel?: string
  large?: boolean
  style?: ViewStyle
}

/**
 * The design system's card: surface background, border, 0.75rem radius and
 * no shadow (flat; separated by borders). Tappable when `onPress` is given.
 */
export function Card({ children, onPress, accessibilityLabel, large, style }: Props) {
  const padding = large ? theme.cardPaddingLarge : theme.cardPadding
  if (!onPress) return <View style={[styles.card, { padding }, style]}>{children}</View>
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.card,
        { padding },
        pressed && { borderColor: theme.color.primary },
        style
      ]}
    >
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.border,
    borderWidth: theme.borderWidth,
    borderRadius: theme.radius.card
  }
})
