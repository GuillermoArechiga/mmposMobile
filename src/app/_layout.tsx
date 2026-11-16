import '@/i18n'
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { useAppFonts } from '@/shared/theme/fonts'
import { theme } from '@/shared/theme/theme'

SplashScreen.preventAutoHideAsync()

/** Root: bundled fonts, i18n and the dark page background for every screen. */
export default function RootLayout() {
  const fontsLoaded = useAppFonts()

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: theme.color.page }
        }}
      />
    </>
  )
}
