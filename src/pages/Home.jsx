import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import imgPostales from '../assets/projects/postales-del-mundo.png'
import imgTootime from '../assets/projects/tootime.png'
import imgNomo from '../assets/projects/nomo-project.png'
import imgScremato from '../assets/projects/scremato-coffee.png'

const ROTATION_SPEED = 0.17

const SEGMENTS = [
  { label: 'WEBDESIGN',    startOffset: '4.6%'  },
  { label: 'LANDING PAGES', startOffset: '34.3%' },
  { label: 'BRANDING',      startOffset: '70.8%' },
  { label: 'WEB',        startOffset: '95.9%' },
]

function WheelGraphic() {
  const angleRef = useRef(0)
  const rafRef = useRef(null)
  const isHoveringRef = useRef(false)
  const [angle, setAngle] = useState(0)
  const [activeSegment, setActiveSegment] = useState(null)

  useEffect(() => {
    function tick() {
      if (!isHoveringRef.current) {
        angleRef.current = (angleRef.current + ROTATION_SPEED) % 360
        setAngle(angleRef.current)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  function handleWheelEnter() {
    if (isHoveringRef.current) return
    isHoveringRef.current = true
  }

  function handleSegmentEnter(label) {
    if (!isHoveringRef.current) {
      isHoveringRef.current = true
    }
    setActiveSegment(label)
  }

  function handleSegmentLeave() {
    setActiveSegment(null)
  }

  function handleWheelLeave() {
    isHoveringRef.current = false
    setActiveSegment(null)
  }

  return (
    <div
      className="wheel-wrap"
      onMouseEnter={handleWheelEnter}
      onMouseLeave={handleWheelLeave}
    >
      <div
        className="wheel"
        style={{ transform: `rotate(${angle}deg)`, animation: 'none' }}
      >
        <svg
          viewBox="0 0 200 200"
          className="wheel-svg"
          aria-hidden="true"
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            <path
              id="wheelPath"
              d="M 100,100 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
            />
          </defs>

          <text
            className="wheel-text"
            style={{ pointerEvents: 'none' }}
          >
            <textPath href="#wheelPath" startOffset="0%">
              {'· '}
              {SEGMENTS.map((seg, i) => (
                <tspan
                  key={seg.label}
                  fill={seg.label === activeSegment ? '#b42318' : '#c9c9c4'}
                  fontWeight={seg.label === activeSegment ? '700' : '600'}
                >
                  {seg.label}{i < SEGMENTS.length - 1 ? ' · ' : ''}
                </tspan>
              ))}
              {' · '}
              {SEGMENTS.map((seg, i) => (
                <tspan
                  key={seg.label + '2'}
                  fill={seg.label === activeSegment ? '#b42318' : '#c9c9c4'}
                  fontWeight={seg.label === activeSegment ? '700' : '600'}
                >
                  {seg.label}{i < SEGMENTS.length - 1 ? ' · ' : ''}
                </tspan>
              ))}
              {' ·'}
            </textPath>
          </text>

          {SEGMENTS.map(seg => (
            <text
              key={`hit-${seg.label}`}
              style={{
                fontSize: '10px',
                letterSpacing: '0.62em',
                textTransform: 'uppercase',
                fill: 'transparent',
                pointerEvents: 'all',
                cursor: 'default',
              }}
              onMouseEnter={() => handleSegmentEnter(seg.label)}
              onMouseLeave={handleSegmentLeave}
            >
              <textPath href="#wheelPath" startOffset={seg.startOffset}>
                {seg.label}
              </textPath>
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const gridRef = useRef(null)
  const contactRef = useRef(null)

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.project-card')
    if (!cards) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      }),
      { threshold: 0.15 }
    )
    cards.forEach(card => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = contactRef.current
    if (!section) return
    section.classList.add('contact-anim')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('contact-section--visible')
          observer.unobserve(section)
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-a">a</span>
          <span className="brand-novoa">novoa</span>
          <span className="brand-dot">.</span>
        </div>

        <nav className="nav">
          <a href="/" className="nav-link active">INICIO</a>
          <Link to="/quien-soy" className="nav-link">QUIÉN SOY</Link>
          <a href="#contacto" className="nav-link">CONTACTO</a>
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
          <a href="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>INICIO</a>
          <Link to="/quien-soy" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>QUIÉN SOY</Link>
          <a href="#contacto" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>CONTACTO</a>
        </nav>
      </div>

      <main className="hero">
        <div className="hero-grid">
          <section className="hero-left">
            <h1 className="hero-title">
              <span>Alejandra</span>
              <span className="hero-lastname">
                Novoa<span className="accent-dot">.</span>
              </span>
            </h1>

            <p className="hero-subtitle">Diseño de experiencias web</p>

            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' })}>Ver proyectos</button>
              <button className="btn btn-secondary" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>Contactar</button>
            </div>
          </section>

          <section className="hero-right">
            <WheelGraphic />
          </section>
        </div>

        <div className="scroll-indicator">
          <span>SCROLL</span>
          <div className="scroll-line" />
        </div>
      </main>

      <section className="services">
        <div className="services-line" />

        <div className="services-grid">
          <article className="service-card">
            <span className="service-number">01</span>
            <h3>Web</h3>
            <p>Diseño y desarrollo de páginas web claras, modernas y pensadas para convertir.</p>
          </article>

          <article className="service-card">
            <span className="service-number">02</span>
            <h3>Contenido</h3>
            <p>Creación de contenido visual y digital para dar presencia real a tu marca.</p>
          </article>

          <article className="service-card">
            <span className="service-number">03</span>
            <h3>Digital</h3>
            <p>Presencia online cuidada, coherente y adaptada a cada proyecto.</p>
          </article>
        </div>
      </section>

      <section className="portfolio-intro" id="proyectos">
        <div className="portfolio-intro-inner">
          <span className="portfolio-label">PORTFOLIO</span>
          <h2 className="portfolio-title">Proyectos</h2>

          <div className="projects-grid" ref={gridRef}>
            <a href="https://autocaravanaspm.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <article className="project-card" data-index="0">
              <div className="project-card-header">
                <span className="project-number">01</span>
                <h3 className="project-name">
                  Postales del Mundo<span className="cursor-blink" aria-hidden="true" />
                </h3>
              </div>
              <div className="project-image-wrap">
                <img src={imgPostales} alt="Postales del Mundo" />
              </div>
            </article>
            </a>

            <article className="project-card" data-index="1">
              <div className="project-card-header">
                <span className="project-number">02</span>
                <h3 className="project-name">
                  Tootime<span className="cursor-blink" aria-hidden="true" />
                </h3>
              </div>
              <div className="project-image-wrap">
                <img src={imgTootime} alt="Tootime" />
              </div>
            </article>

            <article className="project-card" data-index="2">
              <div className="project-card-header">
                <span className="project-number">03</span>
                <h3 className="project-name">
                  Nomo project<span className="cursor-blink" aria-hidden="true" />
                </h3>
              </div>
              <div className="project-image-wrap project-image-wrap--wip">
                <img src={imgNomo} alt="Nomo" />
                <div className="wip-overlay">
                  <span className="wip-label">EN CONSTRUCCIÓN</span>
                </div>
              </div>
            </article>

            <article className="project-card" data-index="3">
              <div className="project-card-header">
                <span className="project-number">04</span>
                <h3 className="project-name">
                  Scremato Coffee<span className="cursor-blink" aria-hidden="true" />
                </h3>
              </div>
              <div className="project-image-wrap project-image-wrap--wip">
                <img src={imgScremato} alt="Scremato Coffee" />
                <div className="wip-overlay">
                  <span className="wip-label">EN CONSTRUCCIÓN</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="contact" id="contacto" ref={contactRef}>
        <div className="contact-inner">
          <span className="portfolio-label">¿Necesitas ayuda?</span>
          <h2 className="portfolio-title">Contacto<span className="accent-dot">.</span></h2>

          <div className="contact-body">
          <form
            className="contact-form"
            action="https://formspree.io/f/mdaynkaw"
            method="POST"
          >
            <div className="contact-row">
              <div className="contact-field">
                <label className="contact-label" htmlFor="nombre">Nombre</label>
                <input className="contact-input" id="nombre" name="nombre" type="text" required />
              </div>
              <div className="contact-field">
                <label className="contact-label" htmlFor="apellido">Apellido</label>
                <input className="contact-input" id="apellido" name="apellido" type="text" required />
              </div>
            </div>

            <div className="contact-row">
              <div className="contact-field">
                <label className="contact-label" htmlFor="localidad">Localidad</label>
                <input className="contact-input" id="localidad" name="localidad" type="text" />
              </div>
              <div className="contact-field">
                <label className="contact-label" htmlFor="mail">Mail</label>
                <input className="contact-input" id="mail" name="_replyto" type="email" required />
              </div>
            </div>

            <div className="contact-field">
              <label className="contact-label" htmlFor="mensaje">Mensaje</label>
              <textarea className="contact-textarea contact-input" id="mensaje" name="mensaje" rows={5} required />
            </div>

            <button type="submit" className="btn btn-primary">Enviar</button>
          </form>

          <div className="contact-info">
            <p className="contact-info-main">Diseño y desarrollo de<br />productos digitales.</p>
            <p className="contact-info-secondary">Si tienes una idea o proyecto, puedes escribirme directamente.</p>

            <div className="contact-info-details">
              <span className="contact-label">Localización</span>
              <p className="contact-info-detail">Mallorca, España</p>
              <span className="contact-label">Email</span>
              <p className="contact-info-detail">novoarodriguezale@gmail.com</p>
            </div>
          </div>
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