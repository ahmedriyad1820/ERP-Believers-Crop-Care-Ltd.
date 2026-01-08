import { useEffect, useState, useMemo } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import logoImage from '../assets/logo.png'
import AboutSection from '../components/AboutSection.jsx'
import TeamSection from '../components/TeamSection.jsx'

function AboutPage({ language, toggleLanguage, t }) {
  const [lightboxImage, setLightboxImage] = useState(null)
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
  const aboutStats = editedContent.aboutStats || {}
  const aboutValues = editedContent.aboutValues || {}
  const aboutGallery = editedContent.aboutGallery || {}

  // Force re-read when contentUpdate changes (dependency on contentUpdate)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentAboutStats = (() => {
    const str = localStorage.getItem('editedContent')
    const content = str ? JSON.parse(str) : {}
    return content.aboutStats || {}
  })()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentAboutValues = (() => {
    const str = localStorage.getItem('editedContent')
    const content = str ? JSON.parse(str) : {}
    return content.aboutValues || {}
  })()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentAboutGallery = (() => {
    const str = localStorage.getItem('editedContent')
    const content = str ? JSON.parse(str) : {}
    return content.aboutGallery || {}
  })()

  // Use current values if contentUpdate has changed, otherwise use initial values
  const displayAboutStats = contentUpdate > 0 ? currentAboutStats : aboutStats
  const displayAboutValues = contentUpdate > 0 ? currentAboutValues : aboutValues
  const displayAboutGallery = contentUpdate > 0 ? currentAboutGallery : aboutGallery

  // Get page images reactively
  const pageImages = useMemo(() => {
    const pageImagesStr = localStorage.getItem('pageImages')
    return pageImagesStr ? JSON.parse(pageImagesStr) : {}
  }, [contentUpdate])

  const heroContent = {
    title: t.about?.heroTitle || (language === 'bn' ? 'প্রকল্প বিবরণ' : 'About Us'),
    subtitle: t.about?.heroSubtitle || (language === 'bn' ? 'কীভাবে বিলিভার্স ক্রপ কেয়ার আধুনিক এগ্রোনমি, নির্ভরযোগ্য সরবরাহ এবং মাঠ সহযোগিতার মাধ্যমে কৃষকদের পাশে থাকে তা জানুন।' : 'Discover how Believers Crop Care supports farmers with scalable programs, modern agronomy, and dependable distribution.')
  }

  const aboutPageTranslations = language === 'en'
    ? {
      ...t,
      about: {
        ...t.about,
        description:
          'Believers Crop Care Ltd. is a growing agricultural company committed to helping farmers protect their crops and improve productivity. We work closely with farmers, dealers, and distributors to understand their needs and provide high-quality, effective, and affordable crop protection products. Every solution we offer is developed with a focus on performance, safety, and environmental responsibility.',
        details:
          'What began as a small team with a big dream has grown into a trusted company with a strong market presence. With our expanding network of partners, we reach more farmers each day, helping them achieve healthier crops and better yields.\n\nThrough continuous research, innovation, and dedication to quality, we aim to build a brighter, greener future for farming communities across the country.'
      }
    }
    : t

  const galleryImages = [
    'https://images.pexels.com/photos/4395041/pexels-photo-4395041.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2733918/pexels-photo-2733918.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/175389/pexels-photo-175389.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3219170/pexels-photo-3219170.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/461411/pexels-photo-461411.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/933624/pexels-photo-933624.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1236664/pexels-photo-1236664.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1526640/pexels-photo-1526640.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3182833/pexels-photo-3182833.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3771113/pexels-photo-3771113.jpeg?auto=compress&cs=tinysrgb&w=800'
  ]
  const gallerySlides = [galleryImages.slice(0, 6), galleryImages.slice(6)]

  const renderGalleryCard = (src, key) => (
    <button
      key={key}
      type="button"
      className="gallery-polaroid"
      onClick={() => setLightboxImage(src)}
    >
      <div className="polaroid-frame">
        <img
          src={src}
          alt="Believers Crop Care moments"
          loading="lazy"
          onError={e => {
            e.currentTarget.src = '/hero-image.jpg'
          }}
        />
      </div>
    </button>
  )

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
  }, [contentUpdate])

  return (
    <div className="app about-page">
      <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
      <main className="about-page-main">
        <section className="about-hero-banner fade-section">
          <div
            className="about-hero-banner-content"
            style={{
              fontWeight: 700,
              background: `linear-gradient(135deg, rgba(9, 17, 31, 0.40), rgba(19, 56, 98, 0.40)), url(${pageImages.aboutHero || '/hero-image.jpg'}) center 40% / cover no-repeat`
            }}
          >
            <h1 className="about-hero-heading">{heroContent.title}</h1>
            <p className="about-hero-subtitle">{heroContent.subtitle}</p>
          </div>
        </section>
        <AboutSection
          t={aboutPageTranslations}
          showButtons={false}
          showAllSections={true}
          visionAnimation={true}
          missionAnimation={true}
          showImages={false}
        />
        <section className="about-stats-section fade-section">
          <div className="about-stats-container">
            <div className="about-stats-heading">
              <p className="about-stats-eyebrow">
                {displayAboutStats.eyebrow || (language === 'bn' ? 'সংখ্যায় আমাদের গল্প' : 'Our story in numbers')}
              </p>
              <h2>
                {displayAboutStats.title || (language === 'bn'
                  ? 'নেটওয়ার্ক, পণ্য ও কভারেজ'
                  : 'Network, products & coverage')}
              </h2>
              <p>
                {displayAboutStats.description || (language === 'bn'
                  ? 'আমাদের বৃদ্ধি এবং প্রতিদিনের প্রভাব এই সংখ্যাগুলোতেই স্পষ্ট।'
                  : 'These figures capture our growth and the impact we deliver every day.')}
              </p>
            </div>
            <div className="about-stats-grid">
              {[
                {
                  icon: '🏪',
                  value: displayAboutStats.stats?.[0]?.value || '350+',
                  label: displayAboutStats.stats?.[0]?.label || (language === 'bn' ? 'ডিলার পার্টনার' : 'Dealer partners'),
                  note: displayAboutStats.stats?.[0]?.note || (language === 'bn'
                    ? 'দেশব্যাপী বিক্রয় ও সাপোর্ট নেটওয়ার্ক'
                    : 'Nationwide sales & support network')
                },
                {
                  icon: '🧪',
                  value: displayAboutStats.stats?.[1]?.value || '120+',
                  label: displayAboutStats.stats?.[1]?.label || (language === 'bn' ? 'পণ্য ও সমাধান' : 'Products & solutions'),
                  note: displayAboutStats.stats?.[1]?.note || (language === 'bn'
                    ? 'প্রতিটি ফসল ধাপে মানসম্মত সুরক্ষা'
                    : 'Protection for every crop stage')
                },
                {
                  icon: '📍',
                  value: displayAboutStats.stats?.[2]?.value || '64',
                  label: displayAboutStats.stats?.[2]?.label || (language === 'bn' ? 'জেলা কভারেজ' : 'Districts served'),
                  note: displayAboutStats.stats?.[2]?.note || (language === 'bn'
                    ? 'বাংলাদেশের প্রতিটি জেলায় মাঠ দল'
                    : 'On-ground teams in every district')
                }
              ].map(stat => (
                <div key={stat.label} className="about-stat-card compact">
                  <span className="about-stat-icon" aria-hidden="true">
                    {stat.icon}
                  </span>
                  <div className="about-stat-label-block">
                    <small>{stat.label}</small>
                    <span className="about-stat-value">{stat.value}</span>
                  </div>
                  <p>{stat.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <TeamSection t={t} language={language} teamMembers={pageImages.teamMembers || []} />
        <section
          className="about-values-section fade-section"
          style={{
            background: `linear-gradient(180deg, rgba(248, 250, 252, 0.192), rgba(232, 247, 241, 0.192)), url(${pageImages.aboutValuesBackground || 'https://images.stockcake.com/public/e/6/e/e6e4865c-08b7-4633-b428-f5658462485e_large/farmers-tending-crops-stockcake.jpg'}) center/cover no-repeat`
          }}
        >
          <div className="about-values-container">
            <div className="about-values-header">
              <p className="about-values-eyebrow">
                {displayAboutValues.eyebrow || (language === 'bn' ? 'আমরা যা মূল্য দিই' : 'What we value')}
              </p>
              <h2>
                {displayAboutValues.title || (language === 'bn'
                  ? 'প্রতিটি সিদ্ধান্তে আমাদের মূল মূল্যবোধ'
                  : 'Values that guide every decision')}
              </h2>
              <p>
                {displayAboutValues.description || (language === 'bn'
                  ? 'কৃষকের পাশে থাকা, সঠিক ফলাফল আনা এবং দলকে সম্মান করা আমাদের সংস্কৃতির অংশ।'
                  : 'Staying close to farmers, owning the outcome, and uplifting our team define our culture.')}
              </p>
            </div>
            <div className="about-values-grid">
              {[
                {
                  icon: '✨',
                  title: displayAboutValues.values?.[0]?.title || (language === 'bn' ? 'বিস্ময় সৃষ্টি করি' : 'Create wow moments'),
                  desc: displayAboutValues.values?.[0]?.description || (language === 'bn'
                    ? 'প্রতিটি প্রকল্পে অভিজ্ঞতা স্মরণীয় করে তুলি।'
                    : 'Make every interaction memorable for farmers and partners.')
                },
                {
                  icon: '📈',
                  title: displayAboutValues.values?.[1]?.title || (language === 'bn' ? 'অবিরাম উন্নতি' : 'Eager to improve'),
                  desc: displayAboutValues.values?.[1]?.description || (language === 'bn'
                    ? 'গবেষণা, প্রশিক্ষণ ও শেখার মাধ্যমে প্রতিদিন উন্নতি করি।'
                    : 'Keep learning through research, training, and field lessons.')
                },
                {
                  icon: '🤝',
                  title: displayAboutValues.values?.[2]?.title || (language === 'bn' ? 'পরিকল্পনা আমাদের' : 'Own the result'),
                  desc: displayAboutValues.values?.[2]?.description || (language === 'bn'
                    ? 'সাফল্য ও চ্যালেঞ্জ দুটোই দায়িত্ব নিয়ে সামলাই।'
                    : 'Take responsibility for both wins and challenges.')
                },
                {
                  icon: '🌱',
                  title: displayAboutValues.values?.[3]?.title || (language === 'bn' ? 'সততা ও যত্ন' : 'No shortcuts'),
                  desc: displayAboutValues.values?.[3]?.description || (language === 'bn'
                    ? 'টেকসই, নিরাপদ ও honest উপায়ে কাজ করি।'
                    : 'Choose sustainable, transparent ways of working.')
                },
                {
                  icon: '🌤️',
                  title: displayAboutValues.values?.[4]?.title || (language === 'bn' ? 'ইতিবাচক মনোভাব' : 'Optimism always'),
                  desc: displayAboutValues.values?.[4]?.description || (language === 'bn'
                    ? 'প্রতিটি অঞ্চলে সমাধান নিয়ে পৌঁছানোর বিশ্বাস রাখি।'
                    : 'Believe we can solve for every region we serve.')
                }
              ].map(value => (
                <div key={value.title} className="about-value-card">
                  <span className="about-value-icon" aria-hidden="true">
                    {value.icon}
                  </span>
                  <h3>{value.title}</h3>
                  <p>{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="about-gallery-section fade-section">
          <div className="about-gallery-container">
            <div className="about-gallery-header">
              <p className="about-gallery-eyebrow">
                {displayAboutGallery.eyebrow || (language === 'bn' ? 'আমাদের যাত্রার মুহূর্ত' : 'Life at Believers')}
              </p>
              <h2>
                {displayAboutGallery.title || (language === 'bn'
                  ? 'দলের সাথে কাটানো স্মরণীয় কিছু মুহূর্ত'
                  : 'Snapshots from the field and our team')}
              </h2>
            </div>
            <div className="about-gallery-collage">
              {galleryImages.map((src, index) => renderGalleryCard(src, `${src}-${index}`))}
            </div>
            <div className="about-gallery-slider">
              <div className="gallery-slider-track">
                {gallerySlides.map((slide, slideIndex) => (
                  <div className="gallery-slide" key={`gallery-slide-${slideIndex}`}>
                    {slide.map((src, itemIndex) =>
                      renderGalleryCard(src, `slide-${slideIndex}-${itemIndex}`)
                    )}
                  </div>
                ))}
              </div>
              <div className="gallery-slider-indicators">
                {gallerySlides.map((_, idx) => (
                  <span key={`dot-${idx}`} />
                ))}
              </div>
            </div>
          </div>
        </section>
        {lightboxImage && (
          <div className="about-gallery-lightbox" role="dialog" aria-modal="true">
            <div className="lightbox-content">
              <button
                type="button"
                className="lightbox-close"
                onClick={() => setLightboxImage(null)}
                aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close image'}
              >
                &times;
              </button>
              <img src={lightboxImage} alt="Gallery full view" />
            </div>
          </div>
        )}
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

export default AboutPage
