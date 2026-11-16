import { useFonts } from 'expo-font'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter'
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans'

/**
 * Inter (UI) + Plus Jakarta Sans 800 (display), bundled — never rely on the
 * device having them (design/design-system/tokens.json, typography.bundling).
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    PlusJakartaSans_800ExtraBold
  })
  return loaded
}
