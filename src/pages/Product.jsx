import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import logoImage from '../assets/logo.png'

function ProductPage({ language, toggleLanguage, t }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const heroContent = language === 'bn'
    ? {
        title: 'আমাদের পণ্য',
        subtitle: 'কৃষকদের ভাল ফলন অর্জনে সাহায্য করার জন্য ডিজাইন করা কার্যকর এবং নির্ভরযোগ্য ফসল সুরক্ষা পণ্যের আমাদের পরিসর আবিষ্কার করুন।',
        allCategories: 'সব ক্যাটাগরি',
        filterBy: 'ক্যাটাগরি',
        searchPlaceholder: 'পণ্য খুঁজুন...'
      }
    : {
        title: 'Our Products',
        subtitle: 'Discover our range of effective and reliable crop protection products designed to help farmers achieve better yields.',
        allCategories: 'All Categories',
        filterBy: 'Category',
        searchPlaceholder: 'Search products...'
      }

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = ['All', ...new Set(t.products.items.map(item => item.category))]
    return uniqueCategories
  }, [t.products.items])

  // Filter products based on selected category and search query
  const filteredProducts = useMemo(() => {
    let filtered = t.products.items

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.genericName.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.usage.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [selectedCategory, searchQuery, t.products.items])

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

  // Scroll to product card when returning from details page
  useEffect(() => {
    const fromProductPage = sessionStorage.getItem('productDetailsFrom')
    const productIndex = sessionStorage.getItem('productDetailsIndex')
    
    if (fromProductPage === 'product-page' && productIndex) {
      // Clear the session storage
      sessionStorage.removeItem('productDetailsFrom')
      sessionStorage.removeItem('productDetailsIndex')
      
      // Wait for products to render, then scroll to the card
      const scrollToCard = () => {
        const productCard = document.getElementById(`product-card-${productIndex}`)
        if (productCard) {
          // Scroll to the card
          productCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Add a highlight effect
          productCard.style.transition = 'box-shadow 0.3s ease'
          productCard.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.4)'
          setTimeout(() => {
            productCard.style.boxShadow = ''
          }, 2000)
          return true
        }
        return false
      }
      
      // Try immediately, then retry after a short delay if not found
      if (!scrollToCard()) {
        setTimeout(() => {
          scrollToCard()
        }, 300)
      }
    }
  }, [filteredProducts]) // Re-run when filtered products change

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterDropdownOpen && !event.target.closest('.product-filter-dropdown')) {
        setIsFilterDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFilterDropdownOpen])


  return (
    <div className="app product-page">
      <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
      <main className="product-page-main">
        <section className="product-hero-banner fade-section">
          <div className="product-hero-banner-content" style={{ fontWeight: 700 }}>
            <h1 className="product-hero-heading">{heroContent.title}</h1>
            <p className="product-hero-subtitle">{heroContent.subtitle}</p>
          </div>
        </section>

        <section className="products-grid-section fade-section">
          <div className="products-grid-container">
            {/* Search and Category Filter */}
            <div className="product-filters-wrapper">
              {/* Search Field */}
              <div className="product-search-wrapper">
                <div className="product-search-input-wrapper">
                  <svg 
                    className="search-icon" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    className="product-search-input"
                    placeholder={heroContent.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="search-clear-btn"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="m15 9-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="product-filter-dropdown">
                <button
                  className="filter-dropdown-btn"
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  aria-expanded={isFilterDropdownOpen}
                >
                  <span>{heroContent.filterBy}: {selectedCategory === 'All' ? heroContent.allCategories : selectedCategory}</span>
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`filter-dropdown-icon ${isFilterDropdownOpen ? 'open' : ''}`}
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {isFilterDropdownOpen && (
                  <div className="filter-dropdown-menu">
                    {categories.map((category) => (
                      <button
                        key={category}
                        className={`filter-dropdown-item ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsFilterDropdownOpen(false)
                        }}
                      >
                        {category === 'All' ? heroContent.allCategories : category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.map((product, productIndex) => {
                // Find the original index in the full products array
                const originalIndex = t.products.items.findIndex(
                  item => item.name === product.name && item.genericName === product.genericName
                )
                const displayIndex = originalIndex !== -1 ? originalIndex : productIndex
                
                return (
                  <div key={displayIndex} id={`product-card-${displayIndex}`} className="product-grid-card">
                    <div className="product-grid-image-wrapper">
                      <div className="product-grid-image">
                        <img 
                          src="/product-bottle.png" 
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => {
                            console.error('Product image failed to load:', e.target.src)
                            e.target.src = '/hero-image.jpg'
                          }}
                        />
                      </div>
                    </div>
                    <div className="product-grid-content">
                      <h3 className="product-grid-name">{product.name}</h3>
                      <p className="product-grid-generic-name">{product.genericName}</p>
                      <p className="product-grid-category">{product.category}</p>
                      <p className="product-grid-description-text">{product.description}</p>
                      <p className="product-grid-usage">{product.usage}</p>
                      <div className="product-grid-actions">
                        <button 
                          className="product-grid-details-btn"
                          onClick={() => {
                            // Store the product index in sessionStorage to track it came from product page
                            sessionStorage.setItem('productDetailsFrom', 'product-page')
                            sessionStorage.setItem('productDetailsIndex', displayIndex.toString())
                            navigate(`/product/${displayIndex}`)
                          }}
                        >
                          {t.products.details}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
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

export default ProductPage

