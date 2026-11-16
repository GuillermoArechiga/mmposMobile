import Svg, { Circle, G, Path } from 'react-native-svg'
import { theme } from '@/shared/theme/theme'

type Props = { size?: number; color?: string }

/**
 * The "m." monogram: same geometry as mmPosWeb/design (scripts/build.mjs,
 * examples/react/BrandMark.jsx) — two arches and a dot on a 24-unit grid.
 */
export function BrandMark({ size = 24, color = theme.color.text }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityRole="image" accessibilityLabel="mmPOS">
      <G transform="translate(3.6 3.6) scale(.7)">
        <Path
          d="M3.2 17.5V11a3.5 3.5 0 0 1 7 0v6.5M10.2 11a3.5 3.5 0 0 1 7 0v6.5"
          fill="none"
          stroke={color}
          strokeWidth={2.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={20.9} cy={17.4} r={1.75} fill={color} />
      </G>
    </Svg>
  )
}
