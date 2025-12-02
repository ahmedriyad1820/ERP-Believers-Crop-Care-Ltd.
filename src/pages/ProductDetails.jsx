import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import logoImage from '../assets/logo.png'

function ProductDetails({ language, toggleLanguage, t }) {
  const { productIndex } = useParams()
  const navigate = useNavigate()
  const productIndexNum = parseInt(productIndex, 10)

  // Get the product from translations
  const product = t.products.items[productIndexNum]

  // Redirect if product not found
  useEffect(() => {
    if (!product) {
      navigate('/product')
    }
  }, [product, navigate])

  if (!product) {
    return null
  }

  const heroContent = language === 'bn'
    ? {
        backButton: 'পিছনে যান',
        category: 'ক্যাটাগরি',
        genericName: 'জেনেরিক নাম',
        description: 'বিবরণ',
        usage: 'ব্যবহার',
        benefits: 'সুবিধা',
        application: 'আবেদন',
        safety: 'নিরাপত্তা',
      }
    : {
        backButton: 'Back to Products',
        category: 'Category',
        genericName: 'Generic Name',
        description: 'Description',
        usage: 'Usage',
        benefits: 'Benefits',
        application: 'Application',
        safety: 'Safety',
      }

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

  return (
    <div className="app product-details-page">
      <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
      <main className="product-details-main">
        {/* Back Button */}
        <div className="product-details-back">
          <button 
            className="back-to-products-btn"
            onClick={() => {
              // Check if we came from product page
              const fromProductPage = sessionStorage.getItem('productDetailsFrom')
              if (fromProductPage === 'product-page') {
                // Keep the session storage so product page can scroll to the card
                navigate('/product')
              } else {
                // Clear and navigate normally
                sessionStorage.removeItem('productDetailsFrom')
                sessionStorage.removeItem('productDetailsIndex')
                navigate('/product')
              }
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{heroContent.backButton}</span>
          </button>
        </div>

        {/* Product Hero Section */}
        <section className="product-details-hero fade-section">
          <div className="product-details-hero-content">
            <div className="product-details-image-section">
              <div className="product-details-image-wrapper">
                <img 
                  src="/product-bottle.png" 
                  alt={product.name}
                  className="product-details-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/hero-image.jpg'
                  }}
                />
              </div>
            </div>
            <div className="product-details-info-section">
              <div className="product-details-badge">
                <span className="product-details-category-badge">{product.category}</span>
              </div>
              <h1 className="product-details-title">{product.name}</h1>
              <p className="product-details-generic">{heroContent.genericName}: {product.genericName}</p>
              <div className="product-details-description">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Content */}
        <section className="product-details-content fade-section">
          <div className="product-details-container">
            <div className="product-details-grid">
              {/* Usage Section */}
              <div className="product-details-card">
                <div className="product-details-card-header">
                  <div className="product-details-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2>{heroContent.usage}</h2>
                </div>
                <div className="product-details-card-body">
                  <p>{product.usage}</p>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="product-details-card">
                <div className="product-details-card-header">
                  <div className="product-details-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2>{heroContent.benefits}</h2>
                </div>
                <div className="product-details-card-body">
                  <ul className="product-details-list">
                    <li>Effective and reliable crop protection</li>
                    <li>Safe for use in various crop types</li>
                    <li>Environmentally responsible formulation</li>
                    <li>Proven results in field conditions</li>
                    <li>Cost-effective solution for farmers</li>
                  </ul>
                </div>
              </div>

              {/* Application Section */}
              <div className="product-details-card">
                <div className="product-details-card-header">
                  <div className="product-details-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2>{heroContent.application}</h2>
                </div>
                <div className="product-details-card-body">
                  <p>Apply as directed on the product label. Follow recommended dosage and application timing for optimal results. Consult with agricultural experts for specific crop requirements.</p>
                </div>
              </div>

              {/* Safety Section */}
              <div className="product-details-card">
                <div className="product-details-card-header">
                  <div className="product-details-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2>{heroContent.safety}</h2>
                </div>
                <div className="product-details-card-body">
                  <ul className="product-details-list">
                    <li>Read and follow all label instructions carefully</li>
                    <li>Wear appropriate protective equipment during application</li>
                    <li>Store in a cool, dry place away from children and pets</li>
                    <li>Do not contaminate water sources</li>
                    <li>Follow recommended safety intervals before harvest</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Back Button at Bottom */}
            <div className="product-details-back-bottom">
              <button 
                className="back-to-products-btn"
                onClick={() => {
                  // Check if we came from product page
                  const fromProductPage = sessionStorage.getItem('productDetailsFrom')
                  if (fromProductPage === 'product-page') {
                    // Keep the session storage so product page can scroll to the card
                    navigate('/product')
                  } else {
                    // Clear and navigate normally
                    sessionStorage.removeItem('productDetailsFrom')
                    sessionStorage.removeItem('productDetailsIndex')
                    navigate('/product')
                  }
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{heroContent.backButton}</span>
              </button>
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

export default ProductDetails

