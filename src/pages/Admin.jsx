import { useState, useEffect } from 'react'

// Resolve API base so mobile devices on the LAN can reach the backend.
// If VITE_API_BASE is unset or set to 0.0.0.0/localhost, fall back to the current host.
const resolveApiBase = () => {
  const envBase = import.meta.env.VITE_API_BASE

  // Prefer an explicitly configured base unless it's the non-routable placeholder.
  if (envBase && !['http://0.0.0.0:5000', 'http://localhost:5000'].includes(envBase)) {
    return envBase
  }

  // Derive from the page origin (works for mobile testing on the same network).
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const { protocol, hostname } = window.location
    return `${protocol}//${hostname}:5000`
  }

  // Safe fallback for SSR/unknown contexts.
  return 'http://localhost:5000'
}

const API_BASE = resolveApiBase()
import { useNavigate } from 'react-router-dom'
import logoImage from '../assets/logo.png'

function AdminPage({ language, toggleLanguage, t }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
const [userRole, setUserRole] = useState('Admin')
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('adminPassword') || 'admin123')
  const [loggedInUser, setLoggedInUser] = useState('')
  const [loggedInUserId, setLoggedInUserId] = useState(null) // Store employee ID if employee logged in
  const [isEmployee, setIsEmployee] = useState(false) // Track if logged in as employee
  const [editingSection, setEditingSection] = useState(null)
  const defaultPageImages = {
    homeHero: '/hero-image.jpg',
    homeHeroImages: ['/hero-image.jpg'],
    homeHeroVideo: '',
    homeHeroMediaType: 'photos',
    aboutHero: '/hero-image.jpg',
    productHero: '/hero-image.jpg',
    noticeHero: '/hero-image.jpg',
    careerHero: '/hero-image.jpg',
    blogHero: '/hero-image.jpg',
    aboutSectionImage1: '/hero-image.jpg',
    aboutSectionImage2: '/hero-image.jpg',
    aboutSectionImage3: '/hero-image.jpg',
    visionImage: '/hero-image.jpg',
    missionImage: '/hero-image.jpg',
    aboutValuesBackground: 'https://images.stockcake.com/public/e/6/e/e6e4865c-08b7-4633-b428-f5658462485e_large/farmers-tending-crops-stockcake.jpg',
    careerValuesBackground: 'https://images.stockcake.com/public/e/6/e/e6e4865c-08b7-4633-b428-f5658462485e_large/farmers-tending-crops-stockcake.jpg'
  }
  const [heroImage, setHeroImage] = useState('/hero-image.jpg')
  const [profileData, setProfileData] = useState({
    name: 'Admin',
    email: 'admin@example.com',
    phone: '+880 1234 567890',
    address: 'Dhaka, Bangladesh',
    photo: '',
    role: 'Admin',
    designation: '',
    department: ''
  })
  const [profileStatus, setProfileStatus] = useState('')
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
    status: ''
  })
  const [pageImages, setPageImages] = useState(() => {
    const saved = localStorage.getItem('pageImages')
    return saved ? JSON.parse(saved) : {
      homeHero: '/hero-image.jpg',
      homeHeroImages: ['/hero-image.jpg'],
      homeHeroVideo: '',
      homeHeroMediaType: 'photos', // 'photos' or 'video'
      aboutHero: '/hero-image.jpg',
      productHero: '/hero-image.jpg',
      noticeHero: '/hero-image.jpg',
      careerHero: '/hero-image.jpg',
      blogHero: '/hero-image.jpg',
      aboutSectionImage1: '/hero-image.jpg',
      aboutSectionImage2: '/hero-image.jpg',
      aboutSectionImage3: '/hero-image.jpg',
      visionImage: '/hero-image.jpg',
      missionImage: '/hero-image.jpg',
      aboutValuesBackground: 'https://images.stockcake.com/public/e/6/e/e6e4865c-08b7-4633-b428-f5658462485e_large/farmers-tending-crops-stockcake.jpg',
      careerValuesBackground: 'https://images.stockcake.com/public/e/6/e/e6e4865c-08b7-4633-b428-f5658462485e_large/farmers-tending-crops-stockcake.jpg'
    }
  })
  const [editedContent, setEditedContent] = useState(() => {
    const saved = localStorage.getItem('editedContent')
    return saved ? JSON.parse(saved) : {}
  })
  const [showPreview, setShowPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('/')
  const [editMode, setEditMode] = useState(false)
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    nid: '',
    document: '',
    emergencyContactName: '',
    emergencyContact: '',
    salary: '',
    salesTarget: '',
    bankName: '',
    bankBranch: '',
    accountNumber: '',
    department: '',
    role: '',
    designation: '',
    photo: '',
    status: 'Unpaid'
  })
  const [employeeStatus, setEmployeeStatus] = useState('')
  const [generatedCredentials, setGeneratedCredentials] = useState(null)
  const [viewingEmployee, setViewingEmployee] = useState(null)
  const [isEditingEmployee, setIsEditingEmployee] = useState(false)
  const [editingEmployeeData, setEditingEmployeeData] = useState(null)
  const [savingEmployee, setSavingEmployee] = useState(false)
  const [lastGeneratedPassword, setLastGeneratedPassword] = useState('')
  const [showChangePassword, setShowChangePassword] = useState(false)

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })

  const normalizeSalaryStatus = (status) => status === 'Paid' ? 'Paid' : 'Unpaid'

  const handleSaveEmployeeEdit = async () => {
    if (!editingEmployeeData || !viewingEmployee?._id) return
    
    try {
      setSavingEmployee(true)
      const res = await fetch(`${API_BASE}/api/employees/${viewingEmployee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingEmployeeData.name,
          email: editingEmployeeData.email,
          phone: editingEmployeeData.phone,
          address: editingEmployeeData.address,
          nid: editingEmployeeData.nid,
          document: editingEmployeeData.document,
          emergencyContactName: editingEmployeeData.emergencyContactName,
          emergencyContact: editingEmployeeData.emergencyContact,
          salary: editingEmployeeData.salary,
          salesTarget: editingEmployeeData.salesTarget,
          bankName: editingEmployeeData.bankName,
          bankBranch: editingEmployeeData.bankBranch,
          accountNumber: editingEmployeeData.accountNumber,
          department: editingEmployeeData.department,
          designation: editingEmployeeData.designation,
          photo: editingEmployeeData.photo,
          status: editingEmployeeData.status
        })
      })
      
      if (!res.ok) throw new Error('Failed to update employee')
      
      const updatedData = await res.json()
      
      // Update viewing employee and employee list
      setViewingEmployee({ ...updatedData.data, status: normalizeSalaryStatus(updatedData.data.status) })
      
      // Refresh employee list
      const resEmployees = await fetch(`${API_BASE}/api/employees`)
      if (resEmployees.ok) {
        const empData = await resEmployees.json()
        setEmployees((empData.data || []).map((e) => ({
          ...e,
          status: normalizeSalaryStatus(e.status)
        })))
      }
      
      setIsEditingEmployee(false)
      setEditingEmployeeData(null)
      setSavingEmployee(false)
    } catch (err) {
      console.error('Failed to save employee', err)
      alert(language === 'en' ? 'Failed to update employee' : 'কর্মচারী আপডেট করতে ব্যর্থ')
      setSavingEmployee(false)
    }
  }

  // Check if user is already logged in
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        // Only load admin profile on initial load if not authenticated yet
        // Profile will be loaded after login
        if (!isAuthenticated) {
          const resProfile = await fetch(`${API_BASE}/api/admin/profile`)
          if (resProfile.ok) {
            const data = await resProfile.json()
            setProfileData({
              name: data.name || 'Admin',
              email: data.email || 'admin@example.com',
              phone: data.phone || '+880 1234 567890',
              address: data.address || 'Dhaka, Bangladesh',
              photo: data.photo || '',
              role: 'Admin'
            })
          }
        }
        const resPassword = await fetch(`${API_BASE}/api/admin/password`)
        if (resPassword.ok) {
          const pwd = await resPassword.json()
          setAdminPassword(pwd.password || 'admin123')
        }
        const resImages = await fetch(`${API_BASE}/api/page-images`)
        if (resImages.ok) {
          const imgs = await resImages.json()
          setPageImages({ ...defaultPageImages, ...(imgs?.data || {}) })
        } else {
          setPageImages(defaultPageImages)
        }
        const resEmployees = await fetch(`${API_BASE}/api/employees`)
        if (resEmployees.ok) {
          const empData = await resEmployees.json()
          setEmployees((empData.data || []).map((e) => ({
            ...e,
            status: normalizeSalaryStatus(e.status)
          })))
        }
      } catch (err) {
        console.error('Failed to load initial data', err)
        setPageImages(defaultPageImages)
      }
    }
    fetchInitial()
  }, [])

  // Page images updates now come from API; no storage listener

  // Save edited content
  const saveContent = (section, data) => {
    const updated = { ...editedContent, [section]: data }
    setEditedContent(updated)
    localStorage.setItem('editedContent', JSON.stringify(updated))
    // Dispatch event to notify main app
    window.dispatchEvent(new Event('contentUpdated'))
    // Refresh preview if open
    if (showPreview) {
      refreshPreview()
    }
  }

  // Refresh preview iframe
  const refreshPreview = () => {
    const iframe = document.getElementById('admin-preview-iframe')
    if (iframe) {
      iframe.src = iframe.src
    }
  }

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Received message from iframe:', event.data)
      if (event.data.type === 'admin-save-content') {
        const { section, data } = event.data
        console.log('Saving content:', section, data)
        saveContent(section, data)
      } else if (event.data.type === 'admin-save-image') {
        const { url } = event.data
        console.log('Saving image:', url)
        handleHeroImageUrlChange(url)
      } else if (event.data.type === 'contentUpdated') {
        console.log('Content updated event received')
        // Trigger refresh
        window.dispatchEvent(new Event('contentUpdated'))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [editedContent])

  // Enable/disable edit mode in preview
  useEffect(() => {
    if (!showPreview || !editMode) return

    const iframe = document.getElementById('admin-preview-iframe')
    if (!iframe) return

    const setupEditMode = () => {
      try {
        const iframeWindow = iframe.contentWindow
        const iframeDoc = iframe.contentDocument || iframeWindow?.document

        if (!iframeDoc || !iframeDoc.body) {
          // Retry after a short delay
          setTimeout(setupEditMode, 200)
          return
        }

        const enableEditMode = () => {
      // Add edit mode styles
      const style = iframeDoc.createElement('style')
      style.id = 'admin-edit-mode-styles'
      style.textContent = `
        .admin-editable {
          position: relative;
          cursor: pointer;
          outline: 2px dashed rgba(34, 197, 94, 0.5) !important;
          outline-offset: 2px;
          transition: all 0.2s ease;
        }
        .admin-editable:hover {
          outline-color: rgba(34, 197, 94, 0.8) !important;
          background: rgba(34, 197, 94, 0.1) !important;
        }
        .admin-editing {
          outline: 3px solid #22c55e !important;
          background: rgba(34, 197, 94, 0.15) !important;
        }
        .admin-edit-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .admin-edit-popup {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          max-width: 600px;
          width: 90%;
          z-index: 1000000;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .admin-edit-popup h3 {
          margin: 0 0 1rem 0;
          color: #0f172a;
        }
        .admin-edit-popup textarea {
          width: 100%;
          min-height: 100px;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
        }
        .admin-edit-popup-buttons {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .admin-edit-popup-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .admin-edit-popup-btn.save {
          background: #22c55e;
          color: white;
        }
        .admin-edit-popup-btn.save:hover {
          background: #16a34a;
        }
        .admin-edit-popup-btn.cancel {
          background: #e2e8f0;
          color: #475467;
        }
        .admin-edit-popup-btn.cancel:hover {
          background: #cbd5e1;
        }
      `
      if (!iframeDoc.getElementById('admin-edit-mode-styles')) {
        iframeDoc.head.appendChild(style)
      }

      // Add editable class to elements - wait a bit for elements to render
      setTimeout(() => {
        // Hero Section
        const heroTitle = iframeDoc.querySelector('.hero-title')
        const heroDescription = iframeDoc.querySelector('.hero-description')
        const heroButton = iframeDoc.querySelector('.learn-more-btn')
        const heroImage = iframeDoc.querySelector('.hero-background-image')
        
        // Review Section
        const ratingNumber = iframeDoc.querySelector('.rating-number')
        const reviewCount = iframeDoc.querySelector('.review-count')
        
        // About Page Hero Section
        const aboutHeroHeading = iframeDoc.querySelector('.about-hero-heading')
        const aboutHeroSubtitle = iframeDoc.querySelector('.about-hero-subtitle')
        
        // About Section
        const aboutTagline = iframeDoc.querySelector('.about-tagline, .about-eyebrow')
        const aboutTitle = iframeDoc.querySelector('.about-title, .about-header h2')
        const aboutDescription = iframeDoc.querySelector('.about-description, .about-intro')
        const aboutDetailsParagraphs = iframeDoc.querySelectorAll('.about-details p')
        const visionTitle = iframeDoc.querySelector('.vision-title, .about-extended-title, .about-values-header h2')
        const visionContentParagraphs = iframeDoc.querySelectorAll('.vision-extended-description p, .about-extended-description p')
        const missionTitle = iframeDoc.querySelector('.mission-title, .mission-extended-content .about-extended-title')
        const missionContentParagraphs = iframeDoc.querySelectorAll('.mission-extended-description p, .mission-text .about-extended-description p')
        const visionButton = iframeDoc.querySelector('.about-more-btn:first-of-type')
        const missionButton = iframeDoc.querySelector('.about-more-btn:last-of-type')
        
        // Products Section (Homepage)
        const productNames = iframeDoc.querySelectorAll('.product-name, .product-grid-name')
        const productDescriptions = iframeDoc.querySelectorAll('.product-description, .product-grid-description-text')
        const productUsages = iframeDoc.querySelectorAll('.product-usage, .product-grid-usage')
        
        // Products Page Elements
        const productPageHeading = iframeDoc.querySelector('.product-hero-heading')
        const productPageSubtitle = iframeDoc.querySelector('.product-hero-subtitle')
        const productsTagline = iframeDoc.querySelector('.products-tagline')
        const productsTitle = iframeDoc.querySelector('.products-title')
        const productsDescription = iframeDoc.querySelector('.products-description')
        
        // Product Grid Items (on Products page)
        const productGridNames = iframeDoc.querySelectorAll('.product-grid-name')
        const productGridGenericNames = iframeDoc.querySelectorAll('.product-grid-generic-name')
        const productGridCategories = iframeDoc.querySelectorAll('.product-grid-category')
        const productGridDescriptions = iframeDoc.querySelectorAll('.product-grid-description-text')
        const productGridUsages = iframeDoc.querySelectorAll('.product-grid-usage')
        
        // Why Choose Us Section
        const whyChooseUsTitle = iframeDoc.querySelector('.why-choose-us-title')
        const whyChooseUsFeatures = iframeDoc.querySelectorAll('.why-choose-us-card-title, .why-choose-us-card-description')
        
        // Testimonials
        const testimonialTagline = iframeDoc.querySelector('.testimonial-tagline')
        const testimonialTitle = iframeDoc.querySelector('.testimonial-title')
        const testimonialQuotes = iframeDoc.querySelectorAll('.testimonial-quote')
        const testimonialNames = iframeDoc.querySelectorAll('.testimonial-name')
        const testimonialRoles = iframeDoc.querySelectorAll('.testimonial-role')
        
        // Blog Section
        const blogTagline = iframeDoc.querySelector('.blog-tagline')
        const blogTitle = iframeDoc.querySelector('.blog-title')
        const blogCta = iframeDoc.querySelector('.blog-cta')
        const blogTitles = iframeDoc.querySelectorAll('.blog-featured-title, .blog-list-title')
        const blogExcerpts = iframeDoc.querySelectorAll('.blog-featured-excerpt')
        
        // Contact Section
        const contactTitle = iframeDoc.querySelector('.contact-title')
        const contactDescription = iframeDoc.querySelector('.contact-description')
        const contactPhone = iframeDoc.querySelector('.contact-info-value[href^="tel:"]')
        const contactEmail = iframeDoc.querySelector('.contact-info-value[href^="mailto:"]')
        const contactAddress = iframeDoc.querySelector('.contact-info-value:not([href])')
        
        // Areas Covered Section
        const areasCoveredTagline = iframeDoc.querySelector('.areas-covered-tagline')
        const areasCoveredTitle = iframeDoc.querySelector('.areas-covered-title')
        const areasCoveredPill = iframeDoc.querySelector('.areas-covered-pill')
        const areasCoveredBriefTitle = iframeDoc.querySelector('.areas-covered-brief h3')
        const areasCoveredBriefIntro = iframeDoc.querySelector('.areas-covered-brief > p')
        const areasCoveredPoints = iframeDoc.querySelectorAll('.areas-covered-highlight p')
        const areasCoveredMapNote = iframeDoc.querySelector('.areas-covered-map-note')
        
        // Team Section
        const teamTagline = iframeDoc.querySelector('.team-tagline')
        const teamTitle = iframeDoc.querySelector('.team-title')
        const teamDescription = iframeDoc.querySelector('.team-description')
        
        // About Stats Section
        const aboutStatsEyebrow = iframeDoc.querySelector('.about-stats-eyebrow')
        const aboutStatsTitle = iframeDoc.querySelector('.about-stats-heading h2')
        const aboutStatsDescription = iframeDoc.querySelector('.about-stats-heading p')
        const aboutStatLabels = iframeDoc.querySelectorAll('.about-stat-label-block small')
        const aboutStatValues = iframeDoc.querySelectorAll('.about-stat-value')
        const aboutStatNotes = iframeDoc.querySelectorAll('.about-stat-card p')
        
        // About Values Section
        const aboutValuesEyebrow = iframeDoc.querySelector('.about-values-eyebrow')
        const aboutValuesTitle = iframeDoc.querySelector('.about-values-header h2')
        const aboutValuesDescription = iframeDoc.querySelector('.about-values-header p')
        const aboutValueCardTitles = iframeDoc.querySelectorAll('.about-value-card h3')
        const aboutValueCardDescriptions = iframeDoc.querySelectorAll('.about-value-card p')
        
        // About Gallery Section
        const aboutGalleryEyebrow = iframeDoc.querySelector('.about-gallery-eyebrow')
        const aboutGalleryTitle = iframeDoc.querySelector('.about-gallery-header h2')
        
        // Notice Page Hero Section
        const noticeHeroHeading = iframeDoc.querySelector('.notice-hero-heading')
        const noticeHeroSubtitle = iframeDoc.querySelector('.notice-hero-subtitle')
        
        // Note: Career and Blog pages use .about-hero-heading and .about-hero-subtitle
        // which are already handled above for the About page
        
        // Footer
        const footerCopyright = iframeDoc.querySelector('.footer-text')
        const footerTagline = iframeDoc.querySelectorAll('.footer-text')

        console.log('Edit mode - Found elements:', {
          heroTitle: !!heroTitle,
          heroDescription: !!heroDescription,
          heroButton: !!heroButton,
          heroImage: !!heroImage,
          aboutHeroHeading: !!aboutHeroHeading,
          aboutHeroSubtitle: !!aboutHeroSubtitle,
          aboutTagline: !!aboutTagline,
          aboutDescription: !!aboutDescription,
          aboutDetailsParagraphs: aboutDetailsParagraphs.length,
          visionTitle: !!visionTitle,
          visionParagraphs: visionContentParagraphs.length,
          missionTitle: !!missionTitle,
          missionParagraphs: missionContentParagraphs.length,
          products: productNames.length,
          productPageHeading: !!productPageHeading,
          productPageSubtitle: !!productPageSubtitle,
          productsTagline: !!productsTagline,
          productsTitle: !!productsTitle,
          productsDescription: !!productsDescription,
          productGridItems: productGridNames.length,
          areasCoveredTagline: !!areasCoveredTagline,
          areasCoveredTitle: !!areasCoveredTitle,
          areasCoveredPill: !!areasCoveredPill,
          areasCoveredBriefTitle: !!areasCoveredBriefTitle,
          areasCoveredBriefIntro: !!areasCoveredBriefIntro,
          areasCoveredPoints: areasCoveredPoints.length,
          areasCoveredMapNote: !!areasCoveredMapNote,
          teamTagline: !!teamTagline,
          teamTitle: !!teamTitle,
          teamDescription: !!teamDescription,
          aboutStatsEyebrow: !!aboutStatsEyebrow,
          aboutStatsTitle: !!aboutStatsTitle,
          aboutStatsDescription: !!aboutStatsDescription,
          aboutStatLabels: aboutStatLabels.length,
          aboutStatValues: aboutStatValues.length,
          aboutStatNotes: aboutStatNotes.length,
          aboutValuesEyebrow: !!aboutValuesEyebrow,
          aboutValuesTitle: !!aboutValuesTitle,
          aboutValuesDescription: !!aboutValuesDescription,
          aboutValueCardTitles: aboutValueCardTitles.length,
          aboutValueCardDescriptions: aboutValueCardDescriptions.length,
          aboutGalleryEyebrow: !!aboutGalleryEyebrow,
          aboutGalleryTitle: !!aboutGalleryTitle,
          noticeHeroHeading: !!noticeHeroHeading,
          noticeHeroSubtitle: !!noticeHeroSubtitle,
          testimonialTagline: !!testimonialTagline,
          testimonialTitle: !!testimonialTitle,
          testimonials: testimonialQuotes.length,
          blogTagline: !!blogTagline,
          blogTitle: !!blogTitle,
          blogCta: !!blogCta
        })

        // Hero Section
        if (heroTitle) {
          heroTitle.classList.add('admin-editable')
          heroTitle.setAttribute('data-edit-type', 'hero-title')
        }
        if (heroDescription) {
          heroDescription.classList.add('admin-editable')
          heroDescription.setAttribute('data-edit-type', 'hero-description')
        }
        if (heroButton) {
          heroButton.classList.add('admin-editable')
          heroButton.setAttribute('data-edit-type', 'hero-button')
        }
        if (heroImage) {
          heroImage.classList.add('admin-editable')
          heroImage.setAttribute('data-edit-type', 'hero-image')
        }
        
        // About Page Hero Section
        if (aboutHeroHeading) {
          aboutHeroHeading.classList.add('admin-editable')
          aboutHeroHeading.setAttribute('data-edit-type', 'about-hero-heading')
        }
        if (aboutHeroSubtitle) {
          aboutHeroSubtitle.classList.add('admin-editable')
          aboutHeroSubtitle.setAttribute('data-edit-type', 'about-hero-subtitle')
        }
        
        // Review Section
        if (ratingNumber) {
          ratingNumber.classList.add('admin-editable')
          ratingNumber.setAttribute('data-edit-type', 'review-rating')
        }
        if (reviewCount) {
          reviewCount.classList.add('admin-editable')
          reviewCount.setAttribute('data-edit-type', 'review-count')
        }
        
        // About Section
        if (aboutTagline) {
          aboutTagline.classList.add('admin-editable')
          aboutTagline.setAttribute('data-edit-type', 'about-tagline')
        }
        if (aboutTitle) {
          aboutTitle.classList.add('admin-editable')
          aboutTitle.setAttribute('data-edit-type', 'about-title')
        }
        if (aboutDescription) {
          aboutDescription.classList.add('admin-editable')
          aboutDescription.setAttribute('data-edit-type', 'about-description')
        }
        // Make each details paragraph editable
        aboutDetailsParagraphs.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `about-details-${idx}`)
          el.setAttribute('data-paragraph-index', idx.toString())
        })
        if (visionTitle) {
          visionTitle.classList.add('admin-editable')
          visionTitle.setAttribute('data-edit-type', 'vision-title')
        }
        // Make each vision paragraph editable
        visionContentParagraphs.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `vision-content-${idx}`)
          el.setAttribute('data-paragraph-index', idx.toString())
        })
        if (missionTitle) {
          missionTitle.classList.add('admin-editable')
          missionTitle.setAttribute('data-edit-type', 'mission-title')
        }
        // Make each mission paragraph editable
        missionContentParagraphs.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `mission-content-${idx}`)
          el.setAttribute('data-paragraph-index', idx.toString())
        })
        if (visionButton) {
          visionButton.classList.add('admin-editable')
          visionButton.setAttribute('data-edit-type', 'vision-button')
        }
        if (missionButton) {
          missionButton.classList.add('admin-editable')
          missionButton.setAttribute('data-edit-type', 'mission-button')
        }
        
        // Products Section (Homepage) - make first few editable
        productNames.forEach((el, idx) => {
          if (idx < 5) {
            el.classList.add('admin-editable')
            el.setAttribute('data-edit-type', `product-name-${idx}`)
            el.setAttribute('data-product-index', idx.toString())
          }
        })
        productDescriptions.forEach((el, idx) => {
          if (idx < 5) {
            el.classList.add('admin-editable')
            el.setAttribute('data-edit-type', `product-description-${idx}`)
            el.setAttribute('data-product-index', idx.toString())
          }
        })
        
        // Products Page Header
        if (productPageHeading) {
          productPageHeading.classList.add('admin-editable')
          productPageHeading.setAttribute('data-edit-type', 'product-page-heading')
        }
        if (productPageSubtitle) {
          productPageSubtitle.classList.add('admin-editable')
          productPageSubtitle.setAttribute('data-edit-type', 'product-page-subtitle')
        }
        if (productsTagline) {
          productsTagline.classList.add('admin-editable')
          productsTagline.setAttribute('data-edit-type', 'products-tagline')
        }
        if (productsTitle) {
          productsTitle.classList.add('admin-editable')
          productsTitle.setAttribute('data-edit-type', 'products-title')
        }
        if (productsDescription) {
          productsDescription.classList.add('admin-editable')
          productsDescription.setAttribute('data-edit-type', 'products-description')
        }
        
        // Product Grid Items (Products page) - make all editable
        productGridNames.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `product-grid-name-${idx}`)
          el.setAttribute('data-product-index', idx.toString())
        })
        productGridGenericNames.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `product-grid-generic-${idx}`)
          el.setAttribute('data-product-index', idx.toString())
        })
        productGridCategories.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `product-grid-category-${idx}`)
          el.setAttribute('data-product-index', idx.toString())
        })
        productGridDescriptions.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `product-grid-description-${idx}`)
          el.setAttribute('data-product-index', idx.toString())
        })
        productGridUsages.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `product-grid-usage-${idx}`)
          el.setAttribute('data-product-index', idx.toString())
        })
        
        // Why Choose Us
        if (whyChooseUsTitle) {
          whyChooseUsTitle.classList.add('admin-editable')
          whyChooseUsTitle.setAttribute('data-edit-type', 'why-choose-us-title')
        }
        whyChooseUsFeatures.forEach((el, idx) => {
          el.classList.add('admin-editable')
          const isTitle = el.classList.contains('why-choose-us-card-title')
          el.setAttribute('data-edit-type', `why-choose-us-${isTitle ? 'title' : 'description'}-${idx}`)
          el.setAttribute('data-feature-index', idx.toString())
        })
        
        // Testimonials
        if (testimonialTagline) {
          testimonialTagline.classList.add('admin-editable')
          testimonialTagline.setAttribute('data-edit-type', 'testimonial-tagline')
        }
        if (testimonialTitle) {
          testimonialTitle.classList.add('admin-editable')
          testimonialTitle.setAttribute('data-edit-type', 'testimonial-title')
        }
        testimonialQuotes.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `testimonial-quote-${idx}`)
          el.setAttribute('data-testimonial-index', idx.toString())
        })
        testimonialNames.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `testimonial-name-${idx}`)
          el.setAttribute('data-testimonial-index', idx.toString())
        })
        testimonialRoles.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `testimonial-role-${idx}`)
          el.setAttribute('data-testimonial-index', idx.toString())
        })
        
        // Blog
        if (blogTagline) {
          blogTagline.classList.add('admin-editable')
          blogTagline.setAttribute('data-edit-type', 'blog-tagline')
        }
        if (blogTitle) {
          blogTitle.classList.add('admin-editable')
          blogTitle.setAttribute('data-edit-type', 'blog-title')
        }
        if (blogCta) {
          blogCta.classList.add('admin-editable')
          blogCta.setAttribute('data-edit-type', 'blog-cta')
        }
        blogTitles.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `blog-title-${idx}`)
          el.setAttribute('data-blog-index', idx.toString())
        })
        
        // Contact
        if (contactTitle) {
          contactTitle.classList.add('admin-editable')
          contactTitle.setAttribute('data-edit-type', 'contact-title')
        }
        if (contactDescription) {
          contactDescription.classList.add('admin-editable')
          contactDescription.setAttribute('data-edit-type', 'contact-description')
        }
        if (contactPhone) {
          contactPhone.classList.add('admin-editable')
          contactPhone.setAttribute('data-edit-type', 'contact-phone')
        }
        if (contactEmail) {
          contactEmail.classList.add('admin-editable')
          contactEmail.setAttribute('data-edit-type', 'contact-email')
        }
        if (contactAddress) {
          contactAddress.classList.add('admin-editable')
          contactAddress.setAttribute('data-edit-type', 'contact-address')
        }
        
        // Areas Covered Section
        if (areasCoveredTagline) {
          areasCoveredTagline.classList.add('admin-editable')
          areasCoveredTagline.setAttribute('data-edit-type', 'areas-covered-tagline')
        }
        if (areasCoveredTitle) {
          areasCoveredTitle.classList.add('admin-editable')
          areasCoveredTitle.setAttribute('data-edit-type', 'areas-covered-title')
        }
        if (areasCoveredPill) {
          areasCoveredPill.classList.add('admin-editable')
          areasCoveredPill.setAttribute('data-edit-type', 'areas-covered-pill')
        }
        if (areasCoveredBriefTitle) {
          areasCoveredBriefTitle.classList.add('admin-editable')
          areasCoveredBriefTitle.setAttribute('data-edit-type', 'areas-covered-brief-title')
        }
        if (areasCoveredBriefIntro) {
          areasCoveredBriefIntro.classList.add('admin-editable')
          areasCoveredBriefIntro.setAttribute('data-edit-type', 'areas-covered-brief-intro')
        }
        areasCoveredPoints.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `areas-covered-point-${idx}`)
          el.setAttribute('data-point-index', idx.toString())
        })
        if (areasCoveredMapNote) {
          areasCoveredMapNote.classList.add('admin-editable')
          areasCoveredMapNote.setAttribute('data-edit-type', 'areas-covered-map-note')
        }
        
        // Team Section
        if (teamTagline) {
          teamTagline.classList.add('admin-editable')
          teamTagline.setAttribute('data-edit-type', 'team-tagline')
        }
        if (teamTitle) {
          teamTitle.classList.add('admin-editable')
          teamTitle.setAttribute('data-edit-type', 'team-title')
        }
        if (teamDescription) {
          teamDescription.classList.add('admin-editable')
          teamDescription.setAttribute('data-edit-type', 'team-description')
        }
        
        // About Stats Section
        if (aboutStatsEyebrow) {
          aboutStatsEyebrow.classList.add('admin-editable')
          aboutStatsEyebrow.setAttribute('data-edit-type', 'about-stats-eyebrow')
        }
        if (aboutStatsTitle) {
          aboutStatsTitle.classList.add('admin-editable')
          aboutStatsTitle.setAttribute('data-edit-type', 'about-stats-title')
        }
        if (aboutStatsDescription) {
          aboutStatsDescription.classList.add('admin-editable')
          aboutStatsDescription.setAttribute('data-edit-type', 'about-stats-description')
        }
        aboutStatLabels.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `about-stat-label-${idx}`)
          el.setAttribute('data-stat-index', idx.toString())
        })
        aboutStatValues.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `about-stat-value-${idx}`)
          el.setAttribute('data-stat-index', idx.toString())
        })
        aboutStatNotes.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `about-stat-note-${idx}`)
          el.setAttribute('data-stat-index', idx.toString())
        })
        
        // About Values Section
        if (aboutValuesEyebrow) {
          aboutValuesEyebrow.classList.add('admin-editable')
          aboutValuesEyebrow.setAttribute('data-edit-type', 'about-values-eyebrow')
        }
        if (aboutValuesTitle) {
          aboutValuesTitle.classList.add('admin-editable')
          aboutValuesTitle.setAttribute('data-edit-type', 'about-values-title')
        }
        if (aboutValuesDescription) {
          aboutValuesDescription.classList.add('admin-editable')
          aboutValuesDescription.setAttribute('data-edit-type', 'about-values-description')
        }
        aboutValueCardTitles.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `about-value-title-${idx}`)
          el.setAttribute('data-value-index', idx.toString())
        })
        aboutValueCardDescriptions.forEach((el, idx) => {
          el.classList.add('admin-editable')
          el.setAttribute('data-edit-type', `about-value-description-${idx}`)
          el.setAttribute('data-value-index', idx.toString())
        })
        
        // About Gallery Section
        if (aboutGalleryEyebrow) {
          aboutGalleryEyebrow.classList.add('admin-editable')
          aboutGalleryEyebrow.setAttribute('data-edit-type', 'about-gallery-eyebrow')
        }
        if (aboutGalleryTitle) {
          aboutGalleryTitle.classList.add('admin-editable')
          aboutGalleryTitle.setAttribute('data-edit-type', 'about-gallery-title')
        }
        
        // Notice Page Hero Section
        if (noticeHeroHeading) {
          noticeHeroHeading.classList.add('admin-editable')
          noticeHeroHeading.setAttribute('data-edit-type', 'notice-hero-heading')
        }
        if (noticeHeroSubtitle) {
          noticeHeroSubtitle.classList.add('admin-editable')
          noticeHeroSubtitle.setAttribute('data-edit-type', 'notice-hero-subtitle')
        }
        
        // Footer
        if (footerCopyright && footerCopyright.length > 0) {
          footerCopyright[0].classList.add('admin-editable')
          footerCopyright[0].setAttribute('data-edit-type', 'footer-copyright')
        }
      }, 500)

      // Add click handlers
      const handleEditClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const element = e.target.closest('.admin-editable')
        if (!element) return

        const editType = element.getAttribute('data-edit-type')
        if (!editType) return

        element.classList.add('admin-editing')

        // Create unique ID for this edit session
        const editId = 'edit-' + Date.now()
        const currentEditType = editType
        const currentElement = element
        
        // Get initial value
        const initialValue = editType === 'hero-image' 
          ? (element.getAttribute('src') || '')
          : (element.textContent || element.innerText || '').trim()
        
        // Create functions directly on iframe window
        iframeWindow['adminSave_' + editId] = function() {
          try {
            const inputEl = iframeDoc.getElementById(editId + '-input')
            if (!inputEl) {
              console.error('Input not found')
              return false
            }
            
            const newValue = inputEl.value.trim()
            console.log('Save button clicked! Value:', newValue, 'Type:', currentEditType)
            
            if (!newValue) {
              alert('Please enter a value')
              return false
            }
            
            // Get current edited content from localStorage
            const currentContent = JSON.parse(localStorage.getItem('editedContent') || '{}')
            
            if (currentEditType === 'hero-image') {
              currentElement.setAttribute('src', newValue)
              localStorage.setItem('heroImage', newValue)
              if (iframeWindow.postMessage) {
                iframeWindow.postMessage({ type: 'admin-save-image', url: newValue }, '*')
              }
            } else if (currentEditType === 'hero-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.hero) updatedContent.hero = {}
              updatedContent.hero.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              if (iframeWindow.postMessage) {
                iframeWindow.postMessage({ 
                  type: 'admin-save-content', 
                  section: 'hero', 
                  data: updatedContent.hero
                }, '*')
              }
            } else if (currentEditType === 'hero-description') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.hero) updatedContent.hero = {}
              updatedContent.hero.description = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              if (iframeWindow.postMessage) {
                iframeWindow.postMessage({ 
                  type: 'admin-save-content', 
                  section: 'hero', 
                  data: updatedContent.hero
                }, '*')
              }
            } else if (currentEditType === 'hero-button') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.hero) updatedContent.hero = {}
              updatedContent.hero.viewProducts = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              if (iframeWindow.postMessage) {
                iframeWindow.postMessage({ 
                  type: 'admin-save-content', 
                  section: 'hero', 
                  data: updatedContent.hero
                }, '*')
              }
            } else if (currentEditType === 'review-rating') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.review) updatedContent.review = {}
              updatedContent.review.rating = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'review-count') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.review) updatedContent.review = {}
              updatedContent.review.customersReview = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'about-hero-heading') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              // Check which page we're on by checking the iframe URL
              const iframeUrl = iframeWindow.location?.pathname || ''
              if (iframeUrl.includes('/career')) {
                if (!updatedContent.career) updatedContent.career = {}
                if (!updatedContent.career.hero) updatedContent.career.hero = {}
                updatedContent.career.hero.title = newValue
              } else if (iframeUrl.includes('/blog')) {
                if (!updatedContent.blog) updatedContent.blog = {}
                if (!updatedContent.blog.hero) updatedContent.blog.hero = {}
                updatedContent.blog.hero.title = newValue
              } else {
                // Default to about page
                if (!updatedContent.about) updatedContent.about = {}
                updatedContent.about.heroTitle = newValue
              }
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'about-hero-subtitle') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              // Check which page we're on by checking the iframe URL
              const iframeUrl = iframeWindow.location?.pathname || ''
              if (iframeUrl.includes('/career')) {
                if (!updatedContent.career) updatedContent.career = {}
                if (!updatedContent.career.hero) updatedContent.career.hero = {}
                updatedContent.career.hero.subtitle = newValue
              } else if (iframeUrl.includes('/blog')) {
                if (!updatedContent.blog) updatedContent.blog = {}
                if (!updatedContent.blog.hero) updatedContent.blog.hero = {}
                updatedContent.blog.hero.subtitle = newValue
              } else {
                // Default to about page
                if (!updatedContent.about) updatedContent.about = {}
                updatedContent.about.heroSubtitle = newValue
              }
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'about-tagline') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.about) updatedContent.about = {}
              updatedContent.about.tagline = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'about-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.about) updatedContent.about = {}
              updatedContent.about.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'about-description') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.about) updatedContent.about = {}
              updatedContent.about.description = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('about-details-')) {
              const paraIndex = parseInt(currentElement.getAttribute('data-paragraph-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.about) updatedContent.about = {}
              if (!updatedContent.about.details) updatedContent.about.details = []
              updatedContent.about.details[paraIndex] = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'vision-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.about) updatedContent.about = {}
              if (!updatedContent.about.vision) updatedContent.about.vision = {}
              updatedContent.about.vision.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('vision-content-')) {
              const paraIndex = parseInt(currentElement.getAttribute('data-paragraph-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.about) updatedContent.about = {}
              if (!updatedContent.about.vision) updatedContent.about.vision = {}
              if (!updatedContent.about.vision.paragraphs) updatedContent.about.vision.paragraphs = []
              updatedContent.about.vision.paragraphs[paraIndex] = newValue
              // Also update the full content by joining paragraphs
              const allParagraphs = [...(updatedContent.about.vision.paragraphs || [])]
              updatedContent.about.vision.content = allParagraphs.join('\n\n')
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'mission-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.about) updatedContent.about = {}
              if (!updatedContent.about.mission) updatedContent.about.mission = {}
              updatedContent.about.mission.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('mission-content-')) {
              const paraIndex = parseInt(currentElement.getAttribute('data-paragraph-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.about) updatedContent.about = {}
              if (!updatedContent.about.mission) updatedContent.about.mission = {}
              if (!updatedContent.about.mission.paragraphs) updatedContent.about.mission.paragraphs = []
              updatedContent.about.mission.paragraphs[paraIndex] = newValue
              // Also update the full content by joining paragraphs
              const allParagraphs = [...(updatedContent.about.mission.paragraphs || [])]
              updatedContent.about.mission.content = allParagraphs.join('\n\n')
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'vision-button') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.about) updatedContent.about = {}
              updatedContent.about.visionButton = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'mission-button') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.about) updatedContent.about = {}
              updatedContent.about.missionButton = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('product-name-')) {
              const productIndex = parseInt(currentElement.getAttribute('data-product-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = []
              if (!updatedContent.products[productIndex]) updatedContent.products[productIndex] = {}
              updatedContent.products[productIndex].name = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('product-description-')) {
              const productIndex = parseInt(currentElement.getAttribute('data-product-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = []
              if (!updatedContent.products[productIndex]) updatedContent.products[productIndex] = {}
              updatedContent.products[productIndex].description = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'product-page-heading') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = {}
              updatedContent.products.pageHeading = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'product-page-subtitle') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = {}
              updatedContent.products.pageSubtitle = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'products-tagline') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = {}
              updatedContent.products.tagline = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'products-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = {}
              updatedContent.products.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'products-description') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = {}
              updatedContent.products.description = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('product-grid-name-')) {
              const productIndex = parseInt(currentElement.getAttribute('data-product-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = {}
              if (!updatedContent.products.items) updatedContent.products.items = []
              if (!updatedContent.products.items[productIndex]) updatedContent.products.items[productIndex] = {}
              updatedContent.products.items[productIndex].name = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('product-grid-generic-')) {
              const productIndex = parseInt(currentElement.getAttribute('data-product-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = {}
              if (!updatedContent.products.items) updatedContent.products.items = []
              if (!updatedContent.products.items[productIndex]) updatedContent.products.items[productIndex] = {}
              updatedContent.products.items[productIndex].genericName = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('product-grid-category-')) {
              const productIndex = parseInt(currentElement.getAttribute('data-product-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = {}
              if (!updatedContent.products.items) updatedContent.products.items = []
              if (!updatedContent.products.items[productIndex]) updatedContent.products.items[productIndex] = {}
              updatedContent.products.items[productIndex].category = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('product-grid-description-')) {
              const productIndex = parseInt(currentElement.getAttribute('data-product-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = {}
              if (!updatedContent.products.items) updatedContent.products.items = []
              if (!updatedContent.products.items[productIndex]) updatedContent.products.items[productIndex] = {}
              updatedContent.products.items[productIndex].description = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('product-grid-usage-')) {
              const productIndex = parseInt(currentElement.getAttribute('data-product-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.products) updatedContent.products = {}
              if (!updatedContent.products.items) updatedContent.products.items = []
              if (!updatedContent.products.items[productIndex]) updatedContent.products.items[productIndex] = {}
              updatedContent.products.items[productIndex].usage = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'why-choose-us-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.whyChooseUs) updatedContent.whyChooseUs = {}
              updatedContent.whyChooseUs.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('why-choose-us-title-')) {
              const featureIndex = parseInt(currentElement.getAttribute('data-feature-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.whyChooseUs) updatedContent.whyChooseUs = {}
              if (!updatedContent.whyChooseUs.features) updatedContent.whyChooseUs.features = []
              if (!updatedContent.whyChooseUs.features[featureIndex]) updatedContent.whyChooseUs.features[featureIndex] = {}
              updatedContent.whyChooseUs.features[featureIndex].title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('why-choose-us-description-')) {
              const featureIndex = parseInt(currentElement.getAttribute('data-feature-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.whyChooseUs) updatedContent.whyChooseUs = {}
              if (!updatedContent.whyChooseUs.features) updatedContent.whyChooseUs.features = []
              if (!updatedContent.whyChooseUs.features[featureIndex]) updatedContent.whyChooseUs.features[featureIndex] = {}
              updatedContent.whyChooseUs.features[featureIndex].description = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'testimonial-tagline') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.testimonials) updatedContent.testimonials = {}
              updatedContent.testimonials.tagline = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'testimonial-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.testimonials) updatedContent.testimonials = {}
              updatedContent.testimonials.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('testimonial-quote-')) {
              const testimonialIndex = parseInt(currentElement.getAttribute('data-testimonial-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.testimonials) updatedContent.testimonials = {}
              if (!updatedContent.testimonials.cards) updatedContent.testimonials.cards = []
              if (!updatedContent.testimonials.cards[testimonialIndex]) updatedContent.testimonials.cards[testimonialIndex] = {}
              updatedContent.testimonials.cards[testimonialIndex].quote = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('testimonial-name-')) {
              const testimonialIndex = parseInt(currentElement.getAttribute('data-testimonial-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.testimonials) updatedContent.testimonials = {}
              if (!updatedContent.testimonials.cards) updatedContent.testimonials.cards = []
              if (!updatedContent.testimonials.cards[testimonialIndex]) updatedContent.testimonials.cards[testimonialIndex] = {}
              updatedContent.testimonials.cards[testimonialIndex].name = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('testimonial-role-')) {
              const testimonialIndex = parseInt(currentElement.getAttribute('data-testimonial-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.testimonials) updatedContent.testimonials = {}
              if (!updatedContent.testimonials.cards) updatedContent.testimonials.cards = []
              if (!updatedContent.testimonials.cards[testimonialIndex]) updatedContent.testimonials.cards[testimonialIndex] = {}
              updatedContent.testimonials.cards[testimonialIndex].role = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'blog-tagline') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.blog) updatedContent.blog = {}
              updatedContent.blog.tagline = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'blog-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.blog) updatedContent.blog = {}
              updatedContent.blog.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'blog-cta') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.blog) updatedContent.blog = {}
              updatedContent.blog.cta = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('blog-title-')) {
              const blogIndex = parseInt(currentElement.getAttribute('data-blog-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.blog) updatedContent.blog = {}
              if (!updatedContent.blog.list) updatedContent.blog.list = []
              if (!updatedContent.blog.list[blogIndex]) updatedContent.blog.list[blogIndex] = {}
              updatedContent.blog.list[blogIndex].title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'contact-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.contact) updatedContent.contact = {}
              updatedContent.contact.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'contact-description') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.contact) updatedContent.contact = {}
              updatedContent.contact.description = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'contact-phone') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.contact) updatedContent.contact = {}
              updatedContent.contact.phone = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'contact-email') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.contact) updatedContent.contact = {}
              updatedContent.contact.email = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'contact-address') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.contact) updatedContent.contact = {}
              updatedContent.contact.address = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'areas-covered-tagline') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.areasCovered) updatedContent.areasCovered = {}
              updatedContent.areasCovered.tagline = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'areas-covered-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.areasCovered) updatedContent.areasCovered = {}
              updatedContent.areasCovered.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'areas-covered-pill') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.areasCovered) updatedContent.areasCovered = {}
              updatedContent.areasCovered.pill = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'areas-covered-brief-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.areasCovered) updatedContent.areasCovered = {}
              updatedContent.areasCovered.briefTitle = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'areas-covered-brief-intro') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.areasCovered) updatedContent.areasCovered = {}
              updatedContent.areasCovered.briefIntro = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType.startsWith('areas-covered-point-')) {
              const pointIndex = parseInt(currentElement.getAttribute('data-point-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.areasCovered) updatedContent.areasCovered = {}
              if (!updatedContent.areasCovered.briefPoints) updatedContent.areasCovered.briefPoints = []
              updatedContent.areasCovered.briefPoints[pointIndex] = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'areas-covered-map-note') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.areasCovered) updatedContent.areasCovered = {}
              updatedContent.areasCovered.mapAlt = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'team-tagline') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.team) updatedContent.team = {}
              updatedContent.team.tagline = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'team-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.team) updatedContent.team = {}
              updatedContent.team.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'team-description') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.team) updatedContent.team = {}
              updatedContent.team.description = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else if (currentEditType === 'about-stats-eyebrow') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutStats) updatedContent.aboutStats = {}
              updatedContent.aboutStats.eyebrow = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'about-stats-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutStats) updatedContent.aboutStats = {}
              updatedContent.aboutStats.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'about-stats-description') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutStats) updatedContent.aboutStats = {}
              updatedContent.aboutStats.description = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType.startsWith('about-stat-label-')) {
              const statIndex = parseInt(currentElement.getAttribute('data-stat-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutStats) updatedContent.aboutStats = {}
              if (!updatedContent.aboutStats.stats) updatedContent.aboutStats.stats = []
              if (!updatedContent.aboutStats.stats[statIndex]) updatedContent.aboutStats.stats[statIndex] = {}
              updatedContent.aboutStats.stats[statIndex].label = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType.startsWith('about-stat-value-')) {
              const statIndex = parseInt(currentElement.getAttribute('data-stat-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutStats) updatedContent.aboutStats = {}
              if (!updatedContent.aboutStats.stats) updatedContent.aboutStats.stats = []
              if (!updatedContent.aboutStats.stats[statIndex]) updatedContent.aboutStats.stats[statIndex] = {}
              updatedContent.aboutStats.stats[statIndex].value = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType.startsWith('about-stat-note-')) {
              const statIndex = parseInt(currentElement.getAttribute('data-stat-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutStats) updatedContent.aboutStats = {}
              if (!updatedContent.aboutStats.stats) updatedContent.aboutStats.stats = []
              if (!updatedContent.aboutStats.stats[statIndex]) updatedContent.aboutStats.stats[statIndex] = {}
              updatedContent.aboutStats.stats[statIndex].note = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'about-values-eyebrow') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutValues) updatedContent.aboutValues = {}
              updatedContent.aboutValues.eyebrow = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'about-values-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutValues) updatedContent.aboutValues = {}
              updatedContent.aboutValues.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'about-values-description') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutValues) updatedContent.aboutValues = {}
              updatedContent.aboutValues.description = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType.startsWith('about-value-title-')) {
              const valueIndex = parseInt(currentElement.getAttribute('data-value-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutValues) updatedContent.aboutValues = {}
              if (!updatedContent.aboutValues.values) updatedContent.aboutValues.values = []
              if (!updatedContent.aboutValues.values[valueIndex]) updatedContent.aboutValues.values[valueIndex] = {}
              updatedContent.aboutValues.values[valueIndex].title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType.startsWith('about-value-description-')) {
              const valueIndex = parseInt(currentElement.getAttribute('data-value-index') || '0')
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutValues) updatedContent.aboutValues = {}
              if (!updatedContent.aboutValues.values) updatedContent.aboutValues.values = []
              if (!updatedContent.aboutValues.values[valueIndex]) updatedContent.aboutValues.values[valueIndex] = {}
              updatedContent.aboutValues.values[valueIndex].description = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'about-gallery-eyebrow') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutGallery) updatedContent.aboutGallery = {}
              updatedContent.aboutGallery.eyebrow = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'about-gallery-title') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.aboutGallery) updatedContent.aboutGallery = {}
              updatedContent.aboutGallery.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'notice-hero-heading') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.notice) updatedContent.notice = {}
              if (!updatedContent.notice.hero) updatedContent.notice.hero = {}
              updatedContent.notice.hero.title = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'notice-hero-subtitle') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.notice) updatedContent.notice = {}
              if (!updatedContent.notice.hero) updatedContent.notice.hero = {}
              updatedContent.notice.hero.subtitle = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
              window.dispatchEvent(new Event('contentUpdated'))
            } else if (currentEditType === 'footer-copyright') {
              currentElement.textContent = newValue
              const updatedContent = { ...currentContent }
              if (!updatedContent.footer) updatedContent.footer = {}
              updatedContent.footer.copyright = newValue
              localStorage.setItem('editedContent', JSON.stringify(updatedContent))
            } else {
              // Generic fallback - just update the element text
              currentElement.textContent = newValue
              console.log('Generic save for:', currentEditType)
            }
            
            // Dispatch event
            if (iframeWindow.parent) {
              iframeWindow.parent.postMessage({ type: 'contentUpdated' }, '*')
            }
            
            // Remove overlay
            currentElement.classList.remove('admin-editing')
            const overlayEl = iframeDoc.getElementById(editId + '-overlay')
            if (overlayEl) {
              // Run cleanup if exists
              if (overlayEl._cleanup) overlayEl._cleanup()
              overlayEl.remove()
            }
            
            // Clean up
            delete iframeWindow['adminSave_' + editId]
            delete iframeWindow['adminCancel_' + editId]
            
            // Refresh preview
            setTimeout(() => {
              const iframe = document.getElementById('admin-preview-iframe')
              if (iframe) iframe.src = iframe.src
            }, 500)
            
            console.log('Content saved successfully!')
            return false
          } catch (error) {
            console.error('Error in save handler:', error)
            alert('Error saving: ' + error.message)
            return false
          }
        }
        
        iframeWindow['adminCancel_' + editId] = function() {
          try {
            console.log('Cancel button clicked for:', editId)
            currentElement.classList.remove('admin-editing')
            const overlayEl = iframeDoc.getElementById(editId + '-overlay')
            if (overlayEl) {
              // Run cleanup if exists
              if (overlayEl._cleanup) overlayEl._cleanup()
              overlayEl.remove()
            }
            
            // Clean up
            delete iframeWindow['adminSave_' + editId]
            delete iframeWindow['adminCancel_' + editId]
            return false
          } catch (error) {
            console.error('Error in cancel handler:', error)
            return false
          }
        }
        
        // Create popup using DOM methods
        const overlay = iframeDoc.createElement('div')
        overlay.className = 'admin-edit-overlay'
        overlay.id = editId + '-overlay'
        
        const popup = iframeDoc.createElement('div')
        popup.className = 'admin-edit-popup'
        
        const title = iframeDoc.createElement('h3')
        title.textContent = language === 'en' ? 'Edit Content' : 'কন্টেন্ট সম্পাদনা'
        popup.appendChild(title)
        
        const input = editType === 'hero-image' 
          ? iframeDoc.createElement('input')
          : iframeDoc.createElement('textarea')
        
        input.id = editId + '-input'
        input.style.cssText = 'width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; font-family: inherit; resize: vertical; box-sizing: border-box;'
        
        if (editType === 'hero-image') {
          input.type = 'text'
          input.placeholder = '/hero-image.jpg or URL'
          input.value = initialValue
        } else {
          input.style.minHeight = '100px'
          input.value = initialValue
        }
        
        popup.appendChild(input)
        
        const buttonsDiv = iframeDoc.createElement('div')
        buttonsDiv.className = 'admin-edit-popup-buttons'
        
        const saveBtn = iframeDoc.createElement('button')
        saveBtn.className = 'admin-edit-popup-btn save'
        saveBtn.textContent = language === 'en' ? 'Save' : 'সংরক্ষণ'
        saveBtn.type = 'button'
        saveBtn.setAttribute('data-action', 'save')
        saveBtn.setAttribute('data-edit-id', editId)
        
        const cancelBtn = iframeDoc.createElement('button')
        cancelBtn.className = 'admin-edit-popup-btn cancel'
        cancelBtn.textContent = language === 'en' ? 'Cancel' : 'বাতিল'
        cancelBtn.type = 'button'
        cancelBtn.setAttribute('data-action', 'cancel')
        cancelBtn.setAttribute('data-edit-id', editId)
        
        buttonsDiv.appendChild(saveBtn)
        buttonsDiv.appendChild(cancelBtn)
        popup.appendChild(buttonsDiv)
        overlay.appendChild(popup)
        iframeDoc.body.appendChild(overlay)
        
        // Use event delegation on document body
        const handleButtonClick = function(e) {
          const target = e.target
          if (!target || !target.hasAttribute('data-edit-id')) return
          
          const buttonEditId = target.getAttribute('data-edit-id')
          if (buttonEditId !== editId) return
          
          const action = target.getAttribute('data-action')
          e.preventDefault()
          e.stopPropagation()
          e.stopImmediatePropagation()
          
          console.log('Button clicked:', action, 'for editId:', buttonEditId)
          
          if (action === 'save') {
            iframeWindow['adminSave_' + editId]()
          } else if (action === 'cancel') {
            iframeWindow['adminCancel_' + editId]()
          }
        }
        
        // Attach to document with capture phase
        iframeDoc.addEventListener('click', handleButtonClick, true)
        
        // Also attach directly to buttons as backup
        saveBtn.addEventListener('click', function(e) {
          e.preventDefault()
          e.stopPropagation()
          console.log('Direct save click handler')
          iframeWindow['adminSave_' + editId]()
        }, true)
        
        cancelBtn.addEventListener('click', function(e) {
          e.preventDefault()
          e.stopPropagation()
          console.log('Direct cancel click handler')
          iframeWindow['adminCancel_' + editId]()
        }, true)
        
        // Store cleanup function
        overlay._cleanup = function() {
          iframeDoc.removeEventListener('click', handleButtonClick, true)
        }
        
        // Close on overlay click
        overlay.addEventListener('click', function(e) {
          if (e.target === overlay) {
            iframeWindow['adminCancel_' + editId]()
          }
        })
        
        // Prevent popup clicks from closing
        popup.addEventListener('click', function(e) {
          e.stopPropagation()
        })
        
        // Focus input
        setTimeout(() => {
          input.focus()
        }, 100)
        
        // Close on Escape key
        const escapeHandler = function(e) {
          if (e.key === 'Escape') {
            iframeWindow['adminCancel_' + editId]()
            iframeDoc.removeEventListener('keydown', escapeHandler)
          }
        }
        iframeDoc.addEventListener('keydown', escapeHandler)
        
        console.log('Edit popup created with event delegation:', editId, {
          saveBtn: saveBtn,
          cancelBtn: cancelBtn,
          functionsExist: {
            save: typeof iframeWindow['adminSave_' + editId] === 'function',
            cancel: typeof iframeWindow['adminCancel_' + editId] === 'function'
          }
        })
      }

          // Remove old listeners
          iframeDoc.removeEventListener('click', handleEditClick)
          iframeDoc.addEventListener('click', handleEditClick, true)
        }

        enableEditMode()
      } catch (error) {
        console.error('Error setting up edit mode:', error)
        // Retry after a short delay
        setTimeout(setupEditMode, 500)
      }
    }

    // Wait for iframe to load
    const handleIframeLoad = () => {
      setTimeout(setupEditMode, 300)
    }

    iframe.addEventListener('load', handleIframeLoad)
    
    // Also try immediately in case iframe is already loaded
    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
      setTimeout(setupEditMode, 300)
    }

    return () => {
      iframe.removeEventListener('load', handleIframeLoad)
    }
  }, [showPreview, editMode, language])

  // Disable edit mode when editMode is false
  useEffect(() => {
    if (!showPreview || editMode) return

    const iframe = document.getElementById('admin-preview-iframe')
    if (!iframe) return

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (!iframeDoc) return

      const style = iframeDoc.getElementById('admin-edit-mode-styles')
      if (style) style.remove()

      const editables = iframeDoc.querySelectorAll('.admin-editable')
      editables.forEach(el => {
        el.classList.remove('admin-editable', 'admin-editing')
        el.removeAttribute('data-edit-type')
      })
    } catch (error) {
      console.error('Error disabling edit mode:', error)
    }
  }, [showPreview, editMode])


  // Handle hero image URL change
  const handleHeroImageUrlChange = (url) => {
    setHeroImage(url)
    // Refresh preview if open
    if (showPreview) {
      setTimeout(refreshPreview, 100)
    }
  }

  // Handle page image changes
  const handleImageChange = (key, value) => {
    const updated = { ...pageImages, [key]: value }
    savePageImages(updated)
  }

  const handleImageFileChange = (key, e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result
        handleImageChange(key, imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddHeroImage = () => {
    const currentImages = pageImages.homeHeroImages || ['/hero-image.jpg']
    const updated = { ...pageImages, homeHeroImages: [...currentImages, '/hero-image.jpg'] }
    savePageImages(updated)
  }

  const handleRemoveHeroImage = (index) => {
    const currentImages = pageImages.homeHeroImages || ['/hero-image.jpg']
    if (currentImages.length <= 1) return // Keep at least one image
    const updated = { ...pageImages, homeHeroImages: currentImages.filter((_, i) => i !== index) }
    savePageImages(updated)
  }

  const handleHeroImageChange = (index, value) => {
    const currentImages = pageImages.homeHeroImages || ['/hero-image.jpg']
    const updatedImages = [...currentImages]
    updatedImages[index] = value
    const updated = { ...pageImages, homeHeroImages: updatedImages }
    savePageImages(updated)
  }

  const handleHeroImageFileChange = (index, e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result
        handleHeroImageChange(index, imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHeroVideoChange = (value) => {
    const updated = { ...pageImages, homeHeroVideo: value }
    savePageImages(updated)
  }

  const handleHeroMediaTypeChange = (type) => {
    const updated = { ...pageImages, homeHeroMediaType: type }
    savePageImages(updated)
  }

  const handleHeroVideoFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const videoUrl = reader.result
        handleHeroVideoChange(videoUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileFieldChange = (field, value) => {
    const updated = { ...profileData, [field]: value }
    setProfileData(updated)
  }

  const handleProfilePhotoFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result
        const updated = { ...profileData, photo: imageUrl }
        setProfileData(updated)
        localStorage.setItem('adminProfile', JSON.stringify(updated))
      }
      reader.readAsDataURL(file)
    }
  }

  const savePageImages = (updated) => {
    setPageImages(updated)
    fetch(`${API_BASE}/api/page-images`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: updated })
    }).catch((err) => console.error('Save images failed', err))
    if (showPreview) {
      setTimeout(refreshPreview, 100)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setProfileStatus(language === 'en' ? 'Saving...' : 'সংরক্ষণ করা হচ্ছে...')
      
      if (isEmployee && loggedInUserId) {
        // Save employee profile
        const res = await fetch(`${API_BASE}/api/employees/${loggedInUserId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            address: profileData.address,
            photo: profileData.photo
          })
        })
        if (!res.ok) throw new Error('Failed to save profile')
        setProfileStatus(language === 'en' ? 'Saved to database' : 'ডাটাবেজে সংরক্ষিত')
        if (profileData.name) {
          setLoggedInUser(profileData.name)
        }
        // Reload employee profile
        loadUserProfile('employee', loggedInUserId)
      } else {
        // Save admin profile
        const res = await fetch(`${API_BASE}/api/admin/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData)
        })
        if (!res.ok) throw new Error('Failed to save profile')
        setProfileStatus(language === 'en' ? 'Saved to database' : 'ডাটাবেজে সংরক্ষিত')
        if (profileData.name) {
          setLoggedInUser(profileData.name)
        }
        // Always set Admin role for admin profile
        setUserRole('Admin')
        // Reload admin profile
        loadUserProfile('admin')
      }
    } catch (err) {
      console.error('Save profile failed', err)
      setProfileStatus(language === 'en' ? 'Save failed' : 'সংরক্ষণ ব্যর্থ')
    }
  }

  const handleChangePassword = () => {
    const { current, next, confirm } = passwordForm
    if (!next || next.length < 6) {
      setPasswordForm({ ...passwordForm, status: language === 'en' ? 'Password must be at least 6 characters' : 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে' })
      return
    }
    if (next !== confirm) {
      setPasswordForm({ ...passwordForm, status: adminContent.passwordMismatch })
      return
    }
    
    // Determine which endpoint to use based on user type
    if (isEmployee && !loggedInUserId) {
      setPasswordForm({ ...passwordForm, status: language === 'en' ? 'Employee ID not found. Please log in again.' : 'কর্মচারী আইডি পাওয়া যায়নি। অনুগ্রহ করে আবার লগইন করুন।' })
      return
    }
    
    const endpoint = isEmployee && loggedInUserId 
      ? `${API_BASE}/api/employees/change-password`
      : `${API_BASE}/api/admin/change-password`
    
    // Include employee ID in request body for employee password change
    const requestBody = isEmployee && loggedInUserId
      ? { id: loggedInUserId, current, next }
      : { current, next }
    
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.message || (res.status === 404 ? (language === 'en' ? 'Route not found' : 'রুট পাওয়া যায়নি') : adminContent.passwordIncorrect)
        throw new Error(errorMessage)
      }
      if (!isEmployee) {
        setAdminPassword(next)
      } else {
        // If employee changed password, refresh employee list to show updated password
        try {
          const resEmployees = await fetch(`${API_BASE}/api/employees`)
          if (resEmployees.ok) {
            const empData = await resEmployees.json()
            const updatedEmployees = empData.data || []
            setEmployees(updatedEmployees)
            
            // Update viewingEmployee if modal is open and showing this employee
            if (viewingEmployee && viewingEmployee._id === loggedInUserId) {
              const updatedEmployee = updatedEmployees.find((e) => e._id === loggedInUserId)
              if (updatedEmployee) {
                setViewingEmployee(updatedEmployee)
              }
            }
          }
        } catch (err) {
          console.error('Failed to refresh employee list after password change', err)
        }
      }
      setPasswordForm({ current: '', next: '', confirm: '', status: adminContent.passwordUpdated })
    }).catch((err) => {
      setPasswordForm({ ...passwordForm, status: err.message })
    })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')
    
    // Try admin login first
    fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          // Always set role to 'Admin' for admin login
          setUserRole('Admin')
          setIsEmployee(false)
          setLoggedInUserId(null)
          if (data.name) setLoggedInUser(data.name)
          // Load admin profile
          loadUserProfile('admin')
          setIsAuthenticated(true)
          return Promise.resolve(null) // Return resolved promise to skip employee login
        }
        // If admin login fails, try employee login
        return fetch(`${API_BASE}/api/employees/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        })
      })
      .then(async (res) => {
        if (!res) return // Admin login succeeded
        if (!res.ok) {
          throw new Error(language === 'en' ? 'Invalid username or password' : 'ব্যবহারকারীর নাম বা পাসওয়ার্ড ভুল')
        }
        const data = await res.json()
        if (data.role) setUserRole(data.role)
        if (data.name) setLoggedInUser(data.name)
        if (data.id) setLoggedInUserId(data.id)
        setIsEmployee(true)
        // Load employee profile
        loadUserProfile('employee', data.id)
        setIsAuthenticated(true)
      })
      .catch((err) => {
        setLoginError(err.message)
      })
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setLoggedInUser('')
    setLoggedInUserId(null)
    setIsEmployee(false)
    setUserRole('Admin')
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUsername')
    setActiveTab('dashboard')
  }

  // Load user profile (admin or employee)
  const loadUserProfile = async (userType, employeeId = null) => {
    try {
      if (userType === 'admin') {
        const resProfile = await fetch(`${API_BASE}/api/admin/profile`)
        if (resProfile.ok) {
          const data = await resProfile.json()
          setProfileData({
            name: data.name || 'Admin',
            email: data.email || 'admin@example.com',
            phone: data.phone || '+880 1234 567890',
            address: data.address || 'Dhaka, Bangladesh',
            photo: data.photo || '',
            role: 'Admin',
            designation: '',
            department: ''
          })
          if (data.name) setLoggedInUser(data.name)
          setUserRole('Admin')
        }
      } else if (userType === 'employee' && employeeId) {
        const resEmployee = await fetch(`${API_BASE}/api/employees/${employeeId}`)
        if (resEmployee.ok) {
          const data = await resEmployee.json()
          if (data.data) {
            const emp = data.data
            setProfileData({
              name: emp.name || '',
              email: emp.email || '',
              phone: emp.phone || '',
              address: emp.address || '',
              photo: emp.photo || '',
              role: emp.role || '',
              designation: emp.designation || '',
              department: emp.department || ''
            })
            if (emp.name) setLoggedInUser(emp.name)
            if (emp.role) setUserRole(emp.role)
          }
        }
      }
    } catch (err) {
      console.error('Failed to load profile', err)
    }
  }

  // Role-based access control
  const canAccessTab = (tabName) => {
    if (userRole === 'Admin') return true
    
    // Admin-only tabs
    const adminOnlyTabs = ['settings', 'hr', 'contacts', 'blogs', 'content', 'career', 'manageAsset']
    if (adminOnlyTabs.includes(tabName)) return false
    
    const roleAccess = {
      'RSM': ['dashboard', 'profile', 'crm', 'products', 'orders', 'revenue'],
      'Incharge': ['dashboard', 'profile', 'products', 'orders', 'inventory'],
      'SalesMan': ['dashboard', 'profile', 'products', 'orders']
    }
    
    return roleAccess[userRole]?.includes(tabName) || false
  }

  // Redirect to dashboard if user doesn't have access to current tab
  useEffect(() => {
    if (isAuthenticated && !canAccessTab(activeTab)) {
      setActiveTab('dashboard')
    }
  }, [isAuthenticated, userRole, activeTab])

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="app admin-page">
        <main className="admin-login-container">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <img src={logoImage} alt="BCC Logo" className="admin-login-logo" />
              <h1>{language === 'en' ? 'Login' : 'লগইন'}</h1>
              <p>{language === 'en' ? 'Enter your credentials to access the system' : 'সিস্টেমে অ্যাক্সেস করতে আপনার পরিচয়পত্র লিখুন'}</p>
            </div>
            <form onSubmit={handleLogin} className="admin-login-form">
              {loginError && (
                <div className="admin-login-error">
                  {loginError}
                </div>
              )}
              <div className="admin-form-group">
                <label>{language === 'en' ? 'Username' : 'ব্যবহারকারীর নাম'}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={language === 'en' ? 'Enter username' : 'ব্যবহারকারীর নাম লিখুন'}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>{language === 'en' ? 'Password' : 'পাসওয়ার্ড'}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'en' ? 'Enter password' : 'পাসওয়ার্ড লিখুন'}
                  required
                />
              </div>
              <button type="submit" className="admin-login-btn">
                {language === 'en' ? 'Login' : 'লগইন'}
              </button>
            </form>
            <div className="admin-login-note">
              <p>{language === 'en' ? 'Admin default: admin / admin123' : 'অ্যাডমিন ডিফল্ট: admin / admin123'}</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                {language === 'en' ? 'Employees: Use your username/email and password provided by admin' : 'কর্মচারী: আপনার ব্যবহারকারীর নাম/ইমেইল এবং অ্যাডমিন প্রদত্ত পাসওয়ার্ড ব্যবহার করুন'}
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Admin Dashboard
  const adminContent = language === 'en' ? {
    dashboard: 'Dashboard',
    products: 'Products',
    blogs: 'Blogs',
    contacts: 'Contact Messages',
    profile: 'Profile',
    crm: 'CRM',
    hr: 'HR',
    orders: 'Orders',
    inventory: 'Inventory',
    revenue: 'Revenue',
    manageAsset: 'Manage Asset',
    settings: 'Settings',
    logout: 'Logout',
    overview: 'Overview',
    totalProducts: 'Total Products',
    totalBlogs: 'Total Blogs',
    totalContacts: 'Contact Messages',
    recentActivity: 'Recent Activity',
    manageProducts: 'Manage Products',
    manageBlogs: 'Manage Blogs',
    viewMessages: 'View Messages',
    contentManagement: 'Content Management',
    careerManagement: 'Career Management',
    systemSettings: 'System Settings',
    editContent: 'Edit Content',
    heroSection: 'Hero Section',
    pageContent: 'Page Content',
    livePreview: 'Live Preview',
    closePreview: 'Close Preview',
    viewLivePage: 'View Live Page',
    editMode: 'Edit Mode',
    enableEdit: 'Enable Edit Mode',
    disableEdit: 'Disable Edit Mode',
    addNew: 'Add New',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    search: 'Search...',
    noData: 'No data available',
    save: 'Save',
    cancel: 'Cancel',
    address: 'Address',
    photo: 'Photo',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    updatePassword: 'Update Password',
    passwordUpdated: 'Password updated',
    passwordMismatch: 'Passwords do not match',
    passwordIncorrect: 'Current password is incorrect',
    productName: 'Product Name',
    category: 'Category',
    description: 'Description',
    blogTitle: 'Blog Title',
    author: 'Author',
    date: 'Date',
    message: 'Message',
    name: 'Name',
    email: 'Email',
    phone: 'Phone'
  } : {
    dashboard: 'ড্যাশবোর্ড',
    products: 'পণ্য',
    blogs: 'ব্লগ',
    contacts: 'যোগাযোগ বার্তা',
    profile: 'প্রোফাইল',
    crm: 'সিআরএম',
    hr: 'এইচআর',
    orders: 'অর্ডার',
    inventory: 'ইনভেন্টরি',
    revenue: 'রাজস্ব',
    manageAsset: 'সম্পদ ব্যবস্থাপনা',
    settings: 'সেটিংস',
    logout: 'লগআউট',
    overview: 'ওভারভিউ',
    totalProducts: 'মোট পণ্য',
    totalBlogs: 'মোট ব্লগ',
    totalContacts: 'যোগাযোগ বার্তা',
    recentActivity: 'সাম্প্রতিক কার্যক্রম',
    manageProducts: 'পণ্য পরিচালনা',
    manageBlogs: 'ব্লগ পরিচালনা',
    viewMessages: 'বার্তা দেখুন',
    contentManagement: 'কন্টেন্ট ম্যানেজমেন্ট',
    careerManagement: 'ক্যারিয়ার ম্যানেজমেন্ট',
    systemSettings: 'সিস্টেম সেটিংস',
    editContent: 'কন্টেন্ট সম্পাদনা',
    heroSection: 'হিরো সেকশন',
    pageContent: 'পেজ কন্টেন্ট',
    livePreview: 'লাইভ প্রিভিউ',
    closePreview: 'প্রিভিউ বন্ধ করুন',
    viewLivePage: 'লাইভ পেজ দেখুন',
    editMode: 'এডিট মোড',
    enableEdit: 'এডিট মোড চালু করুন',
    disableEdit: 'এডিট মোড বন্ধ করুন',
    addNew: 'নতুন যোগ করুন',
    edit: 'সম্পাদনা',
    delete: 'মুছুন',
    view: 'দেখুন',
    search: 'খুঁজুন...',
    noData: 'কোন ডেটা নেই',
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    address: 'ঠিকানা',
    photo: 'ছবি',
    changePassword: 'পাসওয়ার্ড পরিবর্তন করুন',
    currentPassword: 'বর্তমান পাসওয়ার্ড',
    newPassword: 'নতুন পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    updatePassword: 'পাসওয়ার্ড আপডেট করুন',
    passwordUpdated: 'পাসওয়ার্ড আপডেট হয়েছে',
    passwordMismatch: 'পাসওয়ার্ড মিলছে না',
    passwordIncorrect: 'বর্তমান পাসওয়ার্ড সঠিক নয়',
    productName: 'পণ্যের নাম',
    category: 'ক্যাটাগরি',
    description: 'বিবরণ',
    blogTitle: 'ব্লগ শিরোনাম',
    author: 'লেখক',
    date: 'তারিখ',
    message: 'বার্তা',
    name: 'নাম',
    email: 'ইমেইল',
    phone: 'ফোন'
  }

  // Mock data for demonstration
  const stats = {
    totalProducts: t.products.items.length,
    totalBlogs: t.blog.featured.length + t.blog.list.length,
    totalContacts: 24,
    recentActivity: [
      { type: 'product', action: 'Updated', item: 'Herbicide Pro', time: '2 hours ago' },
      { type: 'blog', action: 'Published', item: 'Expert Tips for Maximizing Crop Yields', time: '1 day ago' },
      { type: 'contact', action: 'New message from', item: 'Md. Rafiq Hasan', time: '2 days ago' }
    ]
  }

  return (
    <div className="app admin-page">
      <main className="admin-main">
        <div className="admin-sidebar">
          <div className="admin-sidebar-header">
            <h2>
              {language === 'en' 
                ? `${userRole || 'Admin'} Portal`
                : userRole === 'Admin' ? 'অ্যাডমিন প্যানেল'
                : userRole === 'RSM' ? 'আরএসএম পোর্টাল'
                : userRole === 'Incharge' ? 'ইনচার্জ পোর্টাল'
                : userRole === 'SalesMan' ? 'সেলসম্যান পোর্টাল'
                : 'পোর্টাল'
              }
            </h2>
          </div>
          <nav className="admin-nav">
            <button
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {adminContent.dashboard}
            </button>
            <button
              className={`admin-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {adminContent.profile}
            </button>
            {canAccessTab('crm') && (
              <button
                className={`admin-nav-item ${activeTab === 'crm' ? 'active' : ''}`}
                onClick={() => setActiveTab('crm')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.crm}
              </button>
            )}
            {canAccessTab('hr') && (
              <button
                className={`admin-nav-item ${activeTab === 'hr' ? 'active' : ''}`}
                onClick={() => setActiveTab('hr')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.hr}
              </button>
            )}
            {canAccessTab('products') && (
              <button
                className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.products}
              </button>
            )}
            {canAccessTab('orders') && (
              <button
                className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 10a4 4 0 0 1-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.orders}
              </button>
            )}
            {canAccessTab('revenue') && (
              <button
                className={`admin-nav-item ${activeTab === 'revenue' ? 'active' : ''}`}
                onClick={() => setActiveTab('revenue')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.revenue}
              </button>
            )}
            {canAccessTab('inventory') && (
              <button
                className={`admin-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setActiveTab('inventory')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.inventory}
              </button>
            )}
            {canAccessTab('manageAsset') && (
              <button
                className={`admin-nav-item ${activeTab === 'manageAsset' ? 'active' : ''}`}
                onClick={() => setActiveTab('manageAsset')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.manageAsset}
              </button>
            )}
            {canAccessTab('contacts') && (
              <button
                className={`admin-nav-item ${activeTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveTab('contacts')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.contacts}
              </button>
            )}
            {canAccessTab('blogs') && (
              <button
                className={`admin-nav-item ${activeTab === 'blogs' ? 'active' : ''}`}
                onClick={() => setActiveTab('blogs')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.blogs}
              </button>
            )}
            {canAccessTab('content') && (
              <button
                className={`admin-nav-item ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.contentManagement}
              </button>
            )}
            {canAccessTab('career') && (
              <button
                className={`admin-nav-item ${activeTab === 'career' ? 'active' : ''}`}
                onClick={() => setActiveTab('career')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 7V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.careerManagement}
              </button>
            )}
            {canAccessTab('settings') && (
              <button
                className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {adminContent.settings}
              </button>
            )}
          </nav>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {adminContent.logout}
          </button>
        </div>

        <div className="admin-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="admin-tab-content">
              <div className="admin-welcome-section">
                <img src={logoImage} alt="BCC Logo" className="admin-welcome-logo" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h2 className="admin-welcome-text">
                    {language === 'en' ? 'Welcome' : 'স্বাগতম'}, {loggedInUser || 'Admin'}
                  </h2>
                  {profileData.photo ? (
                    <img
                      src={profileData.photo}
                      alt="Profile"
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }}
                    />
                  ) : (
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#111827',
                      fontWeight: 700
                    }}>
                      {(profileData.name || 'A').charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              <h1 className="admin-page-title">{adminContent.overview}</h1>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon products">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{adminContent.totalProducts}</h3>
                    <p>{stats.totalProducts}</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon blogs">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{adminContent.totalBlogs}</h3>
                    <p>{stats.totalBlogs}</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon contacts">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{adminContent.totalContacts}</h3>
                    <p>{stats.totalContacts}</p>
                  </div>
                </div>
              </div>
              <div className="admin-activity-section">
                <h2>{adminContent.recentActivity}</h2>
                <div className="admin-activity-list">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="admin-activity-item">
                      <div className="admin-activity-icon">
                        {activity.type === 'product' && '📦'}
                        {activity.type === 'blog' && '📝'}
                        {activity.type === 'contact' && '✉️'}
                      </div>
                      <div className="admin-activity-content">
                        <p><strong>{activity.action}</strong> {activity.item}</p>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.manageProducts}</h1>
                <button className="admin-add-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {adminContent.addNew}
                </button>
              </div>
              <div className="admin-table-container">
                <div className="admin-search-bar">
                  <input type="text" placeholder={adminContent.search} />
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{adminContent.productName}</th>
                      <th>{adminContent.category}</th>
                      <th>{adminContent.description}</th>
                      <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.products.items.slice(0, 10).map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>{product.description.substring(0, 50)}...</td>
                        <td>
                          <div className="admin-action-buttons">
                            <button className="admin-action-btn edit">{adminContent.edit}</button>
                            <button className="admin-action-btn delete">{adminContent.delete}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Blogs Tab */}
          {activeTab === 'blogs' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.manageBlogs}</h1>
                <button className="admin-add-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {adminContent.addNew}
                </button>
              </div>
              <div className="admin-table-container">
                <div className="admin-search-bar">
                  <input type="text" placeholder={adminContent.search} />
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{adminContent.blogTitle}</th>
                      <th>{adminContent.author}</th>
                      <th>{adminContent.date}</th>
                      <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...t.blog.featured, ...t.blog.list].map((blog, index) => (
                      <tr key={index}>
                        <td>{blog.title}</td>
                        <td>{blog.author}</td>
                        <td>{blog.date}</td>
                        <td>
                          <div className="admin-action-buttons">
                            <button className="admin-action-btn edit">{adminContent.edit}</button>
                            <button className="admin-action-btn delete">{adminContent.delete}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.viewMessages}</h1>
              </div>
              <div className="admin-table-container">
                <div className="admin-search-bar">
                  <input type="text" placeholder={adminContent.search} />
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{adminContent.name}</th>
                      <th>{adminContent.email}</th>
                      <th>{adminContent.phone}</th>
                      <th>{adminContent.message}</th>
                      <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                        {adminContent.noData}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Content Management Tab */}
          {activeTab === 'content' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.contentManagement}</h1>
                <button 
                  className={`admin-preview-btn ${showPreview ? 'active' : ''}`}
                  onClick={() => {
                    setShowPreview(!showPreview)
                    if (!showPreview) {
                      // Refresh preview when opening
                      setTimeout(() => {
                        const iframe = document.getElementById('admin-preview-iframe')
                        if (iframe) {
                          iframe.src = previewUrl
                        }
                      }, 100)
                    }
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {showPreview ? adminContent.closePreview : adminContent.livePreview}
                </button>
              </div>
              
              {showPreview && (
                <div className="admin-preview-container">
                  <div className="admin-preview-header">
                    <div className="admin-preview-controls">
                      <button 
                        className={`admin-preview-nav-btn ${editMode ? 'active' : ''}`}
                        onClick={() => {
                          setEditMode(!editMode)
                        }}
                        style={{ background: editMode ? '#22c55e' : '#334155' }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {editMode ? adminContent.disableEdit : adminContent.enableEdit}
                      </button>
                      <button 
                        className="admin-preview-nav-btn"
                        onClick={() => {
                          setPreviewUrl('/')
                          refreshPreview()
                        }}
                      >
                        {language === 'en' ? 'Home' : 'হোম'}
                      </button>
                      <button 
                        className="admin-preview-nav-btn"
                        onClick={() => {
                          setPreviewUrl('/about')
                          refreshPreview()
                        }}
                      >
                        {language === 'en' ? 'About' : 'আমাদের সম্পর্কে'}
                      </button>
                      <button 
                        className="admin-preview-nav-btn"
                        onClick={() => {
                          setPreviewUrl('/product')
                          refreshPreview()
                        }}
                      >
                        {language === 'en' ? 'Products' : 'পণ্য'}
                      </button>
                      <button 
                        className="admin-preview-nav-btn"
                        onClick={() => {
                          setPreviewUrl('/contact')
                          refreshPreview()
                        }}
                      >
                        {language === 'en' ? 'Contact' : 'যোগাযোগ'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="admin-preview-refresh-btn"
                        onClick={refreshPreview}
                        title={language === 'en' ? 'Refresh Preview' : 'প্রিভিউ রিফ্রেশ করুন'}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23 4v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        className="admin-preview-refresh-btn"
                        onClick={() => window.open(previewUrl, '_blank')}
                        title={language === 'en' ? 'Open in New Tab' : 'নতুন ট্যাবে খুলুন'}
                        style={{ background: '#10b981' }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <iframe
                    id="admin-preview-iframe"
                    src={previewUrl}
                    className="admin-preview-iframe"
                    title="Live Preview"
                  />
                </div>
              )}

              {/* Photo Management Section */}
              <div className="admin-content-section">
                <div className="admin-content-header" style={{ 
                  background: '#ffffff',
                  borderBottom: '1px solid #e5e7eb',
                  padding: '1.5rem 0',
                  marginBottom: '1.5rem'
                }}>
                  <h2 style={{ 
                    margin: 0, 
                    fontSize: '1.5rem', 
                    fontWeight: 600,
                    color: '#111827',
                    letterSpacing: '-0.01em'
                  }}>
                    {language === 'en' ? 'Photo Management' : 'ছবি ব্যবস্থাপনা'}
                  </h2>
                  <p style={{ 
                    margin: '0.5rem 0 0 0', 
                    color: '#6b7280', 
                    fontSize: '0.875rem'
                  }}>
                    {language === 'en' 
                      ? 'Manage all images and videos across your website' 
                      : 'আপনার ওয়েবসাইটের সমস্ত ছবি এবং ভিডিও পরিচালনা করুন'}
                  </p>
                </div>
                
                <div className="admin-photo-management">
                  {/* Home Page Hero Section */}
                  <div className="admin-photo-group" style={{ gridColumn: '1 / -1' }}>
                    <h3 style={{ '--emoji': '"🏠"' }}>{language === 'en' ? 'Home Page Hero' : 'হোম পেজ হিরো'}</h3>
                    
                    {/* Home Page Hero Slider */}
                    <div className="admin-photo-item">
                      <label>{language === 'en' ? 'Home Page Hero Slider' : 'হোম পেজ হিরো স্লাইডার'}</label>
                      
                      {/* Media Type Toggle */}
                      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <label style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                          {language === 'en' ? 'Display Type:' : 'প্রদর্শনের ধরন:'}
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleHeroMediaTypeChange('photos')}
                            style={{
                              background: (pageImages.homeHeroMediaType || 'photos') === 'photos' ? '#22c55e' : '#e2e8f0',
                              color: (pageImages.homeHeroMediaType || 'photos') === 'photos' ? 'white' : '#64748b',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.2s ease',
                              boxShadow: (pageImages.homeHeroMediaType || 'photos') === 'photos' ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none'
                            }}
                          >
                            {(pageImages.homeHeroMediaType || 'photos') === 'photos' && (
                              <span style={{ fontSize: '1.2rem' }}>✓</span>
                            )}
                            {language === 'en' ? 'Photos' : 'ছবি'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHeroMediaTypeChange('video')}
                            style={{
                              background: (pageImages.homeHeroMediaType || 'photos') === 'video' ? '#22c55e' : '#e2e8f0',
                              color: (pageImages.homeHeroMediaType || 'photos') === 'video' ? 'white' : '#64748b',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.2s ease',
                              boxShadow: (pageImages.homeHeroMediaType || 'photos') === 'video' ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none'
                            }}
                          >
                            {(pageImages.homeHeroMediaType || 'photos') === 'video' && (
                              <span style={{ fontSize: '1.2rem' }}>✓</span>
                            )}
                            {language === 'en' ? 'Video' : 'ভিডিও'}
                          </button>
                        </div>
                      </div>
                      
                      {/* Hero Video */}
                      <div style={{ 
                        marginBottom: '2rem', 
                        padding: '1rem', 
                        background: (pageImages.homeHeroMediaType || 'photos') === 'video' ? '#dcfce7' : '#f1f5f9', 
                        borderRadius: '8px',
                        border: (pageImages.homeHeroMediaType || 'photos') === 'video' ? '2px solid #22c55e' : '1px solid #e2e8f0'
                      }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                          {language === 'en' ? 'Hero Video' : 'হিরো ভিডিও'}
                          {(pageImages.homeHeroMediaType || 'photos') === 'video' && (
                            <span style={{ 
                              background: '#22c55e', 
                              color: 'white', 
                              padding: '0.2rem 0.5rem', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}>
                              {language === 'en' ? 'ACTIVE' : 'সক্রিয়'}
                            </span>
                          )}
                        </label>
                        {pageImages.homeHeroVideo ? (
                          <div style={{ marginBottom: '1rem' }}>
                            <video 
                              src={pageImages.homeHeroVideo} 
                              controls 
                              style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', marginBottom: '0.5rem' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleHeroVideoChange('')}
                              style={{
                                background: '#dc2626',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                              }}
                            >
                              {language === 'en' ? 'Remove Video' : 'ভিডিও সরান'}
                            </button>
                          </div>
                        ) : null}
                        <div className="admin-image-controls">
                          <label className="admin-upload-btn">
                            {language === 'en' ? 'Upload Video' : 'ভিডিও আপলোড করুন'}
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleHeroVideoFileChange}
                              style={{ display: 'none' }}
                            />
                          </label>
                          <input
                            type="text"
                            value={pageImages.homeHeroVideo || ''}
                            onChange={(e) => handleHeroVideoChange(e.target.value)}
                            placeholder="Video URL or upload file"
                            className="admin-image-url-input"
                          />
                        </div>
                      </div>

                      {/* Hero Images */}
                      <div style={{
                        padding: '1rem',
                        background: (pageImages.homeHeroMediaType || 'photos') === 'photos' ? '#dcfce7' : '#f1f5f9',
                        borderRadius: '8px',
                        border: (pageImages.homeHeroMediaType || 'photos') === 'photos' ? '2px solid #22c55e' : '1px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {language === 'en' ? 'Hero Images (Slider)' : 'হিরো ছবি (স্লাইডার)'}
                            {(pageImages.homeHeroMediaType || 'photos') === 'photos' && (
                              <span style={{ 
                                background: '#22c55e', 
                                color: 'white', 
                                padding: '0.2rem 0.5rem', 
                                borderRadius: '4px', 
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}>
                                {language === 'en' ? 'ACTIVE' : 'সক্রিয়'}
                              </span>
                            )}
                          </label>
                          <button
                            type="button"
                            onClick={handleAddHeroImage}
                            style={{
                              background: '#22c55e',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: 600
                            }}
                          >
                            {language === 'en' ? '+ Add Image' : '+ ছবি যোগ করুন'}
                          </button>
                        </div>
                        <div className="admin-hero-images-grid">
                          {(pageImages.homeHeroImages || ['/hero-image.jpg']).map((image, index) => (
                            <div key={index} className="admin-photo-card" style={{ marginBottom: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <label style={{ fontWeight: 600 }}>
                                {language === 'en' ? `Image ${index + 1}` : `ছবি ${index + 1}`}
                              </label>
                              {(pageImages.homeHeroImages || ['/hero-image.jpg']).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveHeroImage(index)}
                                  style={{
                                    background: '#dc2626',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                  }}
                                >
                                  {language === 'en' ? 'Remove' : 'সরান'}
                                </button>
                              )}
                            </div>
                            <div className="admin-image-upload">
                              <div className="admin-image-preview">
                                <img src={image} alt={`Hero ${index + 1}`} />
                              </div>
                              <div className="admin-image-controls">
                                <label className="admin-upload-btn">
                                  {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleHeroImageFileChange(index, e)}
                                    style={{ display: 'none' }}
                                  />
                                </label>
                                <input
                                  type="text"
                                  value={image}
                                  onChange={(e) => handleHeroImageChange(index, e.target.value)}
                                  placeholder="/hero-image.jpg or https://..."
                                  className="admin-image-url-input"
                                />
                              </div>
                            </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="admin-hero-images-grid">
                      {/* About Page Hero */}
                      <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                        <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                          {language === 'en' ? 'About Page Hero' : 'আমাদের সম্পর্কে পেজ হিরো'}
                        </label>
                        <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                            <img src={pageImages.aboutHero || '/hero-image.jpg'} alt="About hero" />
                          </div>
                          <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                              {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange('aboutHero', e)}
                                style={{ display: 'none' }}
                              />
                            </label>
                            <input
                              type="text"
                              value={pageImages.aboutHero || '/hero-image.jpg'}
                              onChange={(e) => handleImageChange('aboutHero', e.target.value)}
                              placeholder="/hero-image.jpg or https://..."
                              className="admin-image-url-input"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Product Page Hero */}
                      <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                        <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                          {language === 'en' ? 'Product Page Hero' : 'পণ্য পেজ হিরো'}
                        </label>
                        <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                            <img src={pageImages.productHero || '/hero-image.jpg'} alt="Product hero" />
                          </div>
                          <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                              {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange('productHero', e)}
                                style={{ display: 'none' }}
                              />
                            </label>
                            <input
                              type="text"
                              value={pageImages.productHero || '/hero-image.jpg'}
                              onChange={(e) => handleImageChange('productHero', e.target.value)}
                              placeholder="/hero-image.jpg or https://..."
                              className="admin-image-url-input"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Notice Page Hero */}
                      <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                        <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                          {language === 'en' ? 'Notice Page Hero' : 'নোটিশ পেজ হিরো'}
                        </label>
                        <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                            <img src={pageImages.noticeHero || '/hero-image.jpg'} alt="Notice hero" />
                          </div>
                          <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                              {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange('noticeHero', e)}
                                style={{ display: 'none' }}
                              />
                            </label>
                            <input
                              type="text"
                              value={pageImages.noticeHero || '/hero-image.jpg'}
                              onChange={(e) => handleImageChange('noticeHero', e.target.value)}
                              placeholder="/hero-image.jpg or https://..."
                              className="admin-image-url-input"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Career Page Hero */}
                      <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                        <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                          {language === 'en' ? 'Career Page Hero' : 'ক্যারিয়ার পেজ হিরো'}
                        </label>
                        <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                            <img src={pageImages.careerHero || '/hero-image.jpg'} alt="Career hero" />
                          </div>
                          <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                              {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange('careerHero', e)}
                                style={{ display: 'none' }}
                              />
                            </label>
                            <input
                              type="text"
                              value={pageImages.careerHero || '/hero-image.jpg'}
                              onChange={(e) => handleImageChange('careerHero', e.target.value)}
                              placeholder="/hero-image.jpg or https://..."
                              className="admin-image-url-input"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Blog Page Hero */}
                      <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                        <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                          {language === 'en' ? 'Blog Page Hero' : 'ব্লগ পেজ হিরো'}
                        </label>
                        <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                            <img src={pageImages.blogHero || '/hero-image.jpg'} alt="Blog hero" />
                          </div>
                          <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                              {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange('blogHero', e)}
                                style={{ display: 'none' }}
                              />
                            </label>
                            <input
                              type="text"
                              value={pageImages.blogHero || '/hero-image.jpg'}
                              onChange={(e) => handleImageChange('blogHero', e.target.value)}
                              placeholder="/hero-image.jpg or https://..."
                              className="admin-image-url-input"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About Section Images */}
                  <div className="admin-hero-images-grid" style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }}>
                        {/* About Section Image 1 (Oval Top) */}
                        <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                          <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                            {language === 'en' ? 'About Section Image 1 (Oval Top)' : 'আমাদের সম্পর্কে ছবি ১ (ওভাল উপরে)'}
                          </label>
                          <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                              <img src={pageImages.aboutSectionImage1 || '/hero-image.jpg'} alt="About section 1" />
                            </div>
                            <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFileChange('aboutSectionImage1', e)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                              <input
                                type="text"
                                value={pageImages.aboutSectionImage1 || '/hero-image.jpg'}
                                onChange={(e) => handleImageChange('aboutSectionImage1', e.target.value)}
                                placeholder="/hero-image.jpg or https://..."
                                className="admin-image-url-input"
                              />
                            </div>
                          </div>
                        </div>

                        {/* About Section Image 2 (Oval Bottom) */}
                        <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                          <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                            {language === 'en' ? 'About Section Image 2 (Oval Bottom)' : 'আমাদের সম্পর্কে ছবি ২ (ওভাল নিচে)'}
                          </label>
                          <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                              <img src={pageImages.aboutSectionImage2 || '/hero-image.jpg'} alt="About section 2" />
                            </div>
                            <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFileChange('aboutSectionImage2', e)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                              <input
                                type="text"
                                value={pageImages.aboutSectionImage2 || '/hero-image.jpg'}
                                onChange={(e) => handleImageChange('aboutSectionImage2', e.target.value)}
                                placeholder="/hero-image.jpg or https://..."
                                className="admin-image-url-input"
                              />
                            </div>
                          </div>
                        </div>

                        {/* About Section Image 3 (Circular) */}
                        <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                          <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                            {language === 'en' ? 'About Section Image 3 (Circular)' : 'আমাদের সম্পর্কে ছবি ৩ (বৃত্তাকার)'}
                          </label>
                          <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                              <img src={pageImages.aboutSectionImage3 || '/hero-image.jpg'} alt="About section 3" />
                            </div>
                            <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFileChange('aboutSectionImage3', e)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                              <input
                                type="text"
                                value={pageImages.aboutSectionImage3 || '/hero-image.jpg'}
                                onChange={(e) => handleImageChange('aboutSectionImage3', e.target.value)}
                                placeholder="/hero-image.jpg or https://..."
                                className="admin-image-url-input"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Vision Image */}
                        <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                          <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                            {language === 'en' ? 'Vision Image' : 'ভিশন ছবি'}
                          </label>
                          <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                              <img src={pageImages.visionImage || '/hero-image.jpg'} alt="Vision" />
                            </div>
                            <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFileChange('visionImage', e)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                              <input
                                type="text"
                                value={pageImages.visionImage || '/hero-image.jpg'}
                                onChange={(e) => handleImageChange('visionImage', e.target.value)}
                                placeholder="/hero-image.jpg or https://..."
                                className="admin-image-url-input"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Mission Image */}
                        <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                          <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                            {language === 'en' ? 'Mission Image' : 'মিশন ছবি'}
                          </label>
                          <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                              <img src={pageImages.missionImage || '/hero-image.jpg'} alt="Mission" />
                            </div>
                            <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFileChange('missionImage', e)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                              <input
                                type="text"
                                value={pageImages.missionImage || '/hero-image.jpg'}
                                onChange={(e) => handleImageChange('missionImage', e.target.value)}
                                placeholder="/hero-image.jpg or https://..."
                                className="admin-image-url-input"
                              />
                            </div>
                          </div>
                        </div>

                        {/* About Values Background */}
                        <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                          <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                            {language === 'en' ? 'What We Value Section Background (About Page)' : 'আমরা যা মূল্য দিই সেকশন ব্যাকগ্রাউন্ড (আমাদের সম্পর্কে পেজ)'}
                          </label>
                          <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                              <img src={pageImages.aboutValuesBackground || 'https://images.stockcake.com/public/e/6/e/e6e4865c-08b7-4633-b428-f5658462485e_large/farmers-tending-crops-stockcake.jpg'} alt="About values background" />
                            </div>
                            <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFileChange('aboutValuesBackground', e)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                              <input
                                type="text"
                                value={pageImages.aboutValuesBackground || 'https://images.stockcake.com/public/e/6/e/e6e4865c-08b7-4633-b428-f5658462485e_large/farmers-tending-crops-stockcake.jpg'}
                                onChange={(e) => handleImageChange('aboutValuesBackground', e.target.value)}
                                placeholder="Image URL or https://..."
                                className="admin-image-url-input"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Career Values Background */}
                        <div className="admin-photo-card" style={{ marginBottom: 0 }}>
                          <label style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                            {language === 'en' ? 'Why Build Your Career With Us Section Background (Career Page)' : 'কেন আমাদের দলে যোগ দেবেন সেকশন ব্যাকগ্রাউন্ড (ক্যারিয়ার পেজ)'}
                          </label>
                          <div className="admin-image-upload" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div className="admin-image-preview" style={{ marginBottom: '0.75rem' }}>
                              <img src={pageImages.careerValuesBackground || 'https://images.stockcake.com/public/e/6/e/e6e4865c-08b7-4633-b428-f5658462485e_large/farmers-tending-crops-stockcake.jpg'} alt="Career values background" />
                            </div>
                            <div className="admin-image-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <label className="admin-upload-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                {language === 'en' ? 'Upload Image' : 'ইমেজ আপলোড করুন'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFileChange('careerValuesBackground', e)}
                                  style={{ display: 'none' }}
                                />
                              </label>
                              <input
                                type="text"
                                value={pageImages.careerValuesBackground || 'https://images.stockcake.com/public/e/6/e/e6e4865c-08b7-4633-b428-f5658462485e_large/farmers-tending-crops-stockcake.jpg'}
                                onChange={(e) => handleImageChange('careerValuesBackground', e.target.value)}
                                placeholder="Image URL or https://..."
                                className="admin-image-url-input"
                              />
                            </div>
                          </div>
                        </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.profile}</h1>
              </div>
              <div className="admin-settings-section">
                <div className="admin-settings-card" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 180, height: 180, margin: '0 auto 1rem', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e5e7eb', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {profileData.photo ? (
                        <img src={profileData.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ fontSize: '2.5rem', color: '#64748b', fontWeight: 700 }}>
                          {(profileData.name || 'A').charAt(0)}
                        </div>
                      )}
                    </div>
                    <label className="admin-upload-btn" style={{ justifyContent: 'center', width: '100%' }}>
                      {language === 'en' ? 'Upload Photo' : 'ছবি আপলোড করুন'}
                      <input type="file" accept="image/*" onChange={handleProfilePhotoFileChange} style={{ display: 'none' }} />
                    </label>
                    <button
                      className="admin-save-btn"
                      style={{ width: '100%', marginTop: '0.75rem', backgroundColor: showChangePassword ? '#6b7280' : undefined }}
                      onClick={() => {
                        setShowChangePassword((prev) => !prev)
                        if (showChangePassword) {
                          setPasswordForm({ current: '', next: '', confirm: '', status: '' })
                        }
                      }}
                    >
                      {showChangePassword
                        ? (language === 'en' ? 'Close' : 'বন্ধ করুন')
                        : (language === 'en' ? 'Change Password' : 'পাসওয়ার্ড পরিবর্তন করুন')}
                    </button>
                  </div>
                  <div>
                    <h3 style={{ marginTop: 0 }}>{language === 'en' ? 'User Profile' : 'ব্যবহারকারী প্রোফাইল'}</h3>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Name' : 'নাম'}</label>
                      <input type="text" value={profileData.name} onChange={(e) => handleProfileFieldChange('name', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Email' : 'ইমেইল'}</label>
                      <input type="email" value={profileData.email} onChange={(e) => handleProfileFieldChange('email', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Phone' : 'ফোন'}</label>
                      <input type="tel" value={profileData.phone} onChange={(e) => handleProfileFieldChange('phone', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label>{adminContent.address}</label>
                      <textarea value={profileData.address || ''} onChange={(e) => handleProfileFieldChange('address', e.target.value)} rows={3} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Role' : 'ভূমিকা'}</label>
                      <input 
                        type="text" 
                        value={userRole || (language === 'en' ? 'Administrator' : 'অ্যাডমিনিস্ট্রেটর')} 
                        readOnly 
                        style={{ 
                          backgroundColor: userRole === 'Admin' ? '#dcfce7' : '#fef3c7',
                          color: userRole === 'Admin' ? '#166534' : '#92400e',
                          fontWeight: 600
                        }}
                      />
                    </div>
                    {isEmployee && profileData.designation && (
                      <div className="admin-form-group">
                        <label>{language === 'en' ? 'Designation' : 'পদবি'}</label>
                        <input type="text" value={profileData.designation} readOnly />
                      </div>
                    )}
                    {isEmployee && profileData.department && (
                      <div className="admin-form-group">
                        <label>{language === 'en' ? 'Department' : 'বিভাগ'}</label>
                        <input type="text" value={profileData.department} readOnly />
                      </div>
                    )}
                    {profileStatus && (
                      <div style={{ marginBottom: '0.5rem', color: profileStatus.includes('fail') || profileStatus.includes('ব্যর্থ') ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                        {profileStatus}
                      </div>
                    )}
                    <button className="admin-save-btn" onClick={handleSaveProfile}>{adminContent.save}</button>
                  </div>
                </div>

                {showChangePassword && (
                  <div className="admin-settings-card" style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ marginTop: 0 }}>{adminContent.changePassword}</h3>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', marginTop: '1rem', background: '#f9fafb' }}>
                      <div className="admin-form-group">
                        <label>{adminContent.currentPassword}</label>
                        <input
                          type="password"
                          value={passwordForm.current}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>{adminContent.newPassword}</label>
                        <input
                          type="password"
                          value={passwordForm.next}
                          onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>{adminContent.confirmPassword}</label>
                        <input
                          type="password"
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        />
                      </div>
                      {passwordForm.status && (
                        <div style={{ marginBottom: '0.5rem', color: passwordForm.status.toLowerCase().includes('incorrect') ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                          {passwordForm.status}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="admin-save-btn" onClick={handleChangePassword}>{adminContent.updatePassword}</button>
                        <button
                          className="admin-remove-btn"
                          onClick={() => {
                            setShowChangePassword(false)
                            setPasswordForm({ current: '', next: '', confirm: '', status: '' })
                          }}
                        >
                          {language === 'en' ? 'Cancel' : 'বাতিল'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CRM Tab */}
          {activeTab === 'crm' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.crm}</h1>
                <button className="admin-add-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {adminContent.addNew}
                </button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{language === 'en' ? 'Customer Name' : 'গ্রাহকের নাম'}</th>
                      <th>{language === 'en' ? 'Email' : 'ইমেইল'}</th>
                      <th>{language === 'en' ? 'Phone' : 'ফোন'}</th>
                      <th>{language === 'en' ? 'Status' : 'স্ট্যাটাস'}</th>
                      <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                        {adminContent.noData}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HR Tab */}
          {activeTab === 'hr' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.hr}</h1>
                <button className="admin-add-btn" onClick={() => setShowEmployeeForm(true)}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {adminContent.addNew}
                </button>
              </div>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Total Employees' : 'মোট কর্মচারী'}</h3>
                  <p>{employees.length}</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Departments' : 'বিভাগ'}</h3>
                    <p>0</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Leave Requests' : 'ছুটির অনুরোধ'}</h3>
                    <p>0</p>
                  </div>
                </div>
              </div>

            {showEmployeeForm && (
              <div className="admin-settings-section" style={{ marginTop: '1.5rem' }}>
                <div className="admin-settings-card">
                  <h3 style={{ marginTop: 0 }}>{language === 'en' ? 'Add Employee' : 'কর্মচারী যোগ করুন'}</h3>
                  {employeeStatus && (
                    <div style={{ marginBottom: '0.5rem', color: employeeStatus.includes('fail') || employeeStatus.includes('ব্যর্থ') ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                      {employeeStatus}
                    </div>
                  )}
                  {generatedCredentials && (
                    <div style={{ 
                      marginBottom: '1rem', 
                      padding: '1rem', 
                      backgroundColor: '#f0f9ff', 
                      border: '2px solid #0ea5e9', 
                      borderRadius: '0.5rem',
                      borderStyle: 'dashed'
                    }}>
                      <h4 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#0369a1' }}>
                        {language === 'en' ? 'Generated Login Credentials' : 'তৈরি করা লগইন পরিচয়পত্র'}
                      </h4>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#0c4a6e' }}>
                        <strong>{language === 'en' ? 'Username:' : 'ব্যবহারকারীর নাম:'}</strong> {generatedCredentials.username}
                      </p>
                      <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#0c4a6e' }}>
                        <strong>{language === 'en' ? 'Password:' : 'পাসওয়ার্ড:'}</strong> <span style={{ fontFamily: 'monospace', backgroundColor: '#fff', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>{generatedCredentials.password}</span>
                      </p>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>
                        {language === 'en' ? '⚠️ Please save these credentials and share with the employee. This password will not be shown again.' : '⚠️ অনুগ্রহ করে এই পরিচয়পত্রগুলি সংরক্ষণ করুন এবং কর্মচারীর সাথে শেয়ার করুন। এই পাসওয়ার্ড আর দেখানো হবে না।'}
                      </p>
                      <button 
                        onClick={() => {
                          setGeneratedCredentials(null)
                          setShowEmployeeForm(false)
                          setEmployeeStatus('')
                        }}
                        style={{
                          marginTop: '0.75rem',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#0ea5e9',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {language === 'en' ? 'Close' : 'বন্ধ করুন'}
                      </button>
                    </div>
                  )}
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Name' : 'নাম'}</label>
                      <input type="text" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Email' : 'ইমেইল'}</label>
                      <input type="email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Phone' : 'ফোন'}</label>
                      <input type="tel" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Address' : 'ঠিকানা'}</label>
                      <textarea value={newEmployee.address} onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })} rows={3} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'NID (National ID)' : 'জাতীয় পরিচয়পত্র'}</label>
                      <input type="text" value={newEmployee.nid} onChange={(e) => setNewEmployee({ ...newEmployee, nid: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Document' : 'নথি'}</label>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setNewEmployee({ ...newEmployee, document: reader.result })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                      />
                      {newEmployee.document && (
                        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#16a34a' }}>
                          {language === 'en' ? '✓ Document uploaded' : '✓ নথি আপলোড হয়েছে'}
                        </p>
                      )}
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Emergency Contact Name' : 'জরুরি যোগাযোগের নাম'}</label>
                      <input type="text" value={newEmployee.emergencyContactName} onChange={(e) => setNewEmployee({ ...newEmployee, emergencyContactName: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Emergency Contact' : 'জরুরি যোগাযোগ'}</label>
                      <input type="text" value={newEmployee.emergencyContact} onChange={(e) => setNewEmployee({ ...newEmployee, emergencyContact: e.target.value })} placeholder={language === 'en' ? 'Phone or Email' : 'ফোন বা ইমেইল'} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Salary' : 'বেতন'}</label>
                      <input type="number" value={newEmployee.salary} onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })} step="0.01" min="0" />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Sales Target' : 'বিক্রয় লক্ষ্য'}</label>
                      <input type="number" value={newEmployee.salesTarget} onChange={(e) => setNewEmployee({ ...newEmployee, salesTarget: e.target.value })} step="0.01" min="0" />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Bank Name' : 'ব্যাংকের নাম'}</label>
                      <input type="text" value={newEmployee.bankName} onChange={(e) => setNewEmployee({ ...newEmployee, bankName: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Branch' : 'শাখা'}</label>
                      <input type="text" value={newEmployee.bankBranch} onChange={(e) => setNewEmployee({ ...newEmployee, bankBranch: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Account No.' : 'একাউন্ট নং'}</label>
                      <input type="text" value={newEmployee.accountNumber} onChange={(e) => setNewEmployee({ ...newEmployee, accountNumber: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Department' : 'বিভাগ'}</label>
                      <input type="text" value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Role' : 'ভূমিকা'}</label>
                      <select 
                        value={newEmployee.role} 
                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                      >
                        <option value="">{language === 'en' ? 'Select Role' : 'ভূমিকা নির্বাচন করুন'}</option>
                        <option value="Admin">Admin</option>
                        <option value="RSM">RSM</option>
                        <option value="Incharge">Incharge</option>
                        <option value="SalesMan">SalesMan</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Designation' : 'পদবি'}</label>
                      <input type="text" value={newEmployee.designation} onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Upload Photo' : 'ছবি আপলোড করুন'}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          try {
                            const base64 = await fileToBase64(file)
                            setNewEmployee({ ...newEmployee, photo: base64 })
                          } catch (err) {
                            console.error('Photo upload failed', err)
                          }
                        }}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                      />
                      {newEmployee.photo && (
                        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#16a34a' }}>
                          {language === 'en' ? '✓ Photo ready' : '✓ ছবি প্রস্তুত'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button className="admin-save-btn" onClick={async () => {
                      try {
                        setEmployeeStatus(language === 'en' ? 'Saving...' : 'সংরক্ষণ করা হচ্ছে...')
                        setGeneratedCredentials(null)
                        
                        // Prepare employee data - ensure all fields are included
                        const employeeData = {
                          name: newEmployee.name || '',
                          email: newEmployee.email || '',
                          phone: newEmployee.phone || '',
                          address: newEmployee.address || '',
                          nid: newEmployee.nid || '',
                          document: newEmployee.document || '',
                          emergencyContactName: newEmployee.emergencyContactName || '',
                          emergencyContact: newEmployee.emergencyContact || '',
                          salary: newEmployee.salary || 0,
                          salesTarget: newEmployee.salesTarget || 0,
                          bankName: newEmployee.bankName || '',
                          bankBranch: newEmployee.bankBranch || '',
                          accountNumber: newEmployee.accountNumber || '',
                          department: newEmployee.department || '',
                          role: newEmployee.role || '',
                          designation: newEmployee.designation || '',
                          photo: newEmployee.photo || '',
                          status: newEmployee.status || 'Unpaid'
                        }
                        
                        console.log('[Frontend] Sending employee data:', { ...employeeData, document: employeeData.document ? 'Base64 data (hidden)' : 'No document' })
                        
                        const res = await fetch(`${API_BASE}/api/employees`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(employeeData)
                        })
                        if (!res.ok) {
                          const errorData = await res.json().catch(() => ({}))
                          console.error('[Frontend] Employee creation failed:', errorData)
                          throw new Error(errorData.message || errorData.error || 'Failed to create employee')
                        }
                        const data = await res.json()
                        console.log('[Frontend] Employee created successfully:', {
                          employeeId: data.data?.employeeId,
                          name: data.data?.name,
                          hasAddress: !!data.data?.address,
                          hasNID: !!data.data?.nid,
                          hasDocument: !!data.data?.document,
                          salary: data.data?.salary
                        })
                        setEmployees([
                          { ...data.data, status: normalizeSalaryStatus(data.data.status) },
                          ...employees.map((e) => ({ ...e, status: normalizeSalaryStatus(e.status) }))
                        ])
                        
                        // Show generated credentials
                        if (data.data.generatedPassword) {
                          setGeneratedCredentials({
                            username: data.data.username,
                            password: data.data.generatedPassword
                          })
                          setEmployeeStatus(language === 'en' ? 'Employee created! Credentials generated below.' : 'কর্মচারী তৈরি হয়েছে! নিচে পরিচয়পত্র দেখুন।')
                        } else {
                          setEmployeeStatus(language === 'en' ? 'Saved to database' : 'ডাটাবেজে সংরক্ষিত')
                        }
                        
                        setNewEmployee({ name: '', email: '', phone: '', address: '', nid: '', document: '', emergencyContactName: '', emergencyContact: '', salary: '', salesTarget: '', bankName: '', bankBranch: '', accountNumber: '', department: '', role: '', designation: '', photo: '', status: 'Unpaid' })
                        // Don't close form if credentials are shown
                        if (!data.data.generatedPassword) {
                          setShowEmployeeForm(false)
                        }
                      } catch (err) {
                        setEmployeeStatus(language === 'en' ? `Save failed: ${err.message}` : `সংরক্ষণ ব্যর্থ: ${err.message}`)
                      }
                    }}>
                      {language === 'en' ? 'Save' : 'সংরক্ষণ'}
                    </button>
                    <button className="admin-remove-btn" onClick={() => { 
                      setShowEmployeeForm(false); 
                      setEmployeeStatus(''); 
                      setGeneratedCredentials(null);
                    }}>
                      {language === 'en' ? 'Cancel' : 'বাতিল'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="admin-stats-grid" style={{ marginTop: '1rem' }}>
              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12l4 4 12-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="admin-stat-info">
                  <h3>{language === 'en' ? 'Sales Target' : 'বিক্রয় লক্ষ্য'}</h3>
                  <p>
                    {employees.length === 0
                      ? '৳ 0'
                      : `৳ ${employees.reduce((sum, e) => sum + (parseFloat(e.salesTarget) || 0), 0).toLocaleString()}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="admin-table-container" style={{ marginTop: '1.5rem' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{language === 'en' ? 'ID' : 'আইডি'}</th>
                    <th>{language === 'en' ? 'Name' : 'নাম'}</th>
                    <th>{language === 'en' ? 'Phone' : 'ফোন'}</th>
                    <th>{language === 'en' ? 'Designation' : 'পদবি'}</th>
                    <th>{language === 'en' ? 'Salary' : 'বেতন'}</th>
                    <th>{language === 'en' ? 'Sales Target' : 'বিক্রয় লক্ষ্য'}</th>
                    <th>{language === 'en' ? 'Salary Status' : 'বেতন স্থিতি'}</th>
                    <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        {adminContent.noData}
                      </td>
                    </tr>
                  ) : (
                    employees.map((emp, idx) => (
                      <tr key={emp._id || idx}>
                        <td>{emp.employeeId || 'N/A'}</td>
                        <td>{emp.name || 'N/A'}</td>
                        <td>{emp.phone || 'N/A'}</td>
                        <td>{emp.designation || 'N/A'}</td>
                      <td>
                        {emp.salary ? `${language === 'en' ? '৳' : '৳'} ${parseFloat(emp.salary).toLocaleString()}` : 'N/A'}
                      </td>
                      <td>
                        {emp.salesTarget ? `${language === 'en' ? '৳' : '৳'} ${parseFloat(emp.salesTarget).toLocaleString()}` : 'N/A'}
                      </td>
                      <td>{normalizeSalaryStatus(emp.status)}</td>
                        <td>
                          <button 
                            className="admin-action-btn" 
                            style={{ backgroundColor: '#3b82f6', color: 'white' }}
                            onClick={async () => {
                              // Fetch latest employee data to ensure password is up to date
                              try {
                                const res = await fetch(`${API_BASE}/api/employees/${emp._id}`)
                                if (res.ok) {
                                  const data = await res.json()
                                  console.log('[View Employee] Fetched employee data:', {
                                    _id: data.data._id,
                                    name: data.data.name,
                                    username: data.data.username,
                                    hasPlainPassword: false,
                                    plainPassword: 'hidden'
                                  })
                          setViewingEmployee({ ...data.data, status: normalizeSalaryStatus(data.data.status) })
                          setLastGeneratedPassword(data.data.generatedPassword || '')
                                } else {
                                  // Fallback to existing data if fetch fails
                                  console.log('[View Employee] Using cached employee data:', emp)
                          setViewingEmployee({ ...emp, status: normalizeSalaryStatus(emp.status) })
                          setLastGeneratedPassword(emp.generatedPassword || '')
                                }
                              } catch (err) {
                                console.error('Failed to fetch employee details', err)
                                // Fallback to existing data if fetch fails
                        setViewingEmployee({ ...emp, status: normalizeSalaryStatus(emp.status) })
                        setLastGeneratedPassword(emp.generatedPassword || '')
                              }
                            }}
                          >
                            {adminContent.view}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Employee Details Modal */}
            {viewingEmployee && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem'
              }} onClick={() => {
                setViewingEmployee(null)
                setIsEditingEmployee(false)
                setEditingEmployeeData(null)
                setLastGeneratedPassword('')
              }}>
                <div style={{
                  position: 'relative',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
                  borderRadius: '0.75rem',
                  padding: '2rem',
                  maxWidth: '900px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                }} onClick={(e) => e.stopPropagation()}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    borderRadius: '0.75rem'
                  }}>
                    <div style={{
                      position: 'absolute',
                      width: '260px',
                      height: '260px',
                      top: '-120px',
                      left: '-80px',
                      background: 'radial-gradient(circle at 30% 30%, rgba(59,130,246,0.25), transparent 60%)',
                      filter: 'blur(20px)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      width: '240px',
                      height: '240px',
                      bottom: '-140px',
                      right: '-100px',
                      background: 'radial-gradient(circle at 70% 70%, rgba(16,185,129,0.22), transparent 60%)',
                      filter: 'blur(20px)'
                    }} />
                  </div>

                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid rgba(255,255,255,0.9)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                        background: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        color: '#111827'
                      }}>
                        {viewingEmployee.photo ? (
                          <img src={viewingEmployee.photo} alt={viewingEmployee.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          (viewingEmployee.name || 'E').charAt(0)
                        )}
                      </div>
                      <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                          {language === 'en' ? (isEditingEmployee ? 'Edit Employee' : 'Employee Details') : (isEditingEmployee ? 'কর্মচারী সম্পাদনা' : 'কর্মচারীর বিবরণ')}
                        </h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 600 }}>{viewingEmployee.designation || viewingEmployee.role || ''}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {!isEditingEmployee ? (
                        <button
                          onClick={() => {
                            setIsEditingEmployee(true)
                            setEditingEmployeeData({ ...viewingEmployee, status: normalizeSalaryStatus(viewingEmployee.status) })
                          }}
                          style={{
                            padding: '0.6rem 1.1rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            boxShadow: '0 10px 20px rgba(59,130,246,0.35)'
                          }}
                        >
                          {adminContent.edit}
                        </button>
                      ) : null}
                      <button
                        onClick={() => {
                          setViewingEmployee(null)
                          setIsEditingEmployee(false)
                          setEditingEmployeeData(null)
                        }}
                        style={{
                          background: '#e2e8f0',
                          border: 'none',
                          padding: '0.4rem 0.65rem',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontWeight: 700,
                          color: '#475569'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', position: 'relative', zIndex: 1 }}>
                    {/* Employee ID */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Employee ID' : 'কর্মচারী আইডি'}
                      </label>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                        {(isEditingEmployee ? editingEmployeeData : viewingEmployee).employeeId || 'N/A'}
                      </p>
                    </div>

                    {/* Name */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Name' : 'নাম'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="text"
                          value={editingEmployeeData?.name || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, name: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingEmployee.name || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Email' : 'ইমেইল'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="email"
                          value={editingEmployeeData?.email || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, email: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingEmployee.email || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Phone' : 'ফোন'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="text"
                          value={editingEmployeeData?.phone || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, phone: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingEmployee.phone || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem', gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Address' : 'ঠিকানা'}
                      </label>
                      {isEditingEmployee ? (
                        <textarea
                          value={editingEmployeeData?.address || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, address: e.target.value })}
                          rows={3}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827', whiteSpace: 'pre-wrap' }}>
                          {viewingEmployee.address || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* NID */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'NID (National ID)' : 'জাতীয় পরিচয়পত্র'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="text"
                          value={editingEmployeeData?.nid || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, nid: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingEmployee.nid || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Salary */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Salary' : 'বেতন'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="number"
                          value={editingEmployeeData?.salary || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, salary: e.target.value })}
                          step="0.01"
                          min="0"
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827', fontWeight: 600 }}>
                          {viewingEmployee.salary ? `${language === 'en' ? '৳' : '৳'} ${parseFloat(viewingEmployee.salary).toLocaleString()}` : 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Sales Target */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Sales Target' : 'বিক্রয় লক্ষ্য'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="number"
                          value={editingEmployeeData?.salesTarget || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, salesTarget: e.target.value })}
                          step="0.01"
                          min="0"
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827', fontWeight: 600 }}>
                          {viewingEmployee.salesTarget ? `${language === 'en' ? '৳' : '৳'} ${parseFloat(viewingEmployee.salesTarget).toLocaleString()}` : 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Bank Name */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Bank Name' : 'ব্যাংকের নাম'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="text"
                          value={editingEmployeeData?.bankName || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, bankName: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingEmployee.bankName || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Bank Branch */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Branch' : 'শাখা'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="text"
                          value={editingEmployeeData?.bankBranch || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, bankBranch: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingEmployee.bankBranch || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Account Number */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Account No.' : 'একাউন্ট নং'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="text"
                          value={editingEmployeeData?.accountNumber || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, accountNumber: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingEmployee.accountNumber || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Salary Status */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Salary Status' : 'বেতন স্থিতি'}
                      </label>
                      {isEditingEmployee ? (
                        <select
                          value={normalizeSalaryStatus(editingEmployeeData?.status)}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, status: normalizeSalaryStatus(e.target.value) })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        >
                          <option value="Paid">{language === 'en' ? 'Paid' : 'পরিশোধিত'}</option>
                          <option value="Unpaid">{language === 'en' ? 'Unpaid' : 'অপরিশোধিত'}</option>
                        </select>
                      ) : (
                        <p style={{ 
                          margin: '0.5rem 0 0 0', 
                          fontSize: '1rem', 
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          backgroundColor: normalizeSalaryStatus(viewingEmployee.status) === 'Paid' ? '#dcfce7' : '#fee2e2',
                          color: normalizeSalaryStatus(viewingEmployee.status) === 'Paid' ? '#166534' : '#991b1b',
                          fontWeight: 600
                        }}>
                          {normalizeSalaryStatus(viewingEmployee.status)}
                        </p>
                      )}
                    </div>

                    {/* Department */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Department' : 'বিভাগ'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="text"
                          value={editingEmployeeData?.department || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, department: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingEmployee.department || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Role */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Role' : 'ভূমিকা'}
                      </label>
                      {isEditingEmployee ? (
                        <select
                          value={editingEmployeeData?.role || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, role: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        >
                          <option value="">{language === 'en' ? 'Select Role' : 'ভূমিকা নির্বাচন করুন'}</option>
                          <option value="Admin">Admin</option>
                          <option value="RSM">RSM</option>
                          <option value="Incharge">Incharge</option>
                          <option value="SalesMan">SalesMan</option>
                        </select>
                      ) : (
                        <p style={{ 
                          margin: '0.5rem 0 0 0', 
                          fontSize: '1rem', 
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          backgroundColor: viewingEmployee.role === 'Admin' ? '#dcfce7' : '#fef3c7',
                          color: viewingEmployee.role === 'Admin' ? '#166534' : '#92400e',
                          fontWeight: 600
                        }}>
                          {viewingEmployee.role || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Designation */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Designation' : 'পদবি'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="text"
                          value={editingEmployeeData?.designation || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, designation: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingEmployee.designation || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Username */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Username' : 'ব্যবহারকারীর নাম'}
                      </label>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827', fontFamily: 'monospace' }}>
                        {viewingEmployee.username || 'N/A'}
                      </p>
                    </div>

                    {/* Password */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Password' : 'পাসওয়ার্ড'}
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '1rem', 
                          color: '#111827', 
                          fontFamily: 'monospace',
                          backgroundColor: '#fee2e2',
                          padding: '0.5rem',
                          borderRadius: '0.25rem',
                          border: '1px solid #fecaca',
                          fontWeight: 600,
                          flex: 1
                        }}>
                          {lastGeneratedPassword || (language === 'en' ? 'Hidden' : 'লুকানো')}
                        </p>
                        <button
                          onClick={async () => {
                            if (window.confirm(language === 'en' ? 'Reset password for this employee? A new password will be generated.' : 'এই কর্মচারীর পাসওয়ার্ড রিসেট করবেন? একটি নতুন পাসওয়ার্ড তৈরি করা হবে।')) {
                              try {
                                const res = await fetch(`${API_BASE}/api/employees/reset-password`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: viewingEmployee._id })
                                })
                                if (!res.ok) throw new Error('Failed to reset password')
                                const data = await res.json()
                                
                                // Store newly generated password locally for display
                                setLastGeneratedPassword(data.newPassword)
                                
                                // Refresh employee list
                                const resEmployees = await fetch(`${API_BASE}/api/employees`)
                                if (resEmployees.ok) {
                                  const empData = await resEmployees.json()
                                  setEmployees((empData.data || []).map((e) => ({
                                    ...e,
                                    status: normalizeSalaryStatus(e.status)
                                  })))
                                }
                                
                                alert(language === 'en' 
                                  ? `Password reset successfully! New password: ${data.newPassword}` 
                                  : `পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে! নতুন পাসওয়ার্ড: ${data.newPassword}`)
                              } catch (err) {
                                alert(language === 'en' ? 'Failed to reset password' : 'পাসওয়ার্ড রিসেট করতে ব্যর্থ')
                              }
                            }
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {language === 'en' ? 'Reset Password' : 'পাসওয়ার্ড রিসেট'}
                        </button>
                      </div>
                    </div>

                    {/* Emergency Contact Name */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Emergency Contact Name' : 'জরুরি যোগাযোগের নাম'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="text"
                          value={editingEmployeeData?.emergencyContactName || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, emergencyContactName: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingEmployee.emergencyContactName || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Emergency Contact' : 'জরুরি যোগাযোগ'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="text"
                          value={editingEmployeeData?.emergencyContact || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, emergencyContact: e.target.value })}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingEmployee.emergencyContact || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Document */}
                    {viewingEmployee.document && (
                      <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem', gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                          {language === 'en' ? 'Document' : 'নথি'}
                        </label>
                        <div style={{ marginTop: '0.5rem' }}>
                          {viewingEmployee.document.startsWith('data:') ? (
                            <a 
                              href={viewingEmployee.document} 
                              download={`${viewingEmployee.name}_document`}
                              style={{
                                display: 'inline-block',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                fontWeight: 600
                              }}
                            >
                              {language === 'en' ? 'Download Document' : 'নথি ডাউনলোড করুন'}
                            </a>
                          ) : (
                            <p style={{ margin: 0, fontSize: '1rem', color: '#111827' }}>
                              {viewingEmployee.document}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Photo */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem', gridColumn: 'span 2', textAlign: 'center' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                        {language === 'en' ? 'Photo' : 'ছবি'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            try {
                              const base64 = await fileToBase64(file)
                              setEditingEmployeeData({ ...editingEmployeeData, photo: base64 })
                            } catch (err) {
                              console.error('Photo upload failed', err)
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            marginTop: '0.25rem'
                          }}
                        />
                      ) : null}
                      {(isEditingEmployee ? editingEmployeeData?.photo : viewingEmployee.photo) && (
                        <img 
                          src={isEditingEmployee ? editingEmployeeData?.photo : viewingEmployee.photo} 
                          alt={viewingEmployee.name}
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            borderRadius: '0.5rem',
                            border: '2px solid #e5e7eb',
                            marginTop: '0.5rem'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {isEditingEmployee ? (
                      <>
                        <button
                          onClick={() => {
                            setIsEditingEmployee(false)
                            setEditingEmployeeData(null)
                          }}
                          disabled={savingEmployee}
                          style={{
                            padding: '0.5rem 1.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: savingEmployee ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            opacity: savingEmployee ? 0.6 : 1
                          }}
                        >
                          {adminContent.cancel}
                        </button>
                        <button
                          onClick={handleSaveEmployeeEdit}
                          disabled={savingEmployee}
                          style={{
                            padding: '0.5rem 1.5rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: savingEmployee ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            opacity: savingEmployee ? 0.6 : 1
                          }}
                        >
                          {savingEmployee ? (language === 'en' ? 'Saving...' : 'সংরক্ষণ করা হচ্ছে...') : adminContent.save}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={async () => {
                            if (!viewingEmployee?._id) return
                            if (window.confirm(language === 'en' ? 'Are you sure you want to delete this employee?' : 'আপনি কি নিশ্চিত যে আপনি এই কর্মচারীটি মুছতে চান?')) {
                              try {
                                const res = await fetch(`${API_BASE}/api/employees/${viewingEmployee._id}`, {
                                  method: 'DELETE'
                                })
                                if (!res.ok) throw new Error('Failed to delete')
                                setEmployees(employees.filter(e => e._id !== viewingEmployee._id))
                                setViewingEmployee(null)
                                setIsEditingEmployee(false)
                                setEditingEmployeeData(null)
                              } catch (err) {
                                alert(language === 'en' ? 'Failed to delete employee' : 'কর্মচারী মুছে ফেলতে ব্যর্থ')
                              }
                            }
                          }}
                          style={{
                            padding: '0.5rem 1.5rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          {adminContent.delete}
                        </button>
                        <button
                          onClick={() => {
                            setViewingEmployee(null)
                            setIsEditingEmployee(false)
                            setEditingEmployeeData(null)
                            setLastGeneratedPassword('')
                          }}
                          style={{
                            padding: '0.5rem 1.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          {language === 'en' ? 'Close' : 'বন্ধ করুন'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.orders}</h1>
                <button className="admin-add-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {adminContent.addNew}
                </button>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{language === 'en' ? 'Order ID' : 'অর্ডার আইডি'}</th>
                      <th>{language === 'en' ? 'Customer' : 'গ্রাহক'}</th>
                      <th>{language === 'en' ? 'Product' : 'পণ্য'}</th>
                      <th>{language === 'en' ? 'Quantity' : 'পরিমাণ'}</th>
                      <th>{language === 'en' ? 'Status' : 'স্ট্যাটাস'}</th>
                      <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                        {adminContent.noData}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.inventory}</h1>
                <button className="admin-add-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {adminContent.addNew}
                </button>
              </div>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Total Items' : 'মোট আইটেম'}</h3>
                    <p>0</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Low Stock' : 'কম স্টক'}</h3>
                    <p>0</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Total Value' : 'মোট মূল্য'}</h3>
                    <p>৳0</p>
                  </div>
                </div>
              </div>
              <div className="admin-table-container" style={{ marginTop: '2rem' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{language === 'en' ? 'Product Name' : 'পণ্যের নাম'}</th>
                      <th>{language === 'en' ? 'SKU' : 'এসকেইউ'}</th>
                      <th>{language === 'en' ? 'Quantity' : 'পরিমাণ'}</th>
                      <th>{language === 'en' ? 'Unit Price' : 'ইউনিট মূল্য'}</th>
                      <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                        {adminContent.noData}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.revenue}</h1>
              </div>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Total Revenue' : 'মোট রাজস্ব'}</h3>
                    <p>৳0</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'This Month' : 'এই মাস'}</h3>
                    <p>৳0</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Growth Rate' : 'বৃদ্ধির হার'}</h3>
                    <p>0%</p>
                  </div>
                </div>
              </div>
              <div className="admin-settings-section" style={{ marginTop: '2rem' }}>
                <div className="admin-settings-card">
                  <h3>{language === 'en' ? 'Revenue Chart' : 'রাজস্ব চার্ট'}</h3>
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    {language === 'en' ? 'Chart will be displayed here' : 'চার্ট এখানে প্রদর্শিত হবে'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manage Asset Tab */}
          {activeTab === 'manageAsset' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.manageAsset}</h1>
                <button className="admin-add-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {adminContent.addNew}
                </button>
              </div>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Total Assets' : 'মোট সম্পদ'}</h3>
                    <p>0</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Asset Value' : 'সম্পদের মূল্য'}</h3>
                    <p>৳0</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Active Assets' : 'সক্রিয় সম্পদ'}</h3>
                    <p>0</p>
                  </div>
                </div>
              </div>
              <div className="admin-table-container" style={{ marginTop: '2rem' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{language === 'en' ? 'Asset Name' : 'সম্পদের নাম'}</th>
                      <th>{language === 'en' ? 'Category' : 'ক্যাটাগরি'}</th>
                      <th>{language === 'en' ? 'Purchase Date' : 'ক্রয়ের তারিখ'}</th>
                      <th>{language === 'en' ? 'Value' : 'মূল্য'}</th>
                      <th>{language === 'en' ? 'Status' : 'স্ট্যাটাস'}</th>
                      <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                        {adminContent.noData}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Career Management Tab */}
          {activeTab === 'career' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header">
                <h1 className="admin-page-title">{adminContent.careerManagement}</h1>
              </div>
              <div className="admin-settings-section">
                <div className="admin-settings-card">
                  <h3>{language === 'en' ? 'Manage career postings' : 'ক্যারিয়ার পোস্ট পরিচালনা করুন'}</h3>
                  <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                    {language === 'en' ? 'Coming soon. Add and manage job openings here.' : 'শীঘ্রই আসছে। এখানে চাকরির শূন্যপদ যোগ ও পরিচালনা করুন।'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="admin-tab-content">
              <h1 className="admin-page-title">{adminContent.systemSettings}</h1>
              <div className="admin-settings-section">
                <div className="admin-settings-card">
                  <h3>{language === 'en' ? 'General Settings' : 'সাধারণ সেটিংস'}</h3>
                  <div className="admin-form-group">
                    <label>{language === 'en' ? 'Site Name' : 'সাইটের নাম'}</label>
                    <input type="text" defaultValue="Believers Crop Care Ltd." />
                  </div>
                  <div className="admin-form-group">
                    <label>{language === 'en' ? 'Contact Email' : 'যোগাযোগ ইমেইল'}</label>
                    <input type="email" defaultValue="info@bccl.com" />
                  </div>
                  <div className="admin-form-group">
                    <label>{language === 'en' ? 'Contact Phone' : 'যোগাযোগ ফোন'}</label>
                    <input type="tel" defaultValue="+880 711223344" />
                  </div>
                  <button className="admin-save-btn">{adminContent.save}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminPage

