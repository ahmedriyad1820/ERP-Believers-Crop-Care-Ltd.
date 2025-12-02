import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import logoImage from '../assets/logo.png'
import logo2Image from '../assets/logo2.png'

const initialCvForm = {
  fullName: '',
  email: '',
  phone: '',
  jobTitle: '',
  message: ''
}

const JOB_CONFIG = {
  'area-sales-manager': {
    key: 'area-sales-manager',
    applyLastDate: '2025-12-31',
    en: {
      title: 'Area Sales Manager',
      location: 'Multiple districts',
      type: 'Full-time',
      overview:
        'Own regional sales growth by managing dealer networks, supporting field activations, and ensuring strong relationships across your territory.',
      salary: 'BDT 45,000–65,000 per month (plus incentives, based on experience)',
      benefits: [
        'Monthly sales incentives based on target achievement',
        'Festival bonuses as per company policy',
        'Travel allowance and mobile bill as per role',
        'Yearly performance review and promotion opportunities'
      ],
      responsibilities: [
        'Plan and deliver monthly, quarterly, and annual sales targets for the assigned region',
        'Build, nurture, and expand dealer and sub-dealer networks',
        'Execute field campaigns, farmer meetings, and product demonstrations',
        'Track secondary sales and ensure healthy stock rotation at channel level',
        'Coach, guide, and review the performance of field sales representatives'
      ],
      requirements: [
        'Graduate in Agriculture / Marketing / Business or related field (MBA preferred)',
        '2–5 years of experience in agri-inputs / FMCG field sales role',
        'Strong communication and relationship-building skills',
        'Willingness to travel extensively within assigned territory',
        'Ability to analyze sales data and plan corrective actions'
      ]
    },
    bn: {
      title: 'এরিয়া সেলস ম্যানেজার',
      location: 'বিভিন্ন জেলা',
      type: 'ফুল টাইম',
      overview:
        'নিজ এলাকার বিক্রয় প্রবৃদ্ধি নিশ্চিত করতে ডিলার নেটওয়ার্ক পরিচালনা, মাঠ কার্যক্রম সমন্বয় এবং মজবুত সম্পর্ক গড়ে তুলতে হবে।',
      salary: 'মাসিক বেতন প্রায় ৪৫,০০০–৬৫,০০০ টাকা (অভিজ্ঞতা ও টার্গেট অনুযায়ী ইনসেন্টিভ সহ)',
      benefits: [
        'মাসিক সেলস ইনসেন্টিভ (টার্গেট পূরণের উপর ভিত্তি করে)',
        'কোম্পানি নীতিমালা অনুযায়ী উৎসব ভাতা',
        'ট্যুর ভাতা ও মোবাইল বিল',
        'বার্ষিক পারফরম্যান্স রিভিউ ও প্রমোশনের সুযোগ'
      ],
      responsibilities: [
        'নির্ধারিত এলাকার মাসিক, ত্রৈমাসিক ও বার্ষিক সেলস টার্গেট পরিকল্পনা ও অর্জন',
        'ডিলার ও সাব-ডিলার নেটওয়ার্ক গঠন ও মজবুতকরণ',
        'ফার্মার মিটিং, ক্যাম্পেইন ও প্রোডাক্ট ডেমো আয়োজন ও বাস্তবায়ন',
        'চ্যানেল পর্যায়ে সেকেন্ডারি সেলস ও স্টক রোটেশন মনিটরিং',
        'ফিল্ড সেলস টিমকে গাইড করা, কোচিং এবং পারফরম্যান্স রিভিউ'
      ],
      requirements: [
        'কৃষি / মার্কেটিং / বিজনেস বা সমমানের বিষয়ে স্নাতক (এমবিএ অগ্রাধিকারযোগ্য)',
        'এগ্রো ইনপুটস / এফএমসিজি সেক্টরে ২–৫ বছরের ফিল্ড সেলস অভিজ্ঞতা',
        'ভাল কমিউনিকেশন স্কিল ও সম্পর্ক তৈরি করার সক্ষমতা',
        'দায়িত্বপ্রাপ্ত এলাকায় নিয়মিত ভ্রমণ করতে আগ্রহী',
        'সেলস ডাটা বিশ্লেষণ ও পরবর্তী পরিকল্পনা করার দক্ষতা'
      ]
    }
  },
  'field-agronomy-officer': {
    key: 'field-agronomy-officer',
    applyLastDate: '2025-12-31',
    en: {
      title: 'Field Agronomy Officer',
      location: 'Field-based',
      type: 'Full-time',
      overview:
        'Be the technical face of the company in the field, running demo plots, farmer trainings, and capturing insights to improve our solutions.',
      salary: 'BDT 35,000–55,000 per month (depending on experience)',
      benefits: [
        'Field allowance for travel and stays',
        'Festival bonuses as per company policy',
        'Training and development programs',
        'Yearly performance-based increment'
      ],
      responsibilities: [
        'Plan, establish, and monitor demo plots for key crops and products',
        'Conduct farmer meetings and dealer trainings on product usage and best agronomy practices',
        'Collect structured feedback on product performance and crop conditions',
        'Prepare technical reports, photos, and field stories for internal teams',
        'Support regional sales teams during major campaigns and field events'
      ],
      requirements: [
        'BSc in Agriculture or related discipline (MS preferred)',
        '1–3 years of experience in agronomy / field extension will be an advantage',
        'Strong presentation and facilitation skills with farmers and dealers',
        'Comfortable working in fields and rural communities',
        'Basic proficiency in MS Office and digital reporting tools'
      ]
    },
    bn: {
      title: 'ফিল্ড এগ্রোনমি অফিসার',
      location: 'ফিল্ড বেসড',
      type: 'ফুল টাইম',
      overview:
        'কোম্পানির টেকনিক্যাল প্রতিনিধি হিসেবে মাঠ পর্যায়ে ডেমো প্লট, কৃষক প্রশিক্ষণ ও ফিডব্যাক সংগ্রহের দায়িত্ব পালন করতে হবে।',
      salary: 'অভিজ্ঞতার ভিত্তিতে মাসিক প্রায় ৩৫,০০০–৫৫,০০০ টাকা',
      benefits: [
        'ফিল্ড ভাতা ও ভ্রমণ সুবিধা',
        'কোম্পানি নীতিমালা অনুযায়ী উৎসব ভাতা',
        'ট্রেনিং ও স্কিল ডেভেলপমেন্ট এর সুযোগ',
        'বার্ষিক ইনক্রিমেন্ট ও পারফরম্যান্স বোনাস'
      ],
      responsibilities: [
        'বিভিন্ন ফসল ও প্রোডাক্টের উপর ডেমো প্লট স্থাপন, পর্যবেক্ষণ ও রিপোর্টিং',
        'কৃষক ও ডিলারদের জন্য ট্রেনিং ও ফিল্ড মিটিং আয়োজন',
        'প্রোডাক্ট পারফরম্যান্স ও ফসলের অবস্থা সম্পর্কে সিস্টেমেটিক ফিডব্যাক সংগ্রহ',
        'টেকনিক্যাল রিপোর্ট, ছবি ও মাঠের গল্প প্রস্তুত করে টিমের সাথে শেয়ার করা',
        'বড় ক্যাম্পেইন ও ইভেন্টে সেলস টিমকে টেকনিক্যাল সাপোর্ট প্রদান'
      ],
      requirements: [
        'কৃষিতে স্নাতক ডিগ্রি (এমএস ডিগ্রি অগ্রাধিকারযোগ্য)',
        'এগ্রোনমি / এক্সটেনশন কাজের ১–৩ বছরের অভিজ্ঞতা থাকলে অগ্রাধিকার',
        'কৃষক ও ডিলারদের সামনে উপস্থাপনা ও প্রশিক্ষণ দেওয়ার সক্ষমতা',
        'গ্রামাঞ্চল ও মাঠ পর্যায়ে কাজ করতে আগ্রহী',
        'বেসিক কম্পিউটার ও ডিজিটাল রিপোর্টিং দক্ষতা'
      ]
    }
  },
  'supply-chain-coordinator': {
    key: 'supply-chain-coordinator',
    applyLastDate: '2025-12-31',
    en: {
      title: 'Supply Chain Coordinator',
      location: 'Head office',
      type: 'Full-time',
      overview:
        'Ensure the right products reach the right place on time by coordinating orders, stock planning, and logistics with our partners.',
      salary: 'BDT 35,000–60,000 per month (based on skills and experience)',
      benefits: [
        'Yearly performance bonus',
        'Festival bonuses as per company policy',
        'Lunch and evening snacks at office (where applicable)',
        'Support for professional training and certifications'
      ],
      responsibilities: [
        'Process distributor and dealer orders accurately in the system',
        'Monitor inventory levels and prepare replenishment plans',
        'Coordinate with warehouse and transport partners for on-time delivery',
        'Maintain up-to-date records of stock movements and documentation',
        'Support monthly and quarterly supply chain performance reviews'
      ],
      requirements: [
        'Graduate in Business / Supply Chain Management or related field',
        '1–3 years of experience in supply chain / logistics / commercial operations',
        'Good analytical and coordination skills',
        'Proficiency in MS Excel and basic ERP / inventory systems',
        'Ability to work cross-functionally with sales and finance teams'
      ]
    },
    bn: {
      title: 'সাপ্লাই চেইন কো-অর্ডিনেটর',
      location: 'হেড অফিস',
      type: 'ফুল টাইম',
      overview:
        'অর্ডার প্রসেসিং, স্টক প্ল্যানিং ও লজিস্টিকস সমন্বয়ের মাধ্যমে সঠিক সময়ে সঠিক স্থানে পণ্য পৌঁছানো নিশ্চিত করতে হবে।',
      salary: 'দক্ষতা ও অভিজ্ঞতার ভিত্তিতে মাসিক প্রায় ৩৫,০০০–৬০,০০০ টাকা',
      benefits: [
        'পারফরম্যান্স ভিত্তিক বাৎসরিক বোনাস',
        'কোম্পানি নীতিমালা অনুযায়ী উৎসব ভাতা',
        'অফিসে লাঞ্চ ও স্ন্যাক্স সুবিধা (যেখানে প্রযোজ্য)',
        'প্রফেশনাল ট্রেনিং ও সার্টিফিকেশন সাপোর্ট'
      ],
      responsibilities: [
        'ডিস্ট্রিবিউটর ও ডিলারের অর্ডার সিস্টেমে এন্ট্রি ও প্রসেসিং',
        'স্টক লেভেল মনিটরিং এবং রি-অর্ডার প্ল্যান তৈরি',
        'ওয়্যারহাউজ ও ট্রান্সপোর্ট পার্টনারদের সাথে ডেলিভারি সমন্বয়',
        'স্টক মুভমেন্ট ও ডকুমেন্টেশন নিয়মিত আপডেট রাখা',
        'মাসিক ও ত্রৈমাসিক সাপ্লাই চেইন পারফরম্যান্স রিপোর্টে সহায়তা করা'
      ],
      requirements: [
        'বিজনেস / সাপ্লাই চেইন ম্যানেজমেন্ট বা সমমানের বিষয়ে স্নাতক',
        'সাপ্লাই চেইন / লজিস্টিকস / কমার্শিয়াল অপারেশনসে ১–৩ বছরের অভিজ্ঞতা',
        'ভাল অ্যানালিটিক্যাল ও কো-অর্ডিনেশন দক্ষতা',
        'এক্সেল ও বেসিক ইআরপি / ইনভেন্টরি সিস্টেমে কাজের অভিজ্ঞতা',
        'সেলস ও ফাইন্যান্স টিমের সাথে সমন্বয় করে কাজ করার মানসিকতা'
      ]
    }
  }
}

function JobDetailsPage({ language, toggleLanguage, t }) {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const isBn = language === 'bn'

  const jobConfig = JOB_CONFIG[jobId]
  const job = jobConfig ? (isBn ? jobConfig.bn : jobConfig.en) : null

  const applyLastDate = jobConfig?.applyLastDate || null
  const formattedDeadline = applyLastDate
    ? new Date(applyLastDate).toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : null

  const [cvForm, setCvForm] = useState(initialCvForm)
  const [cvFile, setCvFile] = useState(null)
  const [cvErrors, setCvErrors] = useState({})
  const [cvFeedback, setCvFeedback] = useState(null)
  const [isSubmittingCv, setIsSubmittingCv] = useState(false)
  const [showCvForm, setShowCvForm] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

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
      // Placeholder for real API integration
      await new Promise(resolve => setTimeout(resolve, 1200))
      setCvFeedback({ type: 'success', message: cvCopy.success })
      setCvForm({
        ...initialCvForm,
        jobTitle: job?.title || ''
      })
      setCvFile(null)
      setCvErrors({})
      event.target.reset()
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
        {/* Hero – job title, type and last date to apply */}
        <section className="about-hero-banner fade-section">
          <div className="about-hero-banner-content" style={{ fontWeight: 700 }}>
            <h1 className="about-hero-heading">
              {job ? job.title : pageTitle}
            </h1>
            {job && (
              <>
                <p className="about-hero-subtitle" style={{ marginTop: '0.5rem' }}>
                  {job.type}
                </p>
                {formattedDeadline && (
                  <p
                    className="about-hero-subtitle"
                    style={{ marginTop: '0.15rem', opacity: 0.85 }}
                  >
                    {isBn
                      ? `আবেদনের শেষ তারিখ: ${formattedDeadline}`
                      : `Last date to apply: ${formattedDeadline}`}
                  </p>
                )}
              </>
            )}
          </div>
        </section>

        {job && (
          <section className="job-details-section fade-section">
            <div className="job-details-container">
              <div className="job-details-grid">
                {/* Left column: role snapshot card + key responsibilities */}
                <aside className="job-details-aside">
                  <div className="job-details-summary-card">
                    <p className="job-summary-eyebrow">
                      {isBn ? 'পদের সারসংক্ষেপ' : 'Role snapshot'}
                    </p>
                    <h3 className="job-summary-title">{job.title}</h3>
                    <p className="job-summary-location">
                      {job.location} • {job.type}
                    </p>
                    {job.salary && (
                      <p className="job-summary-salary">
                        {isBn ? 'প্রস্তাবিত বেতন:' : 'Estimated salary:'} {job.salary}
                      </p>
                    )}
                    <p className="job-summary-text">
                      {isBn
                        ? 'আপনি ফিল্ড টিম, ডিলার নেটওয়ার্ক এবং ম্যানেজমেন্টের মাঝে গুরুত্বপূর্ণ সংযোগ হিসেবে কাজ করবেন।'
                        : 'You will work as the key link between our field teams, dealer network and management.'}
                    </p>
                    {job.benefits && job.benefits.length > 0 && (
                      <ul className="job-summary-benefits">
                        {job.benefits.slice(0, 3).map(item => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                    <button
                      type="button"
                      className="job-apply-cta"
                      onClick={() => setShowCvForm(true)}
                    >
                      {isBn ? 'এই পদের জন্য আবেদন করুন' : 'Apply for this role'}
                    </button>
                  </div>
                  <div className="job-details-card" style={{ marginTop: '1.25rem' }}>
                    <h2>{isBn ? 'মূল দায়িত্ব' : 'Key responsibilities'}</h2>
                    <ul>
                      {job.responsibilities.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </aside>
                {/* Right column: logo (desktop only), back button, then Profile & requirements */}
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
                  <div className="job-details-card">
                    <h2>{isBn ? 'যোগ্যতা ও প্রয়োজনীয়তা' : 'Profile & requirements'}</h2>
                    <ul>
                      {job.requirements.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
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


