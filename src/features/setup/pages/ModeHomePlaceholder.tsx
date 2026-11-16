import { StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { theme } from '@/shared/theme/theme'
import { Screen } from '@/shared/ui/Screen'
import { Card } from '@/shared/ui/Card'
import { Text } from '@/shared/ui/Text'
import { Button } from '@/shared/ui/Button'
import { SETUP_ROUTE, type DeviceMode } from '../domain/modes'
import { useDeviceModeStore } from '../store/useDeviceModeStore'

/** Temporary home for a mode until its phase is built (docs/mobile-plan.md §8). */
export function ModeHomePlaceholder({ mode }: { mode: DeviceMode }) {
  const { t } = useTranslation('setup')
  const router = useRouter()
  const clearMode = useDeviceModeStore((s) => s.clearMode)

  return (
    <Screen>
      <Text variant="title">{t(`modes.${mode}.title`)}</Text>
      <Card>
        <View style={styles.body}>
          <Text variant="heading">{t('comingSoon.title')}</Text>
          <Text tone="secondary">{t(`comingSoon.${mode}`)}</Text>
        </View>
      </Card>
      <Button
        variant="outline"
        label={t('changeMode')}
        onPress={() => {
          clearMode()
          router.replace(SETUP_ROUTE)
        }}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({ body: { gap: theme.space.sm } })
