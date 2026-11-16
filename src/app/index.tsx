import { Redirect } from 'expo-router'
import { startRouteFor } from '@/features/setup/domain/modes'
import { useDeviceModeStore } from '@/features/setup/store/useDeviceModeStore'

export default function Index() {
  const mode = useDeviceModeStore((s) => s.mode)
  return <Redirect href={startRouteFor(mode)} />
}
