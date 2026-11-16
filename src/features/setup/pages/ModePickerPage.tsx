import { StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { BarChart3, ChefHat, MonitorSmartphone, ShoppingCart, type LucideIcon } from 'lucide-react-native'
import { theme } from '@/shared/theme/theme'
import { Screen } from '@/shared/ui/Screen'
import { Card } from '@/shared/ui/Card'
import { Text } from '@/shared/ui/Text'
import { BrandMark } from '@/shared/ui/BrandMark'
import { MODE_DEFINITIONS, type DeviceMode } from '../domain/modes'
import { useDeviceModeStore } from '../store/useDeviceModeStore'

const ICONS: Record<DeviceMode, LucideIcon> = {
  admin: BarChart3,
  handheld: ShoppingCart,
  kitchen: ChefHat,
  display: MonitorSmartphone
}

/** First run: choose what this device is (admin phone, handheld, kitchen, display). */
export function ModePickerPage() {
  const { t } = useTranslation('setup')
  const router = useRouter()
  const setMode = useDeviceModeStore((s) => s.setMode)

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.logo}>
          <BrandMark size={28} color={theme.color.on.primary} />
        </View>
        <Text variant="title">{t('title')}</Text>
        <Text tone="muted">{t('subtitle')}</Text>
      </View>

      {MODE_DEFINITIONS.map((mode) => {
        const Icon = ICONS[mode.id]
        const tint = theme.color.module[mode.module].from
        return (
          <Card
            key={mode.id}
            accessibilityLabel={t(`modes.${mode.id}.title`)}
            onPress={() => {
              setMode(mode.id)
              router.replace(mode.route)
            }}
          >
            <View style={styles.row}>
              <View style={[styles.icon, { borderColor: tint }]}>
                <Icon size={theme.icon.sizes[4]} color={tint} strokeWidth={theme.icon.stroke} />
              </View>
              <View style={styles.text}>
                <Text variant="heading">{t(`modes.${mode.id}.title`)}</Text>
                <Text variant="caption" tone="secondary">
                  {t(`modes.${mode.id}.description`)}
                </Text>
                <Text variant="label">{t(`connection.${mode.connection}`)}</Text>
              </View>
            </View>
          </Card>
        )
      })}
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: { gap: theme.space.sm, marginBottom: theme.space.sm },
  logo: {
    width: theme.touch.button,
    height: theme.touch.button,
    borderRadius: theme.radius.box,
    backgroundColor: theme.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.space.sm
  },
  row: { flexDirection: 'row', gap: theme.space.lg, alignItems: 'flex-start' },
  icon: {
    width: theme.touch.minTarget,
    height: theme.touch.minTarget,
    borderRadius: theme.radius.box,
    borderWidth: theme.borderWidth,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: { flex: 1, gap: theme.space.xs }
})
