import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoImage from '../assets/logo.png'

function SiteHeader({ language, toggleLanguage, t }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <button 
            type="button"
            className="logo-button"
            onClick={handleLogoClick}
            aria-label={language === 'en' ? 'Go to homepage' : 'হোম পেইজে যান'}
          >
            <img 
              src={logoImage} 
              alt="Believers Crop Care Ltd." 
              className="logo-image"
              onLoad={() => console.log('Logo loaded successfully')}
              onError={(e) => {
                console.error('Logo failed to load')
                e.target.style.border = '2px solid red'
              }}
            />
          </button>
        </div>
        
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <Link 
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => {
              handleLogoClick()
              setMobileMenuOpen(false)
            }}
          >
            {t.nav.home}
          </Link>
          <Link 
            to="/about"
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.about}
          </Link>
          <Link 
            to="/product"
            className={`nav-link ${isActive('/product') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.product}
          </Link>
          <Link 
            to="/notices"
            className={`nav-link ${isActive('/notices') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.notices}
          </Link>
          <Link 
            to="/career"
            className={`nav-link ${isActive('/career') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.nav.career}
          </Link>
          <a href="#" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t.nav.blog}</a>
          <div className="mobile-menu-actions">
            <button 
              className="mobile-language-btn" 
              onClick={() => {
                toggleLanguage()
                // Keep menu open so user can see language change
              }}
              title={language === 'en' ? 'বাংলায় পরিবর্তন করুন' : 'Switch to English'}
            >
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>
            <button className="mobile-contact-btn" onClick={() => setMobileMenuOpen(false)}>{t.nav.contact}</button>
          </div>
        </nav>
        
        <div className="header-right">
          <button className="language-btn" onClick={toggleLanguage} title={language === 'en' ? 'বাংলায় পরিবর্তন করুন' : 'Switch to English'}>
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>
          <button className="contact-btn">{t.nav.contact}</button>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${mobileMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader

