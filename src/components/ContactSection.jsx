import { useEffect, useRef } from 'react'

export default function ContactSection() {
  const contactRef = useRef(null)

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
  )
}
