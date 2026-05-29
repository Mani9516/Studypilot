export default function BrandMark({ size = 40, className = '' }) {
  return (
    <img
      src="/studypilot-icon.svg"
      width={size}
      height={size}
      className={`brand-mark ${className}`.trim()}
      alt=""
      decoding="async"
    />
  )
}
