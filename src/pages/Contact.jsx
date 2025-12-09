import { useEffect } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import logoImage from '../assets/logo.png'

function ContactPage({ language, toggleLanguage, t }) {
  useEffect(() => {
    const sections = document.querySelectorAll('.fade-section')
    if (!sections.length) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          } else {
            entry.target.classList.remove('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const hero = language === 'bn'
    ? {
        title: 'যোগাযোগ',
        subtitle: 'ডিলার অর্ডার, মাঠ সহায়তা বা এগ্রোনমি প্রশ্নে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।'
      }
    : {
        title: 'Contact Us',
        subtitle: 'Reach our service desk for dealer orders, field support, or agronomy questions.'
      }

  return (
    <div className="app contact-page">
      <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
      <main className="about-page-main">
        {/* Hero */}
        <section className="about-hero-banner fade-section">
          <div className="about-hero-banner-content" style={{ fontWeight: 700 }}>
            <h1 className="about-hero-heading">{hero.title}</h1>
            <p className="about-hero-subtitle">{hero.subtitle}</p>
          </div>
        </section>

        <section className="contact-section fade-section">
          <div className="contact-container">
            <div className="contact-content">
              <span className="contact-tagline">{t.contact.tagline}</span>
              <h2 className="contact-title">{t.contact.title}</h2>
              <p className="contact-description">{t.contact.description}</p>
              <div className="contact-info-grid">
                <div className="contact-info-card">
                  <div className="contact-info-icon" aria-hidden="true">📞</div>
                  <div>
                    <p className="contact-info-label">{t.contact.phoneLabel}</p>
                    <a href={`tel:${t.contact.phone}`} className="contact-info-value">
                      {t.contact.phone}
                    </a>
                  </div>
                </div>
                <div className="contact-info-card">
                  <div className="contact-info-icon" aria-hidden="true">✉️</div>
                  <div>
                    <p className="contact-info-label">{t.contact.emailLabel}</p>
                    <a href={`mailto:${t.contact.email}`} className="contact-info-value">
                      {t.contact.email}
                    </a>
                  </div>
                </div>
                <div className="contact-info-card">
                  <div className="contact-info-icon" aria-hidden="true">📍</div>
                  <div>
                    <p className="contact-info-label">{t.contact.addressLabel}</p>
                    <p className="contact-info-value">{t.contact.address}</p>
                  </div>
                </div>
              </div>
              <div className="contact-main-grid">
                <form className="contact-form" onSubmit={e => e.preventDefault()}>
                  <div className="form-row">
                    <label>
                      <span>{t.contact.form.nameLabel}</span>
                      <input type="text" placeholder={t.contact.form.namePlaceholder} required />
                    </label>
                    <label>
                      <span>{t.contact.form.phoneLabel}</span>
                      <input type="tel" placeholder={t.contact.form.phonePlaceholder} required />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      <span>{t.contact.form.emailLabel}</span>
                      <input type="email" placeholder={t.contact.form.emailPlaceholder} required />
                    </label>
                    <label>
                      <span>{t.contact.form.districtLabel}</span>
                      <input type="text" placeholder={t.contact.form.districtPlaceholder} />
                    </label>
                  </div>
                  <label>
                    <span>{t.contact.form.messageLabel}</span>
                    <textarea
                      rows="4"
                      placeholder={t.contact.form.messagePlaceholder}
                      required
                    ></textarea>
                  </label>
                  <button type="submit" className="contact-submit-btn">
                    {t.contact.cta}
                  </button>
                </form>
                <div className="contact-map-wrapper">
                  <iframe
                    title="Believers Crop Care Office Location"
                    src="https://www.google.com/maps?q=24.782690955392432,89.35079967604104&hl=en&z=16&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, flex: 1 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
            </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img
              src={logoImage}
              alt="Believers Crop Care Ltd."
              className="footer-logo-image"
            />
          </div>
          <div className="footer-info">
            <p className="footer-text">{t.footer.copyright}</p>
            <p className="footer-text">{t.footer.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ContactPage


