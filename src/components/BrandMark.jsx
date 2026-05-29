export default function BrandMark({ size = 40, className = '' }) {
  const base = import.meta.env.BASE_URL || '/'
  const src = `${base}studypilot-icon.svg`
  return (
    <img
      src={src}
      width={size}
      height={size}
      className={`brand-mark ${className}`.trim()}
      alt="StudyPilot"
      decoding="async"
    />
  )
}
