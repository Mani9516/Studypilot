/**
 * Pay with UPI — order: Google Pay, Navi, then PhonePe and Paytm.
 * Google Pay + Navi use bundled assets under `public/payment/` (replace files to swap art).
 */
import { paymentAsset } from './paymentAssets'

export const UPI_APPS = [
  {
    id: 'gpay',
    label: 'Google Pay',
    logo: paymentAsset('gpay.svg'),
  },
  {
    id: 'navi',
    label: 'Navi',
    logo: paymentAsset('navi.png'),
  },
  {
    id: 'phonepe',
    label: 'PhonePe',
    logo: 'https://cdn.simpleicons.org/phonepe/5F259B',
  },
  {
    id: 'paytm',
    label: 'Paytm',
    logo: 'https://cdn.simpleicons.org/paytm/00BAF2',
  },
]
