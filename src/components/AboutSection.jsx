import { useState, useRef, useEffect } from 'react'
import logoImage from '../assets/logo.png'
import logoImageAlt from '../assets/logo2.png'

function AboutSection({ 
  t, 
  className = '', 
  enableFade = true,
  showButtons = true,
  showAllSections = false,
  visionAnimation = false,
  missionAnimation = false,
  showImages = true
}) {
  const [expandedSection, setExpandedSection] = useState(null)
  const visionRef = useRef(null)
  const missionRef = useRef(null)
  const [visionAnimated, setVisionAnimated] = useState(false)
  const [missionAnimated, setMissionAnimated] = useState(false)

  const handleVisionClick = () => {
    setExpandedSection(prev => (prev === 'vision' ? null : 'vision'))
  }

  const handleMissionClick = () => {
    setExpandedSection(prev => (prev === 'mission' ? null : 'mission'))
  }

  useEffect(() => {
    if (expandedSection === 'vision' && visionRef.current) {
      visionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    if (expandedSection === 'mission' && missionRef.current) {
      missionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [expandedSection])

  useEffect(() => {
    if (!visionAnimation) {
      setVisionAnimated(false)
      return
    }

    if (!showAllSections) {
      setVisionAnimated(expandedSection === 'vision')
      return
    }

    if (visionAnimated) {
      return
    }

    const target = visionRef.current
    if (!target) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisionAnimated(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [visionAnimation, showAllSections, expandedSection, visionAnimated])

  useEffect(() => {
    if (!missionAnimation) {
      setMissionAnimated(false)
      return
    }

    if (!showAllSections) {
      setMissionAnimated(expandedSection === 'mission')
      return
    }

    if (missionAnimated) {
      return
    }

    const target = missionRef.current
    if (!target) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setMissionAnimated(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [missionAnimation, showAllSections, expandedSection, missionAnimated])

  const sectionClassNames = [
    'about-section',
    enableFade ? 'fade-section' : '',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClassNames}>
      <div className="about-container">
        <div className="about-content">
          <div className="about-text-wrapper">
            <p className="about-tagline">{t.about.tagline}</p>
            <p className="about-description">{t.about.description}</p>
            <div className="about-details">
              {t.about.details.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            {showButtons && (
              <div className="about-buttons">
                <button 
                  className={`about-more-btn ${expandedSection === 'vision' ? 'active' : ''}`}
                  onClick={handleVisionClick}
                >
                  {t.about.visionButton}
                </button>
                <button 
                  className={`about-more-btn ${expandedSection === 'mission' ? 'active' : ''}`}
                  onClick={handleMissionClick}
                >
                  {t.about.missionButton}
                </button>
              </div>
            )}
          </div>

          {showImages ? (
            <div className="about-images-wrapper">
              <div className="about-oval-images">
                <div className="about-oval-image about-oval-top">
                  <img src="/hero-image.jpg" alt="Vineyard landscape" />
                </div>
                <div className="about-oval-image about-oval-bottom">
                  <img src="/hero-image.jpg" alt="Wheat field at sunrise" />
                </div>
              </div>
              
              <div className="about-circular-image">
                <img src="/hero-image.jpg" alt="Aerial view of farmland" />
                <div className="circular-image-overlay">
                  <p className="overlay-text">{t.about.tagline}</p>
                </div>
              </div>
              
              {showButtons && (
                <div className="about-buttons-responsive">
                  <button 
                    className={`about-more-btn ${expandedSection === 'vision' ? 'active' : ''}`}
                    onClick={handleVisionClick}
                  >
                    {t.about.visionButton}
                  </button>
                  <button 
                    className={`about-more-btn ${expandedSection === 'mission' ? 'active' : ''}`}
                    onClick={handleMissionClick}
                  >
                    {t.about.missionButton}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="about-images-wrapper about-logo-wrapper">
              <img src={logoImageAlt || logoImage} alt="Believers Crop Care Ltd." className="about-page-logo" />
            </div>
          )}
        </div>

        {(showAllSections || expandedSection === 'vision') && (
          <div className="about-extended-section" ref={visionRef}>
            <div
              className={[
                'about-extended-content',
                visionAnimation && showAllSections ? 'vision-animated' : '',
                visionAnimation &&
                  ((showAllSections && visionAnimated) ||
                    (!showAllSections && expandedSection === 'vision'))
                  ? 'vision-animate-active'
                  : ''
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="about-extended-text">
                <h2 className="about-extended-title">{t.about.vision.title}</h2>
                <div className="about-extended-description">
                  {t.about.vision.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="about-extended-photo-frame">
                <div className="photo-frame">
                  <img src="/hero-image.jpg" alt="Vision" />
                </div>
              </div>
            </div>
          </div>
        )}

        {(showAllSections || expandedSection === 'mission') && (
          <div className="about-extended-section" ref={missionRef}>
            <div
              className={[
                'about-extended-content mission-extended-content',
                missionAnimation && showAllSections ? 'mission-animated' : '',
                missionAnimation &&
                  ((showAllSections && missionAnimated) ||
                    (!showAllSections && expandedSection === 'mission'))
                  ? 'mission-animate-active'
                  : ''
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="about-extended-photo-frame mission-photo">
                <div className="photo-frame">
                  <img src="/hero-image.jpg" alt="Mission" />
                </div>
              </div>
              <div className="about-extended-text mission-text">
                <h2 className="about-extended-title">{t.about.mission.title}</h2>
                <div className="about-extended-description">
                  {t.about.mission.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AboutSection

