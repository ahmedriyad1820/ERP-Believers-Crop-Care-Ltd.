import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import logoImage from '../assets/logo.png'

// Resolve API base so mobile devices on the LAN can reach the backend.
const resolveApiBase = () => {
  const envBase = import.meta.env.VITE_API_BASE
  if (envBase && !['http://0.0.0.0:5000', 'http://localhost:5000'].includes(envBase)) {
    return envBase
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const { protocol, hostname } = window.location
    return `${protocol}//${hostname}:5000`
  }
  return 'http://localhost:5000'
}

const API_BASE = resolveApiBase()

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/hero-image.jpg'
  if (typeof imagePath === 'string' && imagePath.startsWith('http')) return imagePath
  return `${API_BASE}${imagePath.toString().startsWith('/') ? '' : '/'}${imagePath}`
}

function BlogDetailsPage({ language, toggleLanguage, t }) {
  const { postId } = useParams()
  const navigate = useNavigate()
  const isBn = language === 'bn'
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contentUpdate, setContentUpdate] = useState(0)

  // Listen for content updates
  useEffect(() => {
    const handleStorageChange = () => setContentUpdate(prev => prev + 1)
    const handleContentUpdate = () => setContentUpdate(prev => prev + 1)
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('contentUpdated', handleContentUpdate)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('contentUpdated', handleContentUpdate)
    }
  }, [])

  // Get page images reactively
  const pageImages = useMemo(() => {
    const pageImagesStr = localStorage.getItem('pageImages')
    return pageImagesStr ? JSON.parse(pageImagesStr) : {}
  }, [contentUpdate])

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_BASE}/api/blogs/${postId}`)
        const data = await response.json()
        if (data.success) {
          setPost(data.data)
        }
      } catch (error) {
        console.error('Fetch blog detail error:', error)
      } finally {
        setLoading(false)
      }
    }
    if (postId) fetchPost()
  }, [postId])

  useEffect(() => {
    const sections = document.querySelectorAll('.fade-section')
    if (!sections.length) return

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
  }, [post, loading])

  if (loading) {
    return (
      <div className="app blog-page">
        <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
        <main className="about-page-main">
          <div style={{ textAlign: 'center', padding: '10rem', color: '#94a3b8' }}>
            <p>{isBn ? 'ব্লগ লোড হচ্ছে...' : 'Loading blog...'}</p>
          </div>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="app blog-page">
        <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
        <main className="about-page-main">
          <div style={{ textAlign: 'center', padding: '10rem', color: '#94a3b8' }}>
            <p>{isBn ? 'ব্লগ পাওয়া যায়নি।' : 'Blog not found.'}</p>
            <button onClick={() => navigate('/blog')} className="job-back-btn" style={{ marginTop: '1rem' }}>
              {isBn ? 'সব ব্লগে ফিরে যান' : 'Back to all blogs'}
            </button>
          </div>
        </main>
      </div>
    )
  }

  const heroTitle = isBn ? (post.titleBn || post.title) : post.title
  const heroSubtitle = `${isBn ? (post.categoryBn || post.category) : post.category} • ${post.date}`

  return (
    <div className="app blog-page">
      <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
      <main className="about-page-main">
        {/* Hero */}
        <section className="about-hero-banner">
          <div
            className="about-hero-banner-content"
            style={{
              fontWeight: 700,
              background: `linear-gradient(135deg, rgba(9, 17, 31, 0.40), rgba(19, 56, 98, 0.40)), url(${pageImages.blogHero || '/hero-image.jpg'}) center 40% / cover no-repeat`
            }}
          >
            <button
              type="button"
              className="job-back-btn"
              style={{ marginBottom: '0.75rem', color: 'white', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.2)' }}
              onClick={() => navigate('/blog')}
            >
              {isBn ? '← সব ব্লগে ফিরে যান' : '← Back to all blog posts'}
            </button>
            <h1 className="about-hero-heading">{heroTitle}</h1>
            <p className="about-hero-subtitle">{heroSubtitle}</p>
          </div>
        </section>

        {/* Details layout */}
        <section className="blog-section fade-section">
          <div className="blog-container">
            <article className="blog-details-main">
              <div className="blog-details-hero">
                {post.image && (
                  <div className="blog-details-image">
                    <img
                      src={getImageUrl(post.image)}
                      alt={isBn ? (post.titleBn || post.title) : post.title}
                      loading="lazy"
                      onError={e => {
                        e.currentTarget.src = '/hero-image.jpg'
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="blog-details-card-shell">
                <div className="blog-details-card">
                  <p className="blog-details-chip">
                    {isBn ? (post.categoryBn || post.category) : post.category}
                  </p>
                  <div className="blog-details-meta-row">
                    <span className="blog-details-meta-label">
                      {isBn ? 'লেখক' : 'Author'}
                    </span>
                    <span className="blog-details-meta-value">
                      👤 {isBn ? (post.authorBn || post.author) : post.author}
                    </span>
                    <span className="blog-details-meta-separator">•</span>
                    <span className="blog-details-meta-value">
                      📅 {post.date}
                    </span>
                  </div>
                  <h1 className="blog-details-title">
                    {heroTitle}
                  </h1>
                  {(post.excerpt || post.excerptBn) && (
                    <p className="blog-details-excerpt">
                      {isBn ? (post.excerptBn || post.excerpt) : post.excerpt}
                    </p>
                  )}
                  <div className="blog-details-body">
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {isBn ? (post.contentBn || post.content) : post.content}
                    </div>
                  </div>
                </div>
              </div>
            </article>
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
            <p className="footer-text">{t.footer?.copyright}</p>
            <p className="footer-text">{t.footer?.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BlogDetailsPage


