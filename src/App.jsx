import { useRef, useEffect, useState } from 'react'
import './App.css'
import imgPostales from './assets/projects/postales-del-mundo.png'
import imgTootime from './assets/projects/tootime.png'
import imgNomo from './assets/projects/nomo-project.png'
import imgScremato from './assets/projects/scremato-coffee.png'

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

          {/* Capa visual: texto completo con coloreado por segmento activo */}
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

          {/* Capas de hit detection: invisibles, reciben eventos de ratón */}
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

export default function App() {
  const gridRef = useRef(null)

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

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-a">a</span>
          <span className="brand-novoa">novoa</span>
          <span className="brand-dot">.</span>
        </div>

        <nav className="nav">
          <a href="#" className="nav-link active">INICIO</a>
          <a href="#" className="nav-link">QUIÉN SOY</a>
          <a href="#" className="nav-link">CONTACTO</a>
        </nav>
      </header>

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
              <button className="btn btn-secondary">Contactar</button>
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
            <h3>Estrategia</h3>
            <p>Definición de objetivos y arquitectura de información basada en datos.</p>
          </article>

          <article className="service-card">
            <span className="service-number">02</span>
            <h3>Diseño</h3>
            <p>Interfaces visuales limpias, tipografía curada y jerarquía visual impecable.</p>
          </article>

          <article className="service-card">
            <span className="service-number">03</span>
            <h3>Desarrollo</h3>
            <p>Código limpio, performance optimizado y experiencias responsivas fluidas.</p>
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