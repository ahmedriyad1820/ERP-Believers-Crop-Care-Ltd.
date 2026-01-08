import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import logoImage from '../assets/logo.png'
import logo2Image from '../assets/logo2.png'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

const initialCvForm = {
  fullName: '',
  email: '',
  phone: '',
  jobTitle: '',
  message: ''
}

function JobDetailsPage({ language, toggleLanguage, t }) {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const isBn = language === 'bn'

  const [job, setJob] = useState(null)
  const [loadingJob, setLoadingJob] = useState(true)
  const [cvForm, setCvForm] = useState(initialCvForm)
  const [cvFile, setCvFile] = useState(null)
  const [cvErrors, setCvErrors] = useState({})
  const [cvFeedback, setCvFeedback] = useState(null)
  const [isSubmittingCv, setIsSubmittingCv] = useState(false)
  const [showCvForm, setShowCvForm] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  // Fetch job details from API
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/careers/job/${jobId}`)
        const data = await response.json()
        if (response.ok && data.success) {
          setJob(data.data)
          setCvForm(prev => ({ ...prev, jobTitle: isBn ? data.data.titleBn || data.data.title : data.data.title }))
        }
      } catch (error) {
        console.error('Error fetching job:', error)
      } finally {
        setLoadingJob(false)
      }
    }
    fetchJob()
  }, [jobId, isBn])

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
  }, [job])

  useEffect(() => {
    const updateIsDesktop = () => {
      if (typeof window !== 'undefined') {
        setIsDesktop(window.innerWidth > 1024)
      }
    }
    updateIsDesktop()
    window.addEventListener('resize', updateIsDesktop)
    return () => window.removeEventListener('resize', updateIsDesktop)
  }, [])

  useEffect(() => {
    if (job?.title) {
      setCvForm(prev => ({
        ...prev,
        jobTitle: job.title
      }))
    }
  }, [job?.title])

  const scrollToSection = sectionId => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    if (showCvForm) {
      // wait a tick so the DOM has the new section
      const timeout = setTimeout(() => {
        scrollToSection('cv-upload-section')
      }, 0)
      return () => clearTimeout(timeout)
    }
  }, [showCvForm])

  const handleBack = () => {
    try {
      window.sessionStorage.setItem('careerFromJobDetails', '1')
    } catch (error) {
      console.error('Unable to access sessionStorage', error)
    }
    navigate('/career')
  }

  const pageTitle = isBn ? 'জব ডিটেইলস' : 'Job details'

  const cvCopy = isBn
    ? {
      heading: 'সিভি আপলোড করুন',
      description:
        'আপনার আপডেটেড সিভি শেয়ার করুন, আমরা দ্রুত আপনাকে যোগাযোগ করবো।',
      fields: {
        fullName: 'পূর্ণ নাম',
        email: 'ইমেইল ঠিকানা',
        phone: 'মোবাইল নম্বর',
        jobTitle: 'পদের নাম',
        message: 'কভার লেটার (ঐচ্ছিক)',
        file: 'সিভি ফাইল (PDF বা DOC, সর্বোচ্চ ৫ এমবি)'
      },
      submit: 'সিভি জমা দিন',
      success: 'ধন্যবাদ! আপনার সিভি পেয়েছি এবং খুব শিগগিরই যোগাযোগ করব।',
      error: 'অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন।'
    }
    : {
      heading: 'Upload your CV',
      description:
        'Share your updated resume so our hiring team can reach out quickly.',
      fields: {
        fullName: 'Full name',
        email: 'Email address',
        phone: 'Phone number',
        jobTitle: 'Job title',
        message: 'Cover letter (optional)',
        file: 'CV file (PDF or DOC, max 5 MB)'
      },
      submit: 'Submit CV',
      success: 'Thank you! We received your CV and will be in touch shortly.',
      error: 'Please complete the required fields before submitting.'
    }

  const validateCvForm = () => {
    const errors = {}
    if (!cvForm.fullName.trim()) {
      errors.fullName = isBn ? 'পূর্ণ নাম লিখুন' : 'Please enter your full name'
    }
    if (!cvForm.email.trim()) {
      errors.email = isBn ? 'ইমেইল ঠিকানা লিখুন' : 'Please enter your email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cvForm.email.trim())) {
      errors.email = isBn ? 'সঠিক ইমেইল ঠিকানা দিন' : 'Enter a valid email'
    }
    if (!cvForm.phone.trim()) {
      errors.phone = isBn ? 'মোবাইল নম্বর লিখুন' : 'Enter a phone number'
    }
    if (!cvFile) {
      errors.file = isBn ? 'সিভি ফাইল যুক্ত করুন' : 'Attach your CV file'
    } else if (cvFile.size > 5 * 1024 * 1024) {
      errors.file = isBn ? 'ফাইল সর্বোচ্চ ৫ এমবি হতে পারে' : 'Max file size is 5 MB'
    }
    return errors
  }

  const handleCvInputChange = event => {
    const { name, value } = event.target
    setCvForm(prev => ({ ...prev, [name]: value }))
    setCvErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleCvFileChange = event => {
    const nextFile = event.target.files?.[0] || null
    setCvFile(nextFile)
    setCvErrors(prev => ({ ...prev, file: undefined }))
  }

  const handleCvSubmit = async event => {
    event.preventDefault()
    setCvFeedback(null)
    const nextErrors = validateCvForm()
    if (Object.keys(nextErrors).length > 0) {
      setCvErrors(nextErrors)
      setCvFeedback({ type: 'error', message: cvCopy.error })
      return
    }

    setIsSubmittingCv(true)
    try {
      const formData = new FormData()
      formData.append('jobId', jobId)
      formData.append('jobTitle', cvForm.jobTitle)
      formData.append('fullName', cvForm.fullName)
      formData.append('email', cvForm.email)
      formData.append('phone', cvForm.phone)
      formData.append('message', cvForm.message)
      if (cvFile) {
        formData.append('cv', cvFile)
      }

      const response = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setCvFeedback({ type: 'success', message: cvCopy.success })
        setCvForm({
          ...initialCvForm,
          jobTitle: isBn ? job?.titleBn || job?.title || '' : job?.title || ''
        })
        setCvFile(null)
        setCvErrors({})
        event.target.reset()
      } else {
        throw new Error(data.message || 'Submission failed')
      }
    } catch (error) {
      console.error('CV upload failed', error)
      setCvFeedback({
        type: 'error',
        message:
          isBn
            ? 'কিছু সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।'
            : 'Something went wrong. Please try again later.'
      })
    } finally {
      setIsSubmittingCv(false)
    }
  }

  return (
    <div className="app career-page">
      <SiteHeader language={language} toggleLanguage={toggleLanguage} t={t} />
      <main className="about-page-main">
        {/* Hero – job title, type */}
        <section className="about-hero-banner">
          <div className="about-hero-banner-content" style={{ fontWeight: 700 }}>
            {loadingJob ? (
              <h1 className="about-hero-heading">{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</h1>
            ) : job ? (
              <>
                <h1 className="about-hero-heading">
                  {isBn ? job.titleBn || job.title : job.title}
                </h1>
                <p className="about-hero-subtitle" style={{ marginTop: '0.5rem' }}>
                  {isBn ? job.typeBn || job.type : job.type}
                </p>
              </>
            ) : (
              <h1 className="about-hero-heading">{isBn ? 'চাকরি পাওয়া যায়নি' : 'Job not found'}</h1>
            )}
          </div>
        </section>

        {job && (
          <section className="job-details-section fade-section">
            <div className="job-details-container">
              <div className="job-details-grid">
                {/* Left column: role snapshot card */}
                <aside className="job-details-aside">
                  <div className="job-details-summary-card">
                    <p className="job-summary-eyebrow">
                      {isBn ? 'পদের সারসংক্ষেপ' : 'Role snapshot'}
                    </p>
                    <h3 className="job-summary-title">{isBn ? job.titleBn || job.title : job.title}</h3>
                    <p className="job-summary-location">
                      {isBn ? job.locationBn || job.location : job.location} • {isBn ? job.typeBn || job.type : job.type}
                    </p>

                    {/* Salary Display */}
                    {(isBn ? job.salaryBn || job.salary : job.salary) && (
                      <p className="job-summary-salary" style={{ marginTop: '0.75rem', fontWeight: 600 }}>
                        {isBn ? job.salaryBn || job.salary : job.salary}
                      </p>
                    )}

                    <p className="job-summary-text" style={{ marginTop: '1rem' }}>
                      {/* Prefer overview if available, else summary */}
                      {isBn ? job.overviewBn || job.summaryBn || job.overview || job.summary : job.overview || job.summary}
                    </p>

                    {/* Benefits List with Checkmarks */}
                    {((isBn ? job.benefitsBn : job.benefits) || []).length > 0 && (
                      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
                        {(isBn ? job.benefitsBn || job.benefits : job.benefits).map((item, index) => (
                          <li key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#00af66', marginRight: '0.5rem', fontWeight: 'bold' }}>✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      type="button"
                      className="job-apply-cta"
                      onClick={() => setShowCvForm(true)}
                      style={{ marginTop: '1.5rem', width: '100%' }}
                    >
                      {isBn ? 'এই পদের জন্য আবেদন করুন' : 'Apply for this role'}
                    </button>
                  </div>

                  {/* Responsibilities Section */}
                  {((isBn ? job.responsibilitiesBn : job.responsibilities) || []).length > 0 && (
                    <div className="job-details-card" style={{ marginTop: '1.25rem', border: '1px solid #e0e0e0' }}>
                      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                        {isBn ? 'মূল দায়িত্ব' : 'Key responsibilities'}
                      </h2>
                      <ul style={{ paddingLeft: '1.2rem' }}>
                        {(isBn ? job.responsibilitiesBn || job.responsibilities : job.responsibilities).map((item, index) => (
                          <li key={index} style={{ marginBottom: '0.5rem', color: '#00af66' /* Green bullet */ }}>
                            <span style={{ color: '#333' }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}


                </aside>
                {/* Right column: logo (desktop only), back button, then requirements */}
                <div className="job-details-main">
                  {isDesktop && (
                    <div
                      className="job-details-logo-wrapper"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '5.5rem'
                      }}
                    >
                      <img
                        src={logo2Image}
                        alt="Believers Crop Care Ltd."
                        className="footer-logo-image"
                        style={{ maxWidth: '360px', height: 'auto' }}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    className="job-back-btn"
                    style={{ alignSelf: 'center', marginTop: '1.25rem' }}
                    onClick={handleBack}
                  >
                    {isBn ? '← সব জব লিস্টে ফিরে যান' : '← Back to all openings'}
                  </button>

                  {/* Requirements Section */}
                  {((isBn ? job.requirementsBn : job.requirements) || []).length > 0 && (
                    <div className="job-details-card">
                      <h2>{isBn ? 'যোগ্যতা ও প্রয়োজনীয়তা' : 'Profile & requirements'}</h2>
                      <ul style={{ paddingLeft: '1.2rem' }}>
                        {(isBn ? job.requirementsBn || job.requirements : job.requirements).map((item, index) => (
                          <li key={index} style={{ marginBottom: '0.5rem', color: '#00af66' /* Green bullet */ }}>
                            <span style={{ color: '#333' }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
        {job && showCvForm && (
          <section
            id="cv-upload-section"
            className="job-details-section"
          >
            <div className="job-details-container">
              <div className="job-details-card job-cv-card">
                <h2>{cvCopy.heading}</h2>
                <p className="job-summary-text">{cvCopy.description}</p>
                <form
                  className="job-apply-form job-apply-container"
                  onSubmit={handleCvSubmit}
                  noValidate
                >
                  <div
                    className="job-apply-form-grid job-apply-grid"
                  >
                    <label
                      className="job-apply-form-field"
                    >
                      <span>{cvCopy.fields.fullName}</span>
                      <input
                        type="text"
                        name="fullName"
                        value={cvForm.fullName}
                        onChange={handleCvInputChange}
                        placeholder={cvCopy.fields.fullName}
                        required
                      />
                      {cvErrors.fullName && (
                        <small className="field-error">{cvErrors.fullName}</small>
                      )}
                    </label>
                    <label
                      className="job-apply-form-field"
                    >
                      <span>{cvCopy.fields.email}</span>
                      <input
                        type="email"
                        name="email"
                        value={cvForm.email}
                        onChange={handleCvInputChange}
                        placeholder="name@email.com"
                        required
                      />
                      {cvErrors.email && (
                        <small className="field-error">{cvErrors.email}</small>
                      )}
                    </label>
                    <label
                      className="job-apply-form-field"
                    >
                      <span>{cvCopy.fields.phone}</span>
                      <input
                        type="tel"
                        name="phone"
                        value={cvForm.phone}
                        onChange={handleCvInputChange}
                        placeholder="+8801XXXXXXXXX"
                        required
                      />
                      {cvErrors.phone && (
                        <small className="field-error">{cvErrors.phone}</small>
                      )}
                    </label>
                    <label
                      className="job-apply-form-field"
                    >
                      <span>{cvCopy.fields.jobTitle}</span>
                      <input
                        type="text"
                        name="jobTitle"
                        value={cvForm.jobTitle || job?.title || ''}
                        readOnly
                        placeholder={job?.title || cvCopy.fields.jobTitle}
                      />
                    </label>
                    <label
                      className="job-apply-form-field"
                      style={{ gridColumn: '1 / -1' }}
                    >
                      <span>{cvCopy.fields.message}</span>
                      <textarea
                        name="message"
                        value={cvForm.message}
                        onChange={handleCvInputChange}
                        rows={4}
                        placeholder={cvCopy.fields.message}
                      />
                    </label>
                    <label
                      className="job-apply-form-field"
                      style={{ gridColumn: '1 / -1' }}
                    >
                      <span>{cvCopy.fields.file}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvFileChange}
                        required
                      />
                      {cvErrors.file && (
                        <small className="field-error">{cvErrors.file}</small>
                      )}
                    </label>
                  </div>
                  {cvFeedback && (
                    <p
                      className={`job-form-feedback ${cvFeedback.type}`}
                      role="status"
                    >
                      {cvFeedback.message}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="job-apply-cta"
                    disabled={isSubmittingCv}
                  >
                    {isSubmittingCv ? (isBn ? 'প্রক্রিয়াধীন...' : 'Submitting...') : cvCopy.submit}
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logoImage} alt="Believers Crop Care Ltd." className="footer-logo-image" />
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

export default JobDetailsPage


