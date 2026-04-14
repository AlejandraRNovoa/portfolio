import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import './QuienSoy.css'
import nube from '../assets/nube.png'

const accordionItems = [
  {
    title: 'Cómo trabajo',
    body: 'Trabajo de forma directa y organizada, entendiendo cada proyecto y construyendo soluciones adaptadas a sus necesidades.',
  },
  {
    title: 'Qué hago',
    body: 'Diseño y desarrollo páginas web funcionales, visuales y fáciles de gestionar.',
  },
  {
    title: 'Mantenimiento',
    body: 'Soporte y mantenimiento para asegurar que cada web funcione correctamente en el tiempo.',
  },
  {
    title: 'TooTime',
    body: 'Actualmente desarrollo TooTime, mi propia aplicación orientada a la gestión de equipos y turnos de trabajo.',
  },
]

function Counter({ from = 0, to, duration = 2000, prefix = '' }) {
  const [value, setValue] = useState(from)
  const ref = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true
          observer.disconnect()

          const start = performance.now()
          const tick = (now) => {
            const elapsed = now - start
            const t = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - t, 2)
            setValue(Math.round(from + (to - from) * eased))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [from, to, duration])

  return (
    <span ref={ref}>
      {prefix && <span className="qs-stat-plus">{prefix}</span>}
      {value}
    </span>
  )
}

export default function QuienSoy() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="site-shell">
      <header className="topbar">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          <span className="brand-a">a</span>
          <span className="brand-novoa">novoa</span>
          <span className="brand-dot">.</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">INICIO</Link>
          <Link to="/quien-soy" className="nav-link active">QUIÉN SOY</Link>
          <Link to="/contacto" className="nav-link">CONTACTO</Link>
        </nav>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? '✕' : (
            <span className="hamburger-lines">
              <span /><span /><span />
            </span>
          )}
        </button>
      </header>

      <div className={`mobile-overlay${menuOpen ? ' mobile-overlay--open' : ''}`}>
        <nav className="mobile-overlay-nav">
          <Link to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>INICIO</Link>
          <Link to="/quien-soy" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>QUIÉN SOY</Link>
          <Link to="/contacto" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>CONTACTO</Link>
        </nav>
      </div>

      <section className="qs-split">
        <img src={nube} alt="" className="qs-hero-cloud" aria-hidden="true" />
        <div className="qs-split-text">
          <h1 className="qs-split-title">
            <span>SOBRE MÍ<span className="qs-split-dot">.</span></span>
          </h1>
        </div>
      </section>

      <section className="qs-stats">
        <div className="qs-stats-grid">
          <div className="qs-stat">
            <span className="qs-stat-number">
              <Counter from={0} to={31} />
            </span>
            <span className="qs-stat-label">Días en crear una web</span>
          </div>
          <div className="qs-stat">
            <span className="qs-stat-number">
              <Counter from={0} to={28} prefix="+" />
            </span>
            <span className="qs-stat-label">Webs realizadas</span>
          </div>
          <div className="qs-stat">
            <span className="qs-stat-number">
              <Counter from={0} to={20} prefix="+" />
            </span>
            <span className="qs-stat-label">Herramientas y tecnologías</span>
          </div>
        </div>
      </section>

      <section className="qs-below">
        <div className="qs-below-grid">
          <div className="qs-accordion">
            {accordionItems.map((item, i) => {
              const isOpen = openIndex === i
              return (
                <div
                  key={item.title}
                  className={`qs-accordion-item${isOpen ? ' qs-accordion-item--open' : ''}`}
                >
                  <button
                    className="qs-accordion-trigger"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="qs-accordion-title">{item.title}</span>
                    <span className="qs-accordion-icon" aria-hidden="true">
                      {isOpen ? '×' : '+'}
                    </span>
                  </button>
                  <div className="qs-accordion-panel">
                    <p>{item.body}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="qs-col-text">
            <p>
              Diseño y desarrollo webs claras, rápidas y bien estructuradas, 
              adaptadas a cada proyecto.
            </p>
            <p>
              El objetivo no es solo que la 
              web se vea bien, sino que sea fácil de gestionar y útil en el día a día.
            </p>
          </div>

          <div className="qs-col-text">
            <p>
              Trabajo de forma ordenada y profesional, 
              buscando soluciones que encajen con cada cliente.

              Puedo ayudarte tanto con una web sencilla como con 
              proyectos más completos, según lo que necesites.
            </p>
            <p>
              Actualmente estoy desarrollando TooTime, mi propia aplicación
              de gestión interna para negocios.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-copy">© 2026 ALEJANDRA NOVOA. ALL RIGHTS RESERVED.</div>

        <div className="footer-links">
          <a href="https://www.instagram.com/bobnovoa" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
          <a href="https://www.linkedin.com/in/alejandra-rodríguez-novoa-48a5394b" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
        </div>
      </footer>
    </div>
  )
}