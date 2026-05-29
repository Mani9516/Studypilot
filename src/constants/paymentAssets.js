/** Vite `public/payment/*` files — use your own PNG/SVG by replacing files there. */
export function paymentAsset(filename) {
  const base = import.meta.env.BASE_URL ?? '/'
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}payment/${filename}`
}
