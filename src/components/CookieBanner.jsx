import { useEffect, useState } from 'react'
import './CookieBanner.css'

const GTM_ID = 'GTM-5CBTFZ5X'
const STORAGE_KEY = 'cookiesAccepted'

function loadGTM() {
  if (window.__gtmLoaded) return
  window.__gtmLoaded = true

  // 1. Inicializar dataLayer ANTES del script (orden oficial GTM)
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  })

  // 2. Inyectar <script async> de GTM en <head>
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)

  // 3. Inyectar <noscript><iframe> al inicio de <body>
  const noscript = document.createElement('noscript')
  const iframe = document.createElement('iframe')
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`
  iframe.height = '0'
  iframe.width = '0'
  iframe.style.display = 'none'
  iframe.style.visibility = 'hidden'
  noscript.appendChild(iframe)
  document.body.insertBefore(noscript, document.body.firstChild)
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const decision = localStorage.getItem(STORAGE_KEY)

    if (decision === 'true') {
      loadGTM()
      return
    }

    if (decision === 'false') {
      return
    }

    // Sin decisión → mostrar banner
    setVisible(true)
  }, [])

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, 'true')
    loadGTM()
    setVisible(false)
  }

  function handleReject() {
    localStorage.setItem(STORAGE_KEY, 'false')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cb-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <p className="cb-text">
        Esta web utiliza cookies para analizar el tráfico y mejorar la experiencia.
        Puedes aceptarlas o rechazarlas.{' '}
        <button type="button" className="cb-policy-link">
          Política de cookies
        </button>
      </p>

      <div className="cb-actions">
        <button type="button" className="cb-btn" onClick={handleReject}>
          Denegar
        </button>
        <button type="button" className="cb-btn" onClick={handleAccept}>
          Aceptar
        </button>
      </div>
    </div>
  )
}
