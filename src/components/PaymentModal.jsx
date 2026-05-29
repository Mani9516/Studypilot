import { useState, useCallback } from 'react'
import { useUser } from '../context/UserContext'
import { UPI_APPS } from '../constants/upiApps'

const BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'Bank of Baroda',
]

function onlyDigits(s) {
  return s.replace(/\D/g, '')
}

export default function PaymentModal({ onClose }) {
  const { unlockAllCourses } = useUser()
  const [step, setStep] = useState('method')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [bank, setBank] = useState(BANKS[0])
  const [netPin, setNetPin] = useState('')
  const [upiPin, setUpiPin] = useState('')
  const [selectedUpiApp, setSelectedUpiApp] = useState(null)
  const [error, setError] = useState('')

  const finish = useCallback(
    (info) => {
      setStep('processing')
      setTimeout(() => {
        unlockAllCourses(info)
        setStep('success')
      }, 900)
    },
    [unlockAllCourses],
  )

  const formatCardInput = (raw) => {
    const d = onlyDigits(raw).slice(0, 16)
    return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const handleCardSubmit = (e) => {
    e.preventDefault()
    setError('')
    const num = onlyDigits(cardNumber)
    if (num.length !== 16) {
      setError('Enter a 16-digit card number (demo).')
      return
    }
    if (cardName.trim().length < 2) {
      setError('Enter name as on card.')
      return
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry.trim())) {
      setError('Expiry must be MM/YY.')
      return
    }
    const [mm, yy] = expiry.split('/').map((x) => parseInt(x, 10))
    if (mm < 1 || mm > 12) {
      setError('Invalid month in expiry.')
      return
    }
    if (onlyDigits(cvv).length !== 3) {
      setError('Enter 3-digit CVV (demo).')
      return
    }
    finish({ channel: 'card', last4: num.slice(-4) })
  }

  const handleNetPinSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (onlyDigits(netPin).length < 4) {
      setError('Enter at least 4 digits for demo PIN.')
      return
    }
    finish({ channel: 'netbanking', bank })
  }

  const handleUpiApp = (app) => {
    setError('')
    setUpiPin('')
    setSelectedUpiApp(app)
    setStep('upi_pin')
  }

  const handleUpiPinSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!selectedUpiApp) {
      setError('Pick a UPI app first.')
      return
    }
    if (onlyDigits(upiPin).length < 4) {
      setError('Enter your 4–6 digit UPI PIN (demo — use any digits).')
      return
    }
    if (onlyDigits(upiPin).length > 6) {
      setError('UPI PIN is usually up to 6 digits.')
      return
    }
    finish({ channel: 'upi', app: selectedUpiApp.label })
  }

  const resetAndClose = () => {
    onClose()
  }

  return (
    <div
      className="pay-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pay-dialog-title"
    >
      <div className="pay-modal soft-card">
        <h2 id="pay-dialog-title" className="visually-hidden">
          Checkout — unlock all courses
        </h2>
        <button
          type="button"
          className="pay-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="pay-demo-banner" role="status">
          <strong>Real-style checkout (demo).</strong> No UPI intent, card charge, or
          bank debit is sent from this app. Use fake details only.
        </div>

        {step === 'method' && (
          <>
            <h2 className="pay-title">Unlock all courses</h2>
            <p className="muted pay-lead">
              Full library for your class &amp; every subject — one-time access
              (simulated).
            </p>
            <div className="pay-price">₹ 499</div>

            <div className="pay-secure-row" aria-label="Featured payment partners">
              <span className="pay-secure-pill" title="Demo only">
                <span aria-hidden>🔒</span> Secure flow (simulated)
              </span>
              <span className="pay-secure-pill">UPI · Card · Net banking</span>
            </div>

            <p className="pay-sub">Choose how you would like to pay</p>
            <div className="pay-method-grid">
              <button
                type="button"
                className="pay-method-card"
                onClick={() => setStep('upi_apps')}
              >
                <span className="pay-method-icon" aria-hidden>
                  ⧉
                </span>
                <strong>UPI</strong>
                <span className="muted small">Google Pay, PhonePe, Paytm, Navi</span>
              </button>
              <button
                type="button"
                className="pay-method-card"
                onClick={() => setStep('card_form')}
              >
                <span className="pay-method-icon" aria-hidden>
                  ▭
                </span>
                <strong>Card</strong>
                <span className="muted small">Debit / Credit</span>
              </button>
              <button
                type="button"
                className="pay-method-card"
                onClick={() => setStep('netbank_bank')}
              >
                <span className="pay-method-icon" aria-hidden>
                  ⌂
                </span>
                <strong>Net banking</strong>
                <span className="muted small">Bank + secure PIN</span>
              </button>
            </div>
          </>
        )}

        {step === 'upi_apps' && (
          <>
            <h2 className="pay-title">Pay with UPI</h2>
            <p className="muted pay-lead">
              Select your UPI app, then enter your demo PIN to finish.
            </p>
            <div className="pay-app-grid pay-app-grid--four">
              {UPI_APPS.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className="pay-app-tile"
                  onClick={() => handleUpiApp(app)}
                >
                  <img
                    src={app.logo}
                    alt=""
                    className="pay-app-logo"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="pay-app-label">{app.label}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="pay-back"
              onClick={() => {
                setError('')
                setUpiPin('')
                setSelectedUpiApp(null)
                setStep('method')
              }}
            >
              ← Other payment methods
            </button>
          </>
        )}

        {step === 'upi_pin' && selectedUpiApp && (
          <>
            <h2 className="pay-title">Enter UPI PIN</h2>
            <p className="muted pay-lead">
              {selectedUpiApp.label} — confirm with your UPI PIN (simulated; nothing is
              sent to a bank).
            </p>
            <div className="pay-app-inline">
              <img
                src={selectedUpiApp.logo}
                alt=""
                className="pay-app-logo pay-app-logo--inline"
                decoding="async"
              />
              <span className="pay-app-label">{selectedUpiApp.label}</span>
            </div>
            <form className="pay-form" onSubmit={handleUpiPinSubmit}>
              <label className="auth-field">
                <span className="auth-label">UPI PIN</span>
                <input
                  className="auth-input"
                  type="password"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="••••"
                  maxLength={6}
                  value={upiPin}
                  onChange={(e) => setUpiPin(onlyDigits(e.target.value).slice(0, 6))}
                />
                <span className="auth-hint">Demo: any 4–6 digits. Do not use your real PIN.</span>
              </label>
              {error && <p className="pay-error">{error}</p>}
              <button type="submit" className="auth-submit">
                Pay ₹499
              </button>
            </form>
            <button
              type="button"
              className="pay-back"
              onClick={() => {
                setError('')
                setUpiPin('')
                setSelectedUpiApp(null)
                setStep('upi_apps')
              }}
            >
              ← Choose another UPI app
            </button>
          </>
        )}

        {step === 'card_form' && (
          <>
            <h2 className="pay-title">Card details</h2>
            <form className="pay-form" onSubmit={handleCardSubmit}>
              <label className="auth-field">
                <span className="auth-label">Card number</span>
                <input
                  className="auth-input"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                />
              </label>
              <label className="auth-field">
                <span className="auth-label">Name on card</span>
                <input
                  className="auth-input"
                  autoComplete="off"
                  placeholder="A K SHARMA"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                />
              </label>
              <div className="pay-two-col">
                <label className="auth-field">
                  <span className="auth-label">Expiry</span>
                  <input
                    className="auth-input"
                    autoComplete="off"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                      if (v.length >= 2) v = `${v.slice(0, 2)}/${v.slice(2)}`
                      setExpiry(v)
                    }}
                  />
                </label>
                <label className="auth-field">
                  <span className="auth-label">CVV</span>
                  <input
                    className="auth-input"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="•••"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) =>
                      setCvv(onlyDigits(e.target.value).slice(0, 3))
                    }
                  />
                </label>
              </div>
              {error && <p className="pay-error">{error}</p>}
              <button type="submit" className="auth-submit">
                Pay ₹499
              </button>
            </form>
            <button
              type="button"
              className="pay-back"
              onClick={() => {
                setError('')
                setStep('method')
              }}
            >
              ← Back
            </button>
          </>
        )}

        {step === 'netbank_bank' && (
          <>
            <h2 className="pay-title">Net banking</h2>
            <p className="muted pay-lead">Select your bank</p>
            <label className="auth-field">
              <span className="auth-label">Bank</span>
              <select
                className="auth-input auth-select"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
              >
                {BANKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="auth-submit"
              onClick={() => {
                setError('')
                setStep('netbank_pin')
              }}
            >
              Continue
            </button>
            <button
              type="button"
              className="pay-back"
              onClick={() => setStep('method')}
            >
              ← Back
            </button>
          </>
        )}

        {step === 'netbank_pin' && (
          <>
            <h2 className="pay-title">Enter transaction PIN</h2>
            <p className="muted pay-lead">
              {bank} — demo PIN screen (use any 4+ digits)
            </p>
            <form className="pay-form" onSubmit={handleNetPinSubmit}>
              <label className="auth-field">
                <span className="auth-label">PIN</span>
                <input
                  className="auth-input"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="••••"
                  value={netPin}
                  onChange={(e) => setNetPin(e.target.value)}
                />
              </label>
              {error && <p className="pay-error">{error}</p>}
              <button type="submit" className="auth-submit">
                Confirm payment
              </button>
            </form>
            <button
              type="button"
              className="pay-back"
              onClick={() => {
                setError('')
                setStep('netbank_bank')
              }}
            >
              ← Choose bank again
            </button>
          </>
        )}

        {step === 'processing' && (
          <div className="pay-center">
            <div className="pay-spinner" aria-hidden />
            <p className="pay-processing-title">Processing…</p>
            {selectedUpiApp && (
              <p className="muted small">Via {selectedUpiApp.label}</p>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="pay-center pay-success-block">
            <div className="pay-check" aria-hidden>
              ✓
            </div>
            <h2 className="pay-title">Payment successful</h2>
            <p className="muted pay-lead">
              All courses are unlocked. Videos and quizzes follow your class and
              subject selections.
            </p>
            <button type="button" className="auth-submit" onClick={resetAndClose}>
              Start learning
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
