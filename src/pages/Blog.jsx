import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
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

function BlogPage({ language, toggleLanguage, t }) {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const isBn = language === 'bn'
  const [contentUpdate, setContentUpdate] = useState(0)

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/blogs`)
        const data = await response.json()
        if (data.success) {
          // Only show active blogs
          setBlogs(data.data.filter(b => b.isActive !== false))
        }
      } catch (error) {
        console.error('Fetch blogs error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [contentUpdate])

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
  }, [blogs, loading])

  const featuredPosts = blogs.filter(b => b.isFeatured)
  const otherPosts = blogs.filter(b => !b.isFeatured)

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

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                <p>{isBn ? 'ব্লগ লোড হচ্ছে...' : 'Loading blogs...'}</p>
              </div>
            ) : (
              <div className="blog-content">
                <div className="blog-featured-grid">
                  {featuredPosts.map((post) => (
                    <Link
                      key={post._id}
                      to={`/blog/${post._id}`}
                      className="blog-featured-card blog-card-link"
                    >
                      <div className="blog-featured-image">
                        <img
                          src={getImageUrl(post.image)}
                          alt={isBn ? (post.titleBn || post.title) : post.title}
                          loading="lazy"
                          onError={e => {
                            e.currentTarget.src = '/hero-image.jpg'
                          }}
                        />
                        <span className="blog-category-pill">
                          {isBn ? (post.categoryBn || post.category) : post.category}
                        </span>
                      </div>
                      <div className="blog-featured-body">
                        <div className="blog-meta-row">
                          <span className="blog-meta-item">
                            <span aria-hidden="true">👤</span> {isBn ? (post.authorBn || post.author) : post.author}
                          </span>
                          <span className="blog-meta-item">
                            <span aria-hidden="true">📅</span> {post.date}
                          </span>
                        </div>
                        <h3 className="blog-featured-title">
                          {isBn ? (post.titleBn || post.title) : post.title}
                        </h3>
                        {(post.excerpt || post.excerptBn) && (
                          <p className="blog-featured-excerpt">
                            {isBn ? (post.excerptBn || post.excerpt) : post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="blog-list">
                  {otherPosts.map((post) => (
                    <Link
                      key={post._id}
                      to={`/blog/${post._id}`}
                      className="blog-list-card blog-card-link"
                    >
                      <div className="blog-list-thumb">
                        <img
                          src={getImageUrl(post.image)}
                          alt={isBn ? (post.titleBn || post.title) : post.title}
                          loading="lazy"
                          onError={e => {
                            e.currentTarget.src = '/hero-image.jpg'
                          }}
                        />
                      </div>
                      <div className="blog-list-body">
                        <span className="blog-list-category">
                          {isBn ? (post.categoryBn || post.category) : post.category}
                        </span>
                        <h3 className="blog-list-title">
                          {isBn ? (post.titleBn || post.title) : post.title}
                        </h3>
                        <div className="blog-meta-row">
                          <span className="blog-meta-item">
                            <span aria-hidden="true">👤</span> {isBn ? (post.authorBn || post.author) : post.author}
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
            )}

            {!loading && blogs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                <p>{isBn ? 'কোন ব্লগ পাওয়া যায়নি।' : 'No blogs found.'}</p>
              </div>
            )}
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


