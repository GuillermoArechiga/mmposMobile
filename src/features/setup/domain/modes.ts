/**
 * The four ways one mmPos Mobile install can be used (docs/mobile-plan.md §1).
 * Pure data + rules: the UI decides icons, i18n decides words.
 */
export const DEVICE_MODES = ['admin', 'handheld', 'kitchen', 'display'] as const
export type DeviceMode = (typeof DEVICE_MODES)[number]

export type Connection = 'cloud' | 'lan'

export type ModeDefinition = {
  id: DeviceMode
  /** cloud = signs in to the mmPos API; lan = pairs with the main POS. */
  connection: Connection
  /** Design-system module gradient used for the mode's icon. */
  module: 'reports' | 'pos' | 'inventory' | 'shift'
  route: ModeRoute
}

export const MODE_ROUTES = {
  admin: '/admin',
  handheld: '/handheld',
  kitchen: '/kitchen',
  display: '/display'
} as const
export type ModeRoute = (typeof MODE_ROUTES)[DeviceMode]
export const SETUP_ROUTE = '/setup' as const

export const MODE_DEFINITIONS: readonly ModeDefinition[] = [
  { id: 'admin', connection: 'cloud', module: 'reports', route: MODE_ROUTES.admin },
  { id: 'handheld', connection: 'lan', module: 'pos', route: MODE_ROUTES.handheld },
  { id: 'kitchen', connection: 'lan', module: 'inventory', route: MODE_ROUTES.kitchen },
  { id: 'display', connection: 'lan', module: 'shift', route: MODE_ROUTES.display }
]

export function isDeviceMode(value: unknown): value is DeviceMode {
  return typeof value === 'string' && (DEVICE_MODES as readonly string[]).includes(value)
}

/** Where the app opens: the chosen mode's home, or the mode picker. */
export function startRouteFor(mode: unknown): ModeRoute | typeof SETUP_ROUTE {
  return isDeviceMode(mode) ? MODE_ROUTES[mode] : SETUP_ROUTE
}
