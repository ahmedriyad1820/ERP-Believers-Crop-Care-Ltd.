import { useEffect, useMemo, useState } from 'react'

const MANAGEMENT_SLIDE_SIZE = 3

function TeamSection({ t, language, className = '', showManagement = true }) {
  const [managementSlide, setManagementSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const managementMembers = useMemo(
    () =>
      showManagement
        ? (t.team?.members || []).filter(member => member.group === 'management')
        : [],
    [t, showManagement]
  )

  const managementSlides = useMemo(() => {
    if (!showManagement) {
      return []
    }
    const slides = []
    const slideSize = isMobile ? 1 : MANAGEMENT_SLIDE_SIZE
    for (let i = 0; i < managementMembers.length; i += slideSize) {
      slides.push(managementMembers.slice(i, i + slideSize))
    }
    return slides
  }, [managementMembers, isMobile])

  const managementMaxSlide = showManagement ? Math.max(0, managementSlides.length - 1) : 0

  useEffect(() => {
    if (!showManagement) {
      return
    }
    setManagementSlide(prev => Math.min(prev, managementMaxSlide))
  }, [managementMaxSlide, showManagement])

  useEffect(() => {
    if (!showManagement) {
      return
    }
    setManagementSlide(0)
  }, [language, showManagement])

  useEffect(() => {
    if (!showManagement || !isMobile || managementSlides.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      setManagementSlide(prev => (prev < managementMaxSlide ? prev + 1 : 0))
    }, 3000)

    return () => clearInterval(interval)
  }, [isMobile, managementMaxSlide, managementSlides.length])

  const handleManagementNext = () => {
    if (!showManagement) {
      return
    }
    setManagementSlide(prev => (prev < managementMaxSlide ? prev + 1 : 0))
  }

  const handleManagementPrev = () => {
    if (!showManagement) {
      return
    }
    setManagementSlide(prev => (prev > 0 ? prev - 1 : managementMaxSlide))
  }

  const getMembersByGroup = groupKey => {
    if (!t.team?.members) {
      return []
    }
    return groupKey === 'all'
      ? t.team.members
      : t.team.members.filter(member => member.group === groupKey)
  }

  return (
    <section className={`team-section fade-section ${className}`}>
      <div className="team-container">
        <div className="team-header">
          <p className="team-tagline">{t.team?.tagline}</p>
          <h2 className="team-title">{t.team?.title}</h2>
          <p className="team-description">{t.team?.description}</p>
        </div>
        <div className="team-groups">
          {(t.team?.groups || [{ key: 'all', title: '' }]).map(group => {
            if (!showManagement && group.key === 'management') {
              return null
            }
            const members = getMembersByGroup(group.key)
            if (!members.length) {
              return null
            }
            const isManagement = group.key === 'management'
            return (
              <div key={group.key} className="team-group">
                {group.title && (
                  <div className="team-group-header">
                    <span className="team-group-label">{group.title}</span>
                  </div>
                )}
                {isManagement ? (
                  <div className="team-management-slider">
                    <button
                      type="button"
                      className="team-slider-btn team-slider-btn-prev"
                      onClick={handleManagementPrev}
                      aria-label="Previous management members"
                      disabled={managementSlides.length <= 1}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div className="team-management-track">
                      <div
                        className="team-management-inner"
                        style={{ transform: `translateX(-${managementSlide * 100}%)` }}
                      >
                        {managementSlides.map((slide, slideIndex) => (
                          <div key={`management-${slideIndex}`} className="team-management-slide">
                            {slide.map(member => (
                              <div key={member.name} className="team-card">
                                <img
                                  className="team-card-photo"
                                  src={member.photo}
                                  alt={member.name}
                                  loading="lazy"
                                  onError={e => {
                                    e.currentTarget.src = '/hero-image.jpg'
                                  }}
                                />
                                <div className="team-card-gradient" aria-hidden="true"></div>
                                <div className="team-card-body">
                                  <div className="team-name-row">
                                    <div className="team-name-block">
                                      <h3>{member.name}</h3>
                                      <p className="team-role-line">{member.role}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="team-slider-btn team-slider-btn-next"
                      onClick={handleManagementNext}
                      aria-label="Next management members"
                      disabled={managementSlides.length <= 1}
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="team-grid">
                    {members.map((member, index) => (
                      <div key={`${group.key}-${index}`} className="team-card">
                        <img
                          className="team-card-photo"
                          src={member.photo}
                          alt={member.name}
                          loading="lazy"
                          onError={e => {
                            e.currentTarget.src = '/hero-image.jpg'
                          }}
                        />
                        <div className="team-card-gradient" aria-hidden="true"></div>
                        <div className="team-card-body">
                          <div className="team-name-row">
                            <div className="team-name-block">
                              <h3>{member.name}</h3>
                              <p className="team-role-line">{member.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TeamSection

