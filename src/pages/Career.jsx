import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import logoImage from '../assets/logo.png'

function CareerPage({ language, toggleLanguage, t }) {
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
  const careerHero = editedContent.career?.hero || {}
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentCareerHero = (() => {
    const str = localStorage.getItem('editedContent')
    const content = str ? JSON.parse(str) : {}
    return content.career?.hero || {}
  })()
  
  const displayCareerHero = contentUpdate > 0 ? currentCareerHero : careerHero
  
  const pageImages = useMemo(() => {
    const pageImagesStr = localStorage.getItem('pageImages')
    return pageImagesStr ? JSON.parse(pageImagesStr) : {}
  }, [contentUpdate])

  const hero = {
    title: displayCareerHero.title || (isBn ? 'ক্যারিয়ার' : 'Career'),
    subtitle: displayCareerHero.subtitle || (isBn
      ? 'বেলিভার্স ক্রপ কেয়ার টিমে যোগ দিয়ে দেশের কৃষি উন্নয়নের অংশ হোন।'
      : 'Join Believers Crop Care and help us build a stronger future for farmers across Bangladesh.')
      }

  const whyItems = isBn
    ? [
        {
          title: 'অর্থবহ কাজ',
          desc: 'আপনার প্রতিটি কাজ সরাসরি কৃষক, ডিলার ও মাঠের মানুষের উপকারে আসে।'
        },
        {
          title: 'শেখার সুযোগ',
          desc: 'এগ্রোনমি, সাপ্লাই চেইন, সেলস ও অপারেশনে অভিজ্ঞ টিমের সাথে কাজ করার সুযোগ।'
        },
        {
          title: 'দলভিত্তিক সংস্কৃতি',
          desc: 'সহযোগী, সম্মানজনক ও পরিবারভিত্তিক সংস্কৃতি যেখানে সবাইকে মূল্য দেওয়া হয়।'
        }
      ]
    : [
        {
          title: 'Meaningful impact',
          desc: 'Every project you work on helps real farmers, dealers, and communities on the ground.'
        },
        {
          title: 'Room to grow',
          desc: 'Work closely with senior leaders across agronomy, supply chain, sales, and operations.'
        },
        {
          title: 'Team-first culture',
          desc: 'A collaborative, respectful, and people-centric culture where your voice matters.'
        }
      ]

  const roles = isBn
    ? [
        {
          id: 'area-sales-manager',
          title: 'এরিয়া সেলস ম্যানেজার',
          location: 'বিভিন্ন জেলা',
          type: 'ফুল টাইম',
          summary:
            'ডিস্ট্রিবিউটর ও ডিলার নেটওয়ার্ক পরিচালনা, সেলস টার্গেট অর্জন এবং মাঠ পর্যায়ে সম্পর্ক গড়ে তোলার দায়িত্ব।'
        },
        {
          id: 'field-agronomy-officer',
          title: 'ফিল্ড এগ্রোনমি অফিসার',
          location: 'ফিল্ড বেসড',
          type: 'ফুল টাইম',
          summary:
            'ডেমো প্লট, কৃষক মিটিং ও ট্রেনিং-এর মাধ্যমে প্রযুক্তিগত সহায়তা প্রদান এবং ফিডব্যাক সংগ্রহ।'
        },
        {
          id: 'supply-chain-coordinator',
          title: 'সাপ্লাই চেইন কো-অর্ডিনেটর',
          location: 'হেড অফিস',
          type: 'ফুল টাইম',
          summary:
            'অর্ডার প্রসেসিং, স্টক প্ল্যানিং এবং লজিস্টিকস টিমের সাথে সমন্বয়ের মাধ্যমে সময়মতো পণ্য সরবরাহ নিশ্চিত করা।'
        }
      ]
    : [
        {
          id: 'area-sales-manager',
          title: 'Area Sales Manager',
          location: 'Multiple districts',
          type: 'Full-time',
          summary:
            'Own dealer relationships, drive sales targets, and support field activations in your assigned territory.'
        },
        {
          id: 'field-agronomy-officer',
          title: 'Field Agronomy Officer',
          location: 'Field-based',
          type: 'Full-time',
          summary:
            'Lead demo plots, farmer meetings, and trainings while bringing back insights to improve our products.'
        },
        {
          id: 'supply-chain-coordinator',
          title: 'Supply Chain Coordinator',
          location: 'Head office',
          type: 'Full-time',
          summary:
            'Coordinate order processing, stock planning, and logistics to keep products available in every season.'
        }
      ]

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

  useEffect(() => {
    try {
      const fromJobDetails = window.sessionStorage.getItem('careerFromJobDetails')
      if (fromJobDetails === '1') {
        const target = document.getElementById('career-open-roles')
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        window.sessionStorage.removeItem('careerFromJobDetails')
      }
    } catch (error) {
      console.error('Unable to use sessionStorage for scroll restore', error)
    }
  }, [])

  return (
    <div className="app career-page">
      <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
      <main className="about-page-main">
        {/* Hero */}
        <section className="about-hero-banner fade-section">
          <div 
            className="about-hero-banner-content" 
            style={{ 
              fontWeight: 700,
              background: `linear-gradient(135deg, rgba(9, 17, 31, 0.40), rgba(19, 56, 98, 0.40)), url(${pageImages.careerHero || '/hero-image.jpg'}) center 40% / cover no-repeat`
            }}
          >
            <h1 className="about-hero-heading">{hero.title}</h1>
            <p className="about-hero-subtitle">{hero.subtitle}</p>
          </div>
        </section>

        {/* Why work with us */}
        <section 
          className="about-values-section fade-section"
          style={{
            background: `linear-gradient(180deg, rgba(248, 250, 252, 0.192), rgba(232, 247, 241, 0.192)), url(${pageImages.careerValuesBackground || 'https://images.stockcake.com/public/e/6/e/e6e4865c-08b7-4633-b428-f5658462485e_large/farmers-tending-crops-stockcake.jpg'}) center/cover no-repeat`
          }}
        >
          <div className="about-values-container">
            <div className="about-values-header">
              <p className="about-values-eyebrow">
                {isBn ? 'কেন আমাদের দলে যোগ দেবেন' : 'Why build your career with us'}
              </p>
              <h2>{isBn ? 'আমাদের সাথে কাজ করার মূল সুবিধা' : 'What you can expect when you join'}</h2>
            </div>
            <div className="about-values-grid">
              {whyItems.map(item => (
                <div key={item.title} className="about-value-card">
                  <span className="about-value-icon" aria-hidden="true">
                    🌱
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section id="career-open-roles" className="about-stats-section fade-section">
          <div className="about-stats-container">
            <div className="about-stats-heading">
              <p className="about-stats-eyebrow">
                {isBn ? 'বর্তমান শূন্য পদ' : 'Current openings'}
              </p>
              <h2>{isBn ? 'আমাদের সাথে যোগ দিতে আগ্রহী?' : 'Interested in joining the team?'}</h2>
              <p>
                {isBn
                  ? 'নিচের পদগুলোতে নিয়মিত নিয়োগ দিয়ে থাকি। বিস্তারিত জব রিকোয়ারমেন্ট ও আবেদন তথ্য পেতে নির্দিষ্ট পদের ওপর ক্লিক করুন।'
                  : 'We regularly hire for the roles below. Click any role card to see full details and how to apply for that position.'}
              </p>
            </div>
            <div className="about-stats-grid">
              {roles.map(role => (
                <Link
                  key={role.id}
                  to={`/career/${role.id}`}
                  className="about-stat-card"
                >
                  <div className="about-stat-label-block">
                    <small>{role.type}</small>
                    <span className="about-stat-value">{role.title}</span>
                  </div>
                  <p>{role.summary}</p>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.9 }}>
                    {isBn ? 'লোকেশন' : 'Location'}: {role.location}
                  </p>
                </Link>
              ))}
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

export default CareerPage


