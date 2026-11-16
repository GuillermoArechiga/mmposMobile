// The mmPOS mark: "m." — two rounded arches and a period on the baseline (the
// dot is the point of sale). Inherits colour from the parent (currentColor), so
// it works on any surface. Source of truth: design/brand/logos/mmpos-symbol.svg.
export const BrandMark = ({ size = 24, className = '', strokeScale = 1, title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    role={title ? 'img' : undefined}
    aria-label={title}
    aria-hidden={title ? undefined : true}
  >
    <g
      transform="translate(3.6 3.6) scale(0.7)"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.9 * strokeScale}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.2 17.5V11a3.5 3.5 0 0 1 7 0v6.5M10.2 11a3.5 3.5 0 0 1 7 0v6.5" />
      <circle cx="20.9" cy="17.4" r="1.75" fill="currentColor" stroke="none" />
    </g>
  </svg>
)
