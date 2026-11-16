import { create } from 'zustand'
import type { DeviceMode } from '../domain/modes'

type DeviceModeState = {
  mode: DeviceMode | null
  setMode: (mode: DeviceMode) => void
  clearMode: () => void
}

/**
 * The device's chosen mode. In memory for now; Phase 2 persists it in the
 * encrypted local database (_meta) so the app reopens in the same mode
 * (docs/mobile-plan.md §8).
 */
export const useDeviceModeStore = create<DeviceModeState>((set) => ({
  mode: null,
  setMode: (mode) => set({ mode }),
  clearMode: () => set({ mode: null })
}))
