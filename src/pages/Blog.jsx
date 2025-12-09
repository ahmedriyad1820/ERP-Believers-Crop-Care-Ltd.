import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import logoImage from '../assets/logo.png'

function buildBlogPosts(t) {
  const featured = t.blog?.featured || []
  const list = t.blog?.list || []
  const combined = [...featured, ...list]

  return {
    featuredCount: featured.length,
    all: combined.map((post, index) => ({
      id: String(index),
      ...post
    }))
  }
}

function BlogPage({ language, toggleLanguage, t }) {
  const isBn = language === 'bn'
  const [contentUpdate, setContentUpdate] = useState(0)

  // Listen for content updates
  useEffect(() => {
    const handleStorageChange = () => {
      setContentUpdate(prev => prev + 1)
    }
    const handleContentUpdate = () => {
      setContentUpdate(prev => prev + 1)
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('contentUpdated', handleContentUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('contentUpdated', handleContentUpdate)
    }
  }, [])

  // Get edited content from localStorage (reactive to contentUpdate)
  const editedContentStr = localStorage.getItem('editedContent')
  const editedContent = editedContentStr ? JSON.parse(editedContentStr) : {}
  const blogHero = editedContent.blog?.hero || {}
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentBlogHero = (() => {
    const str = localStorage.getItem('editedContent')
    const content = str ? JSON.parse(str) : {}
    return content.blog?.hero || {}
  })()
  
  const displayBlogHero = contentUpdate > 0 ? currentBlogHero : blogHero
  
  const pageImages = useMemo(() => {
    const pageImagesStr = localStorage.getItem('pageImages')
    return pageImagesStr ? JSON.parse(pageImagesStr) : {}
  }, [contentUpdate])

  const hero = {
    title: displayBlogHero.title || (isBn ? 'ব্লগ' : 'Blog'),
    subtitle: displayBlogHero.subtitle || (isBn
      ? 'মাঠের অভিজ্ঞতা, কৃষি টিপস এবং সাফল্যের গল্প জানতে আমাদের ব্লগ পড়ুন।'
      : 'Read field insights, agronomy tips, and success stories from Believers Crop Care.')
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

  const { featuredCount, all } = buildBlogPosts(t)
  const featuredPosts = all.slice(0, featuredCount)
  const otherPosts = all.slice(featuredCount)

  return (
    <div className="app blog-page">
      <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
      <main className="about-page-main">
        {/* Hero */}
        <section className="about-hero-banner fade-section">
          <div 
            className="about-hero-banner-content" 
            style={{ 
              fontWeight: 700,
              background: `linear-gradient(135deg, rgba(9, 17, 31, 0.40), rgba(19, 56, 98, 0.40)), url(${pageImages.blogHero || '/hero-image.jpg'}) center 40% / cover no-repeat`
            }}
          >
            <h1 className="about-hero-heading">{hero.title}</h1>
            <p className="about-hero-subtitle">{hero.subtitle}</p>
          </div>
        </section>

        {/* Blog content */}
        <section className="blog-section fade-section">
          <div className="blog-container">
            <div className="blog-header">
              <div>
                <p className="blog-tagline">{t.blog.tagline}</p>
                <h2 className="blog-title">{t.blog.title}</h2>
              </div>
            </div>
            <div className="blog-content">
              <div className="blog-featured-grid">
                {featuredPosts.map((post, index) => (
                  <Link
                    key={post.id || `featured-${index}`}
                    to={`/blog/${post.id}`}
                    className="blog-featured-card blog-card-link"
                  >
                    <div className="blog-featured-image">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        onError={e => {
                          e.currentTarget.src = '/hero-image.jpg'
                        }}
                      />
                      <span className="blog-category-pill">{post.category}</span>
                    </div>
                    <div className="blog-featured-body">
                      <div className="blog-meta-row">
                        <span className="blog-meta-item">
                          <span aria-hidden="true">👤</span> {post.author}
                        </span>
                        <span className="blog-meta-item">
                          <span aria-hidden="true">📅</span> {post.date}
                        </span>
                      </div>
                      <h3 className="blog-featured-title">{post.title}</h3>
                      {post.excerpt && (
                        <p className="blog-featured-excerpt">{post.excerpt}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="blog-list">
                {otherPosts.map((post, index) => (
                  <Link
                    key={post.id || `list-${index}`}
                    to={`/blog/${post.id}`}
                    className="blog-list-card blog-card-link"
                  >
                    <div className="blog-list-thumb">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        onError={e => {
                          e.currentTarget.src = '/hero-image.jpg'
                        }}
                      />
                    </div>
                    <div className="blog-list-body">
                      <span className="blog-list-category">{post.category}</span>
                      <h3 className="blog-list-title">{post.title}</h3>
                      <div className="blog-meta-row">
                        <span className="blog-meta-item">
                          <span aria-hidden="true">👤</span> {post.author}
                        </span>
                        <span className="blog-meta-item">
                          <span aria-hidden="true">📅</span> {post.date}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
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

export default BlogPage


