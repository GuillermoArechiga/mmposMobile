import type { ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { theme } from '@/shared/theme/theme'

type Props = {
  children: ReactNode
  /** Scrolls the content (forms, lists). Off for full-screen boards. */
  scroll?: boolean
}

/** Page shell: safe areas, page background and the 16px gutter. */
export function Screen({ children, scroll = true }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.fill]}>{children}</View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.color.page },
  content: { padding: theme.gutter, gap: theme.space.lg },
  fill: { flex: 1 }
})
