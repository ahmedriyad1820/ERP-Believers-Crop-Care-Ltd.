import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import logoImage from '../assets/logo.png'

function buildBlogPosts(t) {
  const featured = t.blog?.featured || []
  const list = t.blog?.list || []
  const combined = [...featured, ...list]

  return combined.map((post, index) => ({
    id: String(index),
    ...post
  }))
}

function getPostBody(post, language) {
  if (!post) return ''
  const base = post.excerpt || ''
  if (language === 'bn') {
    return (
      base ||
      'এই লেখায় আমরা মাঠের অভিজ্ঞতা, কৃষকের বাস্তব চ্যালেঞ্জ এবং ব্যবহারিক সমাধান নিয়ে বিস্তারিত আলোচনা করেছি। সঠিক পরিকল্পনা, সেচ, পুষ্টি ব্যবস্থাপনা এবং রোগবালাই নিয়ন্ত্রণের মাধ্যমে কীভাবে ফসলের উৎপাদন বাড়ানো যায় তা এখানে ধাপে ধাপে তুলে ধরা হয়েছে।'
    )
  }
  return (
    base ||
    'In this article we go deeper into real field experience, common grower challenges, and the practical steps that helped improve outcomes. From planning and nutrition to crop protection and monitoring, you can adapt these ideas to your own fields.'
  )
}

function BlogDetailsPage({ language, toggleLanguage, t }) {
  const { postId } = useParams()
  const navigate = useNavigate()
  const isBn = language === 'bn'

  const allPosts = buildBlogPosts(t)
  const currentPost = allPosts.find(post => post.id === postId) || allPosts[0]
  const recentPosts = allPosts.filter(post => post.id !== currentPost.id).slice(0, 4)

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

  const heroTitle = currentPost?.title || (isBn ? 'ব্লগ' : 'Blog')
  const heroSubtitle = currentPost?.category
    ? `${currentPost.category} • ${currentPost.date}`
    : isBn
      ? 'ব্লগ বিস্তারিত'
      : 'Blog details'

  const bodyText = getPostBody(currentPost, language)

  return (
    <div className="app blog-page">
      <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
      <main className="about-page-main">
        {/* Hero */}
        <section className="about-hero-banner fade-section">
          <div className="about-hero-banner-content" style={{ fontWeight: 700 }}>
            <button
              type="button"
              className="job-back-btn"
              style={{ marginBottom: '0.75rem' }}
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
                {currentPost?.image && (
                  <div className="blog-details-image">
                    <img
                      src={currentPost.image}
                      alt={currentPost.title}
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
                  {currentPost?.category && (
                    <p className="blog-details-chip">
                      {currentPost.category}
                    </p>
                  )}
                  <div className="blog-details-meta-row">
                    <span className="blog-details-meta-label">
                      {isBn ? 'লেখক' : 'Author'}
                    </span>
                    <span className="blog-details-meta-value">
                      👤 {currentPost.author}
                    </span>
                    <span className="blog-details-meta-separator">•</span>
                    <span className="blog-details-meta-value">
                      📅 {currentPost.date}
                    </span>
                  </div>
                  <h1 className="blog-details-title">
                    {currentPost?.title || (isBn ? 'ব্লগ' : 'Blog')}
                  </h1>
                  {currentPost?.excerpt && (
                    <p className="blog-details-excerpt">{currentPost.excerpt}</p>
                  )}
                  <div className="blog-details-body">
                    <p>{bodyText}</p>
                    <div className="blog-inline-row">
                      <div className="blog-inline-image">
                        <img
                          src={currentPost.image}
                          alt={currentPost.title}
                          loading="lazy"
                          onError={e => {
                            e.currentTarget.src = '/hero-image.jpg'
                          }}
                        />
                      </div>
                      <div className="blog-inline-text">
                        <h2 className="blog-details-subheading">
                          {isBn
                            ? 'স্মার্ট পরিকল্পনা ও নিয়মিত পর্যবেক্ষণ'
                            : 'Plan smart and monitor consistently'}
                        </h2>
                        <p>
                          {isBn
                            ? 'ভাল ফলনের জন্য শুধুমাত্র একটি ইনপুট বা একবারের প্রয়োগ যথেষ্ট নয়। মৌসুমের শুরু থেকে শেষ পর্যন্ত একটি সুস্পষ্ট ক্যালেন্ডার থাকা জরুরি—কখন সেচ দেবেন, কখন সার প্রয়োগ করবেন এবং কোন পর্যায়ে রোগবালাই নিয়ন্ত্রণ করবেন তা আগে থেকেই ঠিক করে নিন।'
                            : 'Strong yields rarely come from a single input or one-time action. Build a simple crop calendar that covers the whole season—when to irrigate, when to feed, and at which growth stages to protect against pests and diseases.'}
                        </p>
                      </div>
                    </div>
                    <div className="blog-inline-row blog-inline-row-reverse">
                      <div className="blog-inline-text">
                        <p>
                          {isBn
                            ? 'ক্ষেত থেকে প্রাপ্ত বাস্তব ডেটা—পাতার রং, মাটির আর্দ্রতা, পোকামাকড়ের লক্ষণ—নিয়মিত নোট করে রাখুন। এর ওপর ভিত্তি করে পরের মৌসুমের জন্য আরও উন্নত সিদ্ধান্ত নেয়া সহজ হবে এবং একই জমিতে ধারাবাহিকভাবে ভাল ফলন পাওয়া যাবে।'
                            : 'Use real observations from the field—leaf colour, soil moisture, early pest signs—to fine-tune your schedule. Writing these down after every season helps you make better decisions next year and keep improving results on the same land.'}
                        </p>
                      </div>
                      <div className="blog-inline-image">
                        <img
                          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80"
                          alt={isBn ? 'ক্ষেতে ফসল পর্যবেক্ষণ' : 'Inspecting crops in the field'}
                          loading="lazy"
                          onError={e => {
                            e.currentTarget.src = '/hero-image.jpg'
                          }}
                        />
                      </div>
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
            <p className="footer-text">{t.footer.copyright}</p>
            <p className="footer-text">{t.footer.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BlogDetailsPage


