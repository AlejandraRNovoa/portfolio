import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import ContactSection from '../components/ContactSection.jsx'

export default function Contacto() {
  const [menuOpen, setMenuOpen] = useState(false)

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
          <Link to="/quien-soy" className="nav-link">QUIÉN SOY</Link>
          <Link to="/contacto" className="nav-link active">CONTACTO</Link>
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

      <ContactSection />

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
