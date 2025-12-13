import { useState, useEffect, useMemo } from 'react'
import * as XLSX from 'xlsx'

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
  const [showEditProfile, setShowEditProfile] = useState(false)
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
  const [dealers, setDealers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [orderRequests, setOrderRequests] = useState([])
  const [showOrderRequests, setShowOrderRequests] = useState(false)
  const [viewingOrder, setViewingOrder] = useState(null)
  const [isEditingOrderDetails, setIsEditingOrderDetails] = useState(false)
  const [editingOrderDetails, setEditingOrderDetails] = useState(null)
  const [viewingProduct, setViewingProduct] = useState(null)
  const [dealerOrders, setDealerOrders] = useState([])
  const [dealerOrdersLoading, setDealerOrdersLoading] = useState(false)
  const [dealerOrdersStatus, setDealerOrdersStatus] = useState('')
  const [showDealerOrders, setShowDealerOrders] = useState(false)
  const [editingDealerOrderPaidAmount, setEditingDealerOrderPaidAmount] = useState(null)
  const [savingDealerOrderPaidAmount, setSavingDealerOrderPaidAmount] = useState(false)
  const [editingTotalPaid, setEditingTotalPaid] = useState(false)
  const [savingTotalPaid, setSavingTotalPaid] = useState(false)
  const [addCollectionAmount, setAddCollectionAmount] = useState('')
  const [savingCollection, setSavingCollection] = useState(false)
  const [orderCart, setOrderCart] = useState([])
  const [showOrderCart, setShowOrderCart] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [editingOrderId, setEditingOrderId] = useState(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const [orderStatus, setOrderStatus] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [orderFilter, setOrderFilter] = useState('all') // 'all', 'rejected', 'cancelled'
  const [orderSortField, setOrderSortField] = useState(null) // null, 'date', 'orderId', 'dealer', 'totalPrice', etc.
  const [orderSortDirection, setOrderSortDirection] = useState('asc') // 'asc' or 'desc'
  const [orderForm, setOrderForm] = useState({
    dealer: '',
    product: '',
    variant: { name: '', value: '', price: 0 },
    quantity: 1,
    notes: '',
    status: 'Pending',
    paidAmount: 0
  })
  const [selectedProductVariants, setSelectedProductVariants] = useState([])
  const [productSearch, setProductSearch] = useState('')
  const [productStatus, setProductStatus] = useState('')
  const [productForm, setProductForm] = useState({
    productId: '',
    variants: [],
    price: '',
    priceCategory: 'single',
    name: '',
    nameBn: '',
    genericName: '',
    genericNameBn: '',
    category: 'Herbicide',
    categoryBn: '',
    description: '',
    descriptionBn: '',
    usage: '',
    usageBn: '',
    benefits: '',
    benefitsBn: '',
    application: '',
    applicationBn: '',
    safety: '',
    safetyBn: '',
    image: ''
  })
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProductId, setEditingProductId] = useState(null)
  const [savingProduct, setSavingProduct] = useState(false)
  const [showDealerForm, setShowDealerForm] = useState(false)
  const [viewingDealer, setViewingDealer] = useState(null)
  const [dealerSearch, setDealerSearch] = useState('')
  const [dealerSortField, setDealerSortField] = useState(null) // null, 'dealerId', 'name', 'phone', etc.
  const [dealerSortDirection, setDealerSortDirection] = useState('asc') // 'asc' or 'desc'
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
    postingArea: '',
    role: '',
    designation: '',
    photo: '',
    status: 'Unpaid'
  })
  const [employeeStatus, setEmployeeStatus] = useState('')
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [employeeSortField, setEmployeeSortField] = useState(null) // null, 'employeeId', 'name', 'phone', etc.
  const [employeeSortDirection, setEmployeeSortDirection] = useState('asc') // 'asc' or 'desc'
  const [newDealer, setNewDealer] = useState({
    dealerId: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    photo: '',
    nid: '',
    tradeLicense: '',
    pesticideLicense: '',
    area: '',
    agreement: '',
    assignedTo: '',
    assignedToName: '',
    assignedToId: ''
  })
  const [dealerStatus, setDealerStatus] = useState('')
  const [isEditingDealer, setIsEditingDealer] = useState(false)
  const [editingDealerData, setEditingDealerData] = useState(null)
  const [savingDealer, setSavingDealer] = useState(false)

  // Persist minimal auth state so refresh keeps the user signed in
  const persistAuthState = (state) => {
    try {
      localStorage.setItem('adminAuth', JSON.stringify({
        isAuthenticated: true,
        isEmployee: !!state.isEmployee,
        userRole: state.userRole || 'Admin',
        loggedInUser: state.loggedInUser || '',
        loggedInUserId: state.loggedInUserId ?? null
      }))
    } catch (err) {
      console.error('Failed to persist auth state', err)
    }
  }

  const getNextDealerId = () => {
    const nums = dealers
      .map((d) => parseInt(String(d.dealerId || '').replace(/^D/i, ''), 10))
      .filter((n) => !isNaN(n))
    const next = (nums.length ? Math.max(...nums) + 1 : 1)
    return `D${String(next).padStart(3, '0')}`
  }
  const [generatedCredentials, setGeneratedCredentials] = useState(null)
  const [viewingEmployee, setViewingEmployee] = useState(null)
  const [isEditingEmployee, setIsEditingEmployee] = useState(false)
  const [editingEmployeeData, setEditingEmployeeData] = useState(null)
  const [savingEmployee, setSavingEmployee] = useState(false)
  const [lastGeneratedPassword, setLastGeneratedPassword] = useState('')
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showSalesHistory, setShowSalesHistory] = useState(false)
  const [showAssignedDealers, setShowAssignedDealers] = useState(false)
  const salesEmployees = useMemo(() => {
    return (employees || []).filter((emp) => {
      const role = (emp.role || '').toLowerCase()
      return role.includes('sales')
    })
  }, [employees])

  const filteredDealers = useMemo(() => {
    const isAdmin = (userRole || '').toLowerCase() === 'admin'
    let list = isAdmin ? dealers : (dealers || []).filter((d) => {
      const assignedId = d.assignedTo?._id || d.assignedTo
      const assignedName = d.assignedToName
      return (
        (loggedInUserId && assignedId && String(assignedId) === String(loggedInUserId)) ||
        (loggedInUser && assignedName && assignedName === loggedInUser)
      )
    })
    if (dealerSearch && dealerSearch.trim()) {
      const q = dealerSearch.trim().toLowerCase()
      list = list.filter((d) =>
        (d.name || '').toLowerCase().includes(q) ||
        (d.dealerId || '').toLowerCase().includes(q) ||
        (d.phone || '').toLowerCase().includes(q) ||
        (d.email || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [dealers, userRole, loggedInUserId, loggedInUser, dealerSearch])

  // Sorted dealers
  const sortedDealers = useMemo(() => {
    if (!dealerSortField) return filteredDealers
    
    const sorted = [...filteredDealers].sort((a, b) => {
      let aValue, bValue
      
      switch (dealerSortField) {
        case 'dealerId':
          aValue = (a.dealerId || '').toLowerCase()
          bValue = (b.dealerId || '').toLowerCase()
          break
        case 'name':
          aValue = (a.name || '').toLowerCase()
          bValue = (b.name || '').toLowerCase()
          break
        case 'phone':
          aValue = (a.phone || '').toLowerCase()
          bValue = (b.phone || '').toLowerCase()
          break
        case 'email':
          aValue = (a.email || '').toLowerCase()
          bValue = (b.email || '').toLowerCase()
          break
        case 'area':
          aValue = (a.area || '').toLowerCase()
          bValue = (b.area || '').toLowerCase()
          break
        case 'salesman':
          aValue = (a.assignedToName || a.assignedToId || '').toLowerCase()
          bValue = (b.assignedToName || b.assignedToId || '').toLowerCase()
          break
        case 'dueAmount':
          // Calculate due amount for sorting
          const aDealerOrders = (orders || []).filter(order => 
            order.dealerId === a.dealerId && order.status !== 'Cancelled'
          )
          const bDealerOrders = (orders || []).filter(order => 
            order.dealerId === b.dealerId && order.status !== 'Cancelled'
          )
          aValue = aDealerOrders.reduce((sum, order) => {
            const due = order.dueAmount !== undefined 
              ? parseFloat(order.dueAmount) 
              : Math.max(0, parseFloat(order.totalPrice || 0) - parseFloat(order.paidAmount || 0))
            return sum + due
          }, 0)
          bValue = bDealerOrders.reduce((sum, order) => {
            const due = order.dueAmount !== undefined 
              ? parseFloat(order.dueAmount) 
              : Math.max(0, parseFloat(order.totalPrice || 0) - parseFloat(order.paidAmount || 0))
            return sum + due
          }, 0)
          break
        default:
          return 0
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return dealerSortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return dealerSortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }
    })
    
    return sorted
  }, [filteredDealers, dealerSortField, dealerSortDirection, orders])

  // Handle sort column click for dealers
  const handleSortDealers = (field) => {
    if (dealerSortField === field) {
      // Toggle direction if clicking the same field
      setDealerSortDirection(dealerSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new field and default to ascending
      setDealerSortField(field)
      setDealerSortDirection('asc')
    }
  }

  const filteredEmployees = useMemo(() => {
    let list = employees || []
    if (employeeSearch && employeeSearch.trim()) {
      const q = employeeSearch.trim().toLowerCase()
      list = list.filter((e) =>
        (e.name || '').toLowerCase().includes(q) ||
        (e.employeeId || '').toLowerCase().includes(q) ||
        (e.phone || '').toLowerCase().includes(q) ||
        (e.email || '').toLowerCase().includes(q) ||
        (e.designation || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [employees, employeeSearch])

  // Sorted employees
  const sortedEmployees = useMemo(() => {
    if (!employeeSortField) return filteredEmployees
    
    const sorted = [...filteredEmployees].sort((a, b) => {
      let aValue, bValue
      
      switch (employeeSortField) {
        case 'employeeId':
          aValue = (a.employeeId || '').toLowerCase()
          bValue = (b.employeeId || '').toLowerCase()
          break
        case 'name':
          aValue = (a.name || '').toLowerCase()
          bValue = (b.name || '').toLowerCase()
          break
        case 'phone':
          aValue = (a.phone || '').toLowerCase()
          bValue = (b.phone || '').toLowerCase()
          break
        case 'designation':
          aValue = (a.designation || '').toLowerCase()
          bValue = (b.designation || '').toLowerCase()
          break
        case 'postingArea':
          aValue = ((a.postingArea || a.area) || '').toLowerCase()
          bValue = ((b.postingArea || b.area) || '').toLowerCase()
          break
        case 'salary':
          aValue = parseFloat(a.salary || 0)
          bValue = parseFloat(b.salary || 0)
          break
        case 'salesTarget':
          aValue = parseFloat(a.salesTarget || 0)
          bValue = parseFloat(b.salesTarget || 0)
          break
        case 'salaryStatus':
          aValue = (normalizeSalaryStatus(a.status) || '').toLowerCase()
          bValue = (normalizeSalaryStatus(b.status) || '').toLowerCase()
          break
        default:
          return 0
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return employeeSortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return employeeSortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }
    })
    
    return sorted
  }, [filteredEmployees, employeeSortField, employeeSortDirection])

  // Handle sort column click for employees
  const handleSortEmployees = (field) => {
    if (employeeSortField === field) {
      // Toggle direction if clicking the same field
      setEmployeeSortDirection(employeeSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new field and default to ascending
      setEmployeeSortField(field)
      setEmployeeSortDirection('asc')
    }
  }

  // Totals across all dealers/orders
  const { totalCollection, totalDue } = useMemo(() => {
    const totals = (orders || []).reduce((acc, order) => {
      // Exclude cancelled and rejected orders from calculations
      if (order.status === 'Cancelled' || order.approvalStatus === 'Rejected') {
        return acc
      }
      
      // Total Collection: sum of all paidAmount (default to 0 if not set)
      const paid = order?.paidAmount !== undefined && order?.paidAmount !== null
        ? Number(order.paidAmount)
        : 0
      
      // Total Due: use dueAmount if set, otherwise calculate as totalPrice - paidAmount
      const due = order?.dueAmount !== undefined && order?.dueAmount !== null
        ? Number(order.dueAmount)
        : Math.max(0, Number(order.totalPrice || 0) - Number(paid || 0))
      
      acc.totalCollection += Number(paid || 0)
      acc.totalDue += Number(due || 0)
      return acc
    }, { totalCollection: 0, totalDue: 0 })
    return totals
  }, [orders])

  const filteredOrders = useMemo(() => {
    let list = orders || []
    
    // Always exclude pending orders - only show approved orders
    list = list.filter((o) => o.approvalStatus !== 'Pending')
    
    // Filter by order filter (rejected, cancelled, or all)
    if (orderFilter === 'rejected') {
      list = list.filter((o) => o.approvalStatus === 'Rejected')
    } else if (orderFilter === 'cancelled') {
      list = list.filter((o) => o.status === 'Cancelled')
    } else {
      // For 'all', exclude rejected and cancelled from default view (they can be viewed via buttons)
      list = list.filter((o) => 
        o.approvalStatus !== 'Rejected' && o.status !== 'Cancelled'
      )
    }
    
    // Apply search filter
    if (orderSearch && orderSearch.trim()) {
      const q = orderSearch.trim().toLowerCase()
      list = list.filter((o) =>
        (o.orderId || '').toLowerCase().includes(q) ||
        (o.dealerName || '').toLowerCase().includes(q) ||
        (o.dealerId || '').toLowerCase().includes(q) ||
        (o.requestedByName || '').toLowerCase().includes(q) ||
        (o.status || '').toLowerCase().includes(q) ||
        (o.approvalStatus || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [orders, orderSearch, orderFilter])

  // Sorted orders
  const sortedOrders = useMemo(() => {
    if (!orderSortField) return filteredOrders
    
    const sorted = [...filteredOrders].sort((a, b) => {
      let aValue, bValue
      
      switch (orderSortField) {
        case 'date':
          aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0
          bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0
          break
        case 'orderId':
          aValue = (a.orderId || '').toLowerCase()
          bValue = (b.orderId || '').toLowerCase()
          break
        case 'dealer':
          aValue = (a.dealerName || a.dealer?.name || '').toLowerCase()
          bValue = (b.dealerName || b.dealer?.name || '').toLowerCase()
          break
        case 'dealerId':
          aValue = (a.dealerId || a.dealer?.dealerId || '').toLowerCase()
          bValue = (b.dealerId || b.dealer?.dealerId || '').toLowerCase()
          break
        case 'product':
          aValue = (a.productName || a.product?.name || '').toLowerCase()
          bValue = (b.productName || b.product?.name || '').toLowerCase()
          break
        case 'quantity':
          aValue = parseFloat(a.quantity || 0)
          bValue = parseFloat(b.quantity || 0)
          break
        case 'createdBy':
          aValue = (a.requestedByName || a.requestedByRole || '').toLowerCase()
          bValue = (b.requestedByName || b.requestedByRole || '').toLowerCase()
          break
        case 'totalPrice':
          aValue = parseFloat(a.totalPrice || 0)
          bValue = parseFloat(b.totalPrice || 0)
          break
        case 'paidAmount':
          aValue = parseFloat(a.paidAmount || 0)
          bValue = parseFloat(b.paidAmount || 0)
          break
        case 'dueAmount':
          aValue = a.dueAmount !== undefined && a.dueAmount !== null
            ? parseFloat(a.dueAmount)
            : Math.max(0, parseFloat(a.totalPrice || 0) - parseFloat(a.paidAmount || 0))
          bValue = b.dueAmount !== undefined && b.dueAmount !== null
            ? parseFloat(b.dueAmount)
            : Math.max(0, parseFloat(b.totalPrice || 0) - parseFloat(b.paidAmount || 0))
          break
        case 'status':
          aValue = (a.status || 'Pending').toLowerCase()
          bValue = (b.status || 'Pending').toLowerCase()
          break
        default:
          return 0
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return orderSortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return orderSortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }
    })
    
    return sorted
  }, [filteredOrders, orderSortField, orderSortDirection])

  // Handle sort column click
  const handleSortOrders = (field) => {
    if (orderSortField === field) {
      // Toggle direction if clicking the same field
      setOrderSortDirection(orderSortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new field and default to ascending
      setOrderSortField(field)
      setOrderSortDirection('asc')
    }
  }

  // Restore persisted auth state on first load
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth')
    if (!savedAuth) return

    try {
      const parsed = JSON.parse(savedAuth)
      if (parsed?.isAuthenticated) {
        setIsAuthenticated(true)
        setIsEmployee(!!parsed.isEmployee)
        setUserRole(parsed.userRole || 'Admin')
        setLoggedInUser(parsed.loggedInUser || '')
        setLoggedInUserId(parsed.loggedInUserId ?? null)
      }
    } catch (err) {
      console.error('Failed to restore auth state', err)
      localStorage.removeItem('adminAuth')
    }
  }, [])

  const loadDealers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dealers`)
      if (res.ok) {
        const data = await res.json()
        setDealers(data.data || [])
      }
    } catch (err) {
      console.error('Failed to load dealers', err)
    }
  }

  useEffect(() => {
    loadDealers()
  }, [userRole, loggedInUserId, loggedInUser])

  const loadProducts = async () => {
    try {
      setProductStatus('')
      const res = await fetch(`${API_BASE}/api/products`)
      if (!res.ok) {
        throw new Error('Failed to load products')
      }
      const data = await res.json()
      setProducts(data.data || [])
    } catch (err) {
      console.error('Failed to load products', err)
      setProducts(Array.isArray(t?.products?.items) ? [...t.products.items] : [])
      setProductStatus(language === 'en' 
        ? 'Showing static products while API is unavailable.'
        : 'এপিআই অনুপলব্ধ থাকায় ডিফল্ট পণ্য দেখানো হচ্ছে।')
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const loadOrderRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders?approvalStatus=Pending`)
      if (res.ok) {
        const data = await res.json()
        const pending = data.data || []
        const isAdmin = (userRole || '').toLowerCase() === 'admin'
        if (isAdmin) {
          setOrderRequests(pending)
        } else {
          const filtered = pending.filter((o) => {
            const requesterId = o.requestedBy?._id || o.requestedBy
            const requesterName = o.requestedByName
            return (
              (loggedInUserId && requesterId && String(requesterId) === String(loggedInUserId)) ||
              (loggedInUser && requesterName && requesterName === loggedInUser)
            )
          })
          setOrderRequests(filtered)
        }
      }
    } catch (err) {
      console.error('Failed to load order requests', err)
    }
  }

  const loadOrders = async () => {
    try {
      // Load dealers if not already loaded (needed for employee order filtering)
      const isAdmin = (userRole || '').toLowerCase() === 'admin'
      if (!isAdmin && (!dealers || dealers.length === 0)) {
        await loadDealers()
      }
      
      const res = await fetch(`${API_BASE}/api/orders`)
      if (res.ok) {
        const data = await res.json()
        // Exclude pending orders - only show approved orders (and rejected/cancelled if viewing those filters)
        const allOrders = (data.data || []).filter((o) => o.approvalStatus !== 'Pending')
        const filtered = isAdmin
          ? allOrders
          : allOrders.filter((o) => {
              // Show orders created by this employee
              const requesterId = o.requestedBy?._id || o.requestedBy
              const requesterName = o.requestedByName
              const isEmployeeOrder = (
                (loggedInUserId && requesterId && String(requesterId) === String(loggedInUserId)) ||
                (loggedInUser && requesterName && requesterName === loggedInUser)
              )
              
              // Also show orders created by admin where the dealer is assigned to this employee
              const isAdminCreated = o.requestedByRole && o.requestedByRole.toLowerCase() === 'admin'
              let isAssignedToEmployee = false
              
              if (isAdminCreated && loggedInUserId) {
                // Check if the order's dealer is assigned to this employee
                const dealerId = o.dealerId
                const dealer = (dealers || []).find(d => d.dealerId === dealerId)
                if (dealer) {
                  const assignedToId = dealer.assignedTo?._id || dealer.assignedTo
                  isAssignedToEmployee = assignedToId && String(assignedToId) === String(loggedInUserId)
                }
              }
              
              return isEmployeeOrder || isAssignedToEmployee
            })
        setOrders(filtered)
      }
    } catch (err) {
      console.error('Failed to load orders', err)
    }
  }

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders()
      if (showOrderRequests) {
        loadOrderRequests()
      }
    }
  }, [activeTab, userRole, showOrderRequests])

  // Load orders when Revenue tab is active (needed for Total Collection and Total Due calculations)
  useEffect(() => {
    if (activeTab === 'revenue') {
      loadOrders()
    }
  }, [activeTab])

  // Load orders when CRM tab is active (needed for Due Amount calculations in dealers table)
  useEffect(() => {
    if (activeTab === 'crm') {
      loadOrders()
    }
  }, [activeTab])

  // Ensure orders are loaded when viewing sales history (even outside Orders tab)
  useEffect(() => {
    if (showSalesHistory && (!orders || orders.length === 0)) {
      loadOrders()
    }
  }, [showSalesHistory])

  // Update variants when product changes
  useEffect(() => {
    if (orderForm.product) {
      const selectedProduct = products.find(p => p._id === orderForm.product)
      if (selectedProduct && selectedProduct.variants && selectedProduct.variants.length > 0) {
        setSelectedProductVariants(selectedProduct.variants)
        // Reset variant if product changed
        setOrderForm(prev => ({ ...prev, variant: { name: '', value: '', price: 0 } }))
      } else {
        setSelectedProductVariants([])
        setOrderForm(prev => ({ ...prev, variant: { name: '', value: '', price: 0 } }))
      }
    } else {
      setSelectedProductVariants([])
    }
  }, [orderForm.product, products])

  const resetOrderForm = () => {
    setOrderForm({
      dealer: '',
      product: '',
      variant: { name: '', value: '', price: 0 },
      quantity: 1,
      notes: '',
      status: 'Pending',
      paidAmount: 0
    })
    setSelectedProductVariants([])
    setEditingOrderId(null)
  }

  const handleSaveOrder = async (e) => {
    e.preventDefault()
    if (!orderForm.dealer || !orderForm.product || !orderForm.quantity) {
      setOrderStatus(language === 'en' ? 'Please fill all required fields' : 'প্রয়োজনীয় সব ঘর পূরণ করুন')
      return
    }

    try {
      setSavingOrder(true)
      setOrderStatus('')
      
      const selectedProduct = products.find(p => p._id === orderForm.product)
      const orderData = {
        dealer: orderForm.dealer,
        product: orderForm.product,
        quantity: parseFloat(orderForm.quantity) || 1,
        notes: orderForm.notes || '',
        status: orderForm.status || 'Pending',
        approvalStatus: userRole === 'Admin' ? 'Approved' : 'Pending',
        requestedBy: loggedInUserId || null,
        requestedByName: loggedInUser || '',
        requestedByRole: userRole || ''
      }

      // Add variant if product has variants and one is selected
      if (selectedProduct && selectedProduct.priceCategory === 'per_variant' && orderForm.variant && orderForm.variant.value) {
        orderData.variant = orderForm.variant
      }

      const method = editingOrderId ? 'PUT' : 'POST'
      const url = editingOrderId
        ? `${API_BASE}/api/orders/${editingOrderId}`
        : `${API_BASE}/api/orders`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to save order')
      }

      await loadOrders()
      setOrderStatus(language === 'en' ? (editingOrderId ? 'Order updated' : 'Order created') : (editingOrderId ? 'অর্ডার আপডেট হয়েছে' : 'অর্ডার তৈরি হয়েছে'))
      resetOrderForm()
      setShowOrderForm(false)
      
      // Dispatch event to refresh other pages if needed
      window.dispatchEvent(new Event('contentUpdated'))
    } catch (err) {
      console.error('Order save error:', err)
      setOrderStatus(language === 'en' ? err.message : err.message)
    } finally {
      setSavingOrder(false)
    }
  }

  const handleEditOrder = (order) => {
    if (!order) return
    const existingItems = Array.isArray(order.items) && order.items.length
      ? order.items
      : [{
          product: order.product?._id || order.product || '',
          productName: order.productName || '',
          productId: order.productId || '',
          variant: order.variant || { name: '', value: '', price: 0 },
          quantity: order.quantity || 1,
          notes: order.notes || '',
          status: order.status || 'Pending'
        }]
    setOrderCart(existingItems.map((it) => ({
      product: it.product,
      productName: it.productName,
      productId: it.productId,
      variant: it.variant,
      quantity: it.quantity,
      notes: it.notes,
      status: it.status || 'Pending'
    })))
    setShowOrderCart(true)
    setOrderForm({
      dealer: order.dealer?._id || order.dealer || '',
      product: existingItems[0]?.product || '',
      variant: existingItems[0]?.variant || { name: '', value: '', price: 0 },
      quantity: existingItems[0]?.quantity || 1,
      notes: order.notes || '',
      status: order.status || 'Pending',
      paidAmount: order.paidAmount || 0
    })
    setEditingOrderId(order._id)
    setShowOrderForm(true)
    setOrderStatus('')
  }

  const handleDeleteOrder = async (id) => {
    if (!window.confirm(language === 'en' ? 'Are you sure you want to delete this order?' : 'আপনি কি এই অর্ডারটি মুছতে চান?')) {
      return
    }

    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete order')
      }

      // Reload orders and employees to reflect the deletion
      await loadOrders()
      await loadEmployees()
      
      // If viewing an employee, refresh their data
      if (viewingEmployee) {
        const empRes = await fetch(`${API_BASE}/api/employees/${viewingEmployee._id}`)
        if (empRes.ok) {
          const empData = await empRes.json()
          if (empData.success && empData.data) {
            setViewingEmployee({ ...empData.data, status: normalizeSalaryStatus(empData.data.status) })
          }
        }
      }
      
      window.dispatchEvent(new Event('contentUpdated'))
    } catch (err) {
      console.error('Order delete error:', err)
      alert(language === 'en' ? 'Failed to delete order' : 'অর্ডার মুছতে ব্যর্থ')
    }
  }

  const handleExportOrders = () => {
    try {
      // Prepare data for export
      const exportData = sortedOrders.map((order) => {
        const dueAmount = order.dueAmount !== undefined && order.dueAmount !== null
          ? parseFloat(order.dueAmount)
          : Math.max(0, parseFloat(order.totalPrice || 0) - parseFloat(order.paidAmount || 0))
        
        return {
          'Date': order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-',
          'Order ID': order.orderId || '-',
          'Dealer': order.dealerName || order.dealer?.name || '-',
          'Dealer ID': order.dealerId || order.dealer?.dealerId || '-',
          'Product': order.productName || order.product?.name || '-',
          'Variant': order.variant?.value ? (order.variant.name || order.variant.value) : '-',
          'Quantity': order.quantity || 0,
          'Created By': order.requestedByName || order.requestedByRole || '-',
          'Total Price': parseFloat(order.totalPrice || 0).toFixed(2),
          'Paid Amount': parseFloat(order.paidAmount || 0).toFixed(2),
          'Due Amount': dueAmount.toFixed(2),
          'Status': order.status || 'Pending',
          'Approval Status': order.approvalStatus || '-'
        }
      })

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Orders')

      // Generate filename with current date
      const dateStr = new Date().toISOString().split('T')[0]
      const filename = `Orders_${dateStr}.xlsx`

      // Write file and trigger download
      XLSX.writeFile(wb, filename)
    } catch (err) {
      console.error('Export error:', err)
      alert(language === 'en' ? 'Failed to export orders' : 'অর্ডার রপ্তানি করতে ব্যর্থ')
    }
  }

  const handleShowDealerOrders = async (dealer = null) => {
    const targetDealer = dealer || viewingDealer
    if (!targetDealer?._id && !targetDealer?.dealerId) return
    try {
      setDealerOrdersLoading(true)
      setDealerOrdersStatus('')
      const res = await fetch(`${API_BASE}/api/orders`)
      if (!res.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await res.json()
      
      // Filter orders to show ONLY this specific dealer's orders - match strictly by dealerId
      const targetDealerId = targetDealer.dealerId
      if (!targetDealerId) {
        setDealerOrdersStatus(language === 'en' ? 'Dealer ID not found.' : 'ডিলার আইডি পাওয়া যায়নি।')
        setDealerOrders([])
        setShowDealerOrders(true)
        setDealerOrdersLoading(false)
        return
      }
      
      const filtered = (data.data || []).filter((order) => {
        // Exclude cancelled orders
        if (order.status === 'Cancelled') {
          return false
        }
        
        // STRICT MATCH: Prioritize dealerId string match
        const orderDealerId = order.dealerId
        
        // First try: Match by dealerId string (most reliable)
        if (orderDealerId && orderDealerId === targetDealerId) {
          return true
        }
        
        // Second try: If dealerId doesn't exist or doesn't match, try dealer._id
        // This handles cases where orders might reference dealer by ObjectId
        if (targetDealer._id) {
          const orderDealerObjectId = order.dealer?._id || order.dealer
          if (orderDealerObjectId && String(orderDealerObjectId) === String(targetDealer._id)) {
            return true
          }
        }
        
        // No match found - exclude this order
        return false
      })
      
      console.log('Dealer Orders Filter (STRICT):', {
        targetDealerId: targetDealerId,
        viewingDealer: { dealerId: targetDealer.dealerId, _id: targetDealer._id, name: targetDealer.name },
        totalOrders: (data.data || []).length,
        filteredOrders: filtered.length,
        filteredOrderDetails: filtered.map(o => ({ 
          orderId: o.orderId, 
          dealerId: o.dealerId, 
          dealerName: o.dealerName,
          totalPrice: o.totalPrice,
          paidAmount: o.paidAmount,
          dueAmount: o.dueAmount
        }))
      })
      
      setDealerOrders(filtered)
      setShowDealerOrders(true)
      if (!filtered.length) {
        setDealerOrdersStatus(language === 'en' ? 'No orders for this dealer yet.' : 'এই ডিলারের কোনো অর্ডার নেই।')
      }
    } catch (err) {
      console.error('Dealer orders load error:', err)
      setDealerOrdersStatus(language === 'en' ? (err.message || 'Failed to load orders') : (err.message || 'অর্ডার লোড ব্যর্থ'))
    } finally {
      setDealerOrdersLoading(false)
    }
  }

  const handleSaveDealerOrderPaidAmount = async (orderId, newPaidAmount) => {
    if ((userRole || '').toLowerCase() !== 'admin') return
    
    try {
      setSavingDealerOrderPaidAmount(true)
      const paidAmount = parseFloat(newPaidAmount) || 0
      const order = dealerOrders.find(o => o._id === orderId)
      if (!order) return
      
      const totalPrice = parseFloat(order.totalPrice) || 0
      const dueAmount = Math.max(0, totalPrice - paidAmount)
      
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paidAmount: paidAmount,
          dueAmount: dueAmount
        })
      })

      if (!res.ok) {
        throw new Error('Failed to update paid amount')
      }

      // Reload dealer orders to get updated data
      await handleShowDealerOrders()
      setEditingDealerOrderPaidAmount(null)
      
      // Also reload main orders list
      await loadOrders()
    } catch (err) {
      console.error('Failed to update paid amount:', err)
      alert(language === 'en' ? 'Failed to update paid amount' : 'পরিশোধিত পরিমাণ আপডেট ব্যর্থ')
    } finally {
      setSavingDealerOrderPaidAmount(false)
    }
  }

  const handleSaveTotalPaid = async (newTotalPaid) => {
    if ((userRole || '').toLowerCase() !== 'admin') return
    
    try {
      setSavingTotalPaid(true)
      const newTotalPaidValue = parseFloat(newTotalPaid) || 0
      const currentTotalPaid = dealerOrders.reduce((sum, order) => {
        return sum + (parseFloat(order.paidAmount) || 0)
      }, 0)
      
      const difference = newTotalPaidValue - currentTotalPaid
      
      if (difference === 0) {
        setEditingTotalPaid(false)
        return
      }
      
      // Sort orders by due amount (highest first) to reduce due amounts one by one
      const sortedOrders = [...dealerOrders].map(order => {
        const totalPrice = parseFloat(order.totalPrice) || 0
        const paidAmount = parseFloat(order.paidAmount) || 0
        const dueAmount = order.dueAmount !== undefined 
          ? parseFloat(order.dueAmount) 
          : Math.max(0, totalPrice - paidAmount)
        return { ...order, calculatedDue: dueAmount }
      }).sort((a, b) => b.calculatedDue - a.calculatedDue)
      
      let remainingDifference = difference
      
      // Update orders one by one, reducing due amounts
      for (const order of sortedOrders) {
        if (remainingDifference === 0) break
        
        const totalPrice = parseFloat(order.totalPrice) || 0
        const currentPaid = parseFloat(order.paidAmount) || 0
        const currentDue = order.calculatedDue
        
        if (remainingDifference > 0) {
          // Increase paid amount - reduce due amount
          const amountToAdd = Math.min(remainingDifference, currentDue)
          const newPaidAmount = currentPaid + amountToAdd
          const newDueAmount = Math.max(0, totalPrice - newPaidAmount)
          
          const res = await fetch(`${API_BASE}/api/orders/${order._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paidAmount: newPaidAmount,
              dueAmount: newDueAmount
            })
          })

          if (!res.ok) {
            throw new Error(`Failed to update order ${order.orderId}`)
          }
          
          remainingDifference -= amountToAdd
        } else {
          // Decrease paid amount - increase due amount
          const amountToReduce = Math.min(Math.abs(remainingDifference), currentPaid)
          const newPaidAmount = Math.max(0, currentPaid - amountToReduce)
          const newDueAmount = Math.max(0, totalPrice - newPaidAmount)
          
          const res = await fetch(`${API_BASE}/api/orders/${order._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paidAmount: newPaidAmount,
              dueAmount: newDueAmount
            })
          })

          if (!res.ok) {
            throw new Error(`Failed to update order ${order.orderId}`)
          }
          
          remainingDifference += amountToReduce
        }
      }

      // Reload dealer orders to get updated data
      await handleShowDealerOrders()
      setEditingTotalPaid(false)
      
      // Also reload main orders list
      await loadOrders()
    } catch (err) {
      console.error('Failed to update total paid:', err)
      alert(language === 'en' ? 'Failed to update total paid' : 'মোট পরিশোধিত আপডেট ব্যর্থ')
    } finally {
      setSavingTotalPaid(false)
    }
  }

  const handleAddCollection = async (collectionAmount) => {
    if ((userRole || '').toLowerCase() !== 'admin') return
    
    const amount = parseFloat(collectionAmount) || 0
    if (amount <= 0) {
      setAddCollectionAmount('')
      return
    }
    
    try {
      setSavingCollection(true)
      
      // Sort orders by due amount (highest first) to reduce due amounts one by one
      const sortedOrders = [...dealerOrders].map(order => {
        const totalPrice = parseFloat(order.totalPrice) || 0
        const paidAmount = parseFloat(order.paidAmount) || 0
        const dueAmount = order.dueAmount !== undefined 
          ? parseFloat(order.dueAmount) 
          : Math.max(0, totalPrice - paidAmount)
        return { ...order, calculatedDue: dueAmount }
      }).sort((a, b) => b.calculatedDue - a.calculatedDue)
      
      let remainingAmount = amount
      
      // Update orders one by one, reducing due amounts
      for (const order of sortedOrders) {
        if (remainingAmount <= 0) break
        
        const totalPrice = parseFloat(order.totalPrice) || 0
        const currentPaid = parseFloat(order.paidAmount) || 0
        const currentDue = order.calculatedDue
        
        // Add to paid amount - reduce due amount
        const amountToAdd = Math.min(remainingAmount, currentDue)
        const newPaidAmount = currentPaid + amountToAdd
        const newDueAmount = Math.max(0, totalPrice - newPaidAmount)
        
        const res = await fetch(`${API_BASE}/api/orders/${order._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paidAmount: newPaidAmount,
            dueAmount: newDueAmount
          })
        })

        if (!res.ok) {
          throw new Error(`Failed to update order ${order.orderId}`)
        }
        
        remainingAmount -= amountToAdd
      }

      // Reload dealer orders to get updated data
      await handleShowDealerOrders()
      setAddCollectionAmount('')
      
      // Also reload main orders list
      await loadOrders()
    } catch (err) {
      console.error('Failed to add collection:', err)
      alert(language === 'en' ? 'Failed to add collection' : 'সংগ্রহ যোগ করতে ব্যর্থ')
    } finally {
      setSavingCollection(false)
    }
  }


  const handleAddOrderToCart = () => {
    if (!orderForm.dealer) {
      setOrderStatus(language === 'en' ? 'Please select a dealer' : 'দয়া করে ডিলার নির্বাচন করুন')
      return
    }
    if (!orderForm.product) {
      setOrderStatus(language === 'en' ? 'Please select a product' : 'দয়া করে পণ্য নির্বাচন করুন')
      return
    }
    const selectedProduct = products.find((p) => p._id === orderForm.product)
    if (selectedProduct && selectedProduct.priceCategory === 'per_variant' && selectedProduct.variants?.length) {
      if (!orderForm.variant?.value) {
        setOrderStatus(language === 'en' ? 'Please select a variant' : 'দয়া করে ভ্যারিয়েন্ট নির্বাচন করুন')
        return
      }
    }

    const qty = parseFloat(orderForm.quantity) || 1
    const item = {
      product: orderForm.product,
      productName: selectedProduct?.name || '',
      productId: selectedProduct?.productId || '',
      variant: orderForm.variant?.value ? { ...orderForm.variant } : null,
      quantity: qty,
      notes: orderForm.notes || '',
        status: orderForm.status || 'Pending',
        approvalStatus: userRole === 'Admin' ? 'Approved' : 'Pending',
        requestedBy: loggedInUserId || null,
        requestedByName: loggedInUser || '',
        requestedByRole: userRole || ''
    }

    setOrderCart((prev) => [...prev, item])
    setShowOrderCart(true)
    setOrderStatus(language === 'en' ? 'Added to cart' : 'কার্টে যোগ হয়েছে')

    // Reset item-specific fields but keep dealer/status
    setOrderForm((prev) => ({
      ...prev,
      product: '',
      variant: { name: '', value: '', price: 0 },
      quantity: 1,
      notes: ''
    }))
    setSelectedProductVariants([])
  }

  const handleRemoveCartItem = (idx) => {
    setOrderCart((prev) => prev.filter((_, i) => i !== idx))
  }

  const getCartItemTotal = (item) => {
    const product = products.find((p) => p._id === item.product)
    const qty = parseFloat(item.quantity) || 0
    let unitPrice = 0

    if (item.variant && item.variant.price !== undefined && item.variant.price !== null) {
      unitPrice = parseFloat(item.variant.price) || 0
    }

    if (!unitPrice && product) {
      if (product.priceCategory === 'per_variant' && item.variant?.value) {
        const pv = product.variants?.find((v) => v.value === item.variant.value)
        if (pv) {
          unitPrice = pv.price || 0
        }
      }
      if (!unitPrice) {
        unitPrice = product.price || 0
      }
    }

    return unitPrice * qty
  }

  const getOrderCartTotal = () => {
    return orderCart.reduce((sum, item) => sum + getCartItemTotal(item), 0)
  }

  const handleConfirmOrders = async () => {
    if (!orderForm.dealer) {
      setOrderStatus(language === 'en' ? 'Please select a dealer' : 'দয়া করে ডিলার নির্বাচন করুন')
      return
    }
    if (!orderCart.length) {
      setOrderStatus(language === 'en' ? 'Cart is empty' : 'কার্ট খালি')
      return
    }

    try {
      setSavingOrder(true)
      setOrderStatus('')

      const payload = {
        dealer: orderForm.dealer,
        items: orderCart.map((item) => ({
          product: item.product,
          variant: item.variant && item.variant.value ? {
            name: item.variant.name || '',
            value: item.variant.value,
            price: item.variant.price || 0
          } : undefined,
          quantity: item.quantity,
          notes: item.notes || ''
        })),
        status: editingOrderId ? (orderForm.status || 'Pending') : (orderCart[0]?.status || 'Pending'),
        approvalStatus: userRole === 'Admin' ? 'Approved' : 'Pending',
        requestedBy: loggedInUserId || null,
        requestedByName: loggedInUser || '',
        requestedByRole: userRole || '',
        ...(editingOrderId && {
          paidAmount: orderForm.paidAmount || 0
        })
      }

      const method = editingOrderId ? 'PUT' : 'POST'
      const url = editingOrderId
        ? `${API_BASE}/api/orders/${editingOrderId}`
        : `${API_BASE}/api/orders`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to save order')
      }

      await loadOrders()
      await loadOrderRequests()
      setOrderStatus(language === 'en' ? (editingOrderId ? 'Order updated' : 'Order created') : (editingOrderId ? 'অর্ডার আপডেট হয়েছে' : 'অর্ডার তৈরি হয়েছে'))
      setOrderCart([])
      setShowOrderCart(false)
      resetOrderForm()
      setEditingOrderId(null)
      window.dispatchEvent(new Event('contentUpdated'))
    } catch (err) {
      console.error('Order confirm error:', err)
      setOrderStatus(language === 'en' ? err.message : err.message)
    } finally {
      setSavingOrder(false)
    }
  }

  const resetProductForm = () => {
    setProductForm({
      productId: '',
      variants: [],
      price: '',
      priceCategory: 'single',
      name: '',
      nameBn: '',
      genericName: '',
      genericNameBn: '',
      category: 'Herbicide',
      categoryBn: '',
      description: '',
      descriptionBn: '',
      usage: '',
      usageBn: '',
      benefits: '',
      benefitsBn: '',
      application: '',
      applicationBn: '',
      safety: '',
      safetyBn: '',
      image: ''
    })
    setEditingProductId(null)
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    if (!productForm.name || !productForm.genericName || !productForm.category || !productForm.description || !productForm.usage) {
      setProductStatus(language === 'en' ? 'Please fill all required fields' : 'প্রয়োজনীয় সব ঘর পূরণ করুন')
      return
    }
    try {
      setSavingProduct(true)
      setProductStatus('')
      const method = editingProductId ? 'PUT' : 'POST'
      const url = editingProductId
        ? `${API_BASE}/api/products/${editingProductId}`
        : `${API_BASE}/api/products`

      // Prepare data to send - ensure all fields are included
      const dataToSend = {
        productId: productForm.productId || '',
        variants: productForm.variants || [],
        price: productForm.price || '',
        priceCategory: productForm.priceCategory || 'single',
        name: productForm.name || '',
        nameBn: productForm.nameBn || '',
        genericName: productForm.genericName || '',
        genericNameBn: productForm.genericNameBn || '',
        category: productForm.category || 'Herbicide',
        categoryBn: productForm.categoryBn || '',
        description: productForm.description || '',
        descriptionBn: productForm.descriptionBn || '',
        usage: productForm.usage || '',
        usageBn: productForm.usageBn || '',
        benefits: productForm.benefits || '',
        benefitsBn: productForm.benefitsBn || '',
        application: productForm.application || '',
        applicationBn: productForm.applicationBn || '',
        safety: productForm.safety || '',
        safetyBn: productForm.safetyBn || '',
        image: productForm.image || ''
      }

      console.log('Saving product:', { 
        method, 
        url, 
        productForm: { 
          ...dataToSend, 
          image: dataToSend.image ? (dataToSend.image.length > 100 ? '[...base64...]' : dataToSend.image) : '' 
        } 
      })

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })

      const data = await res.json()
      console.log('Product save response:', { status: res.status, ok: res.ok, data })

      if (!res.ok) {
        const errorMsg = data.message || 'Failed to save product'
        console.error('Product save error:', errorMsg, data)
        setProductStatus(language === 'en' ? errorMsg : errorMsg)
        return
      }

      const saved = data.data
      setProducts((prev) => {
        if (editingProductId) {
          return prev.map((item) => (item._id === editingProductId ? saved : item))
        }
        return [saved, ...prev]
      })
      setProductStatus(language === 'en' ? (editingProductId ? 'Product updated' : 'Product added') : 'পণ্য সংরক্ষণ সম্পন্ন')
      resetProductForm()
      setShowProductForm(false)
      // Dispatch event to notify other pages of product update
      window.dispatchEvent(new Event('contentUpdated'))
    } catch (err) {
      console.error('Failed to save product', err)
      setProductStatus(language === 'en' ? `Failed to save product: ${err.message}` : `পণ্য সংরক্ষণ ব্যর্থ: ${err.message}`)
    } finally {
      setSavingProduct(false)
    }
  }

  const handleEditProduct = (product) => {
    if (!product) return
    setProductForm({
      productId: product.productId || '',
      variants: Array.isArray(product.variants) ? product.variants.map(v => ({ ...v, price: v.price || 0 })) : [],
      price: product.price || '',
      priceCategory: product.priceCategory || 'single',
      name: product.name || '',
      nameBn: product.nameBn || '',
      genericName: product.genericName || '',
      genericNameBn: product.genericNameBn || '',
      category: product.category || 'Herbicide',
      categoryBn: product.categoryBn || '',
      description: product.description || '',
      descriptionBn: product.descriptionBn || '',
      usage: product.usage || '',
      usageBn: product.usageBn || '',
      benefits: product.benefits || '',
      benefitsBn: product.benefitsBn || '',
      application: product.application || '',
      applicationBn: product.applicationBn || '',
      safety: product.safety || '',
      safetyBn: product.safetyBn || '',
      image: product.image || ''
    })
    setEditingProductId(product._id || null)
    setShowProductForm(true)
    setProductStatus('')
  }

  const addVariant = () => {
    setProductForm({
      ...productForm,
      variants: [...(productForm.variants || []), { name: '', value: '', price: 0 }]
    })
  }

  const removeVariant = (index) => {
    const newVariants = [...(productForm.variants || [])]
    newVariants.splice(index, 1)
    setProductForm({ ...productForm, variants: newVariants })
  }

  const updateVariant = (index, field, value) => {
    const newVariants = [...(productForm.variants || [])]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setProductForm({ ...productForm, variants: newVariants })
  }

  const handleDeleteProduct = async (productId) => {
    if (!productId) return
    const confirmed = window.confirm(language === 'en' ? 'Delete this product?' : 'এই পণ্যটি মুছবেন?')
    if (!confirmed) return
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}`, { method: 'DELETE' })
      if (!res.ok) {
        throw new Error('Failed to delete product')
      }
      setProducts((prev) => prev.filter((item) => item._id !== productId))
      setProductStatus(language === 'en' ? 'Product deleted' : 'পণ্য মুছে ফেলা হয়েছে')
      // Dispatch event to notify other pages of product deletion
      window.dispatchEvent(new Event('contentUpdated'))
    } catch (err) {
      console.error('Failed to delete product', err)
      setProductStatus(language === 'en' ? 'Delete failed' : 'মুছে ফেলা ব্যর্থ')
    }
  }

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
          postingArea: editingEmployeeData.postingArea,
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

  const handleAddDealer = async (e) => {
    e.preventDefault()
    const finalDealerId = newDealer.dealerId || getNextDealerId()
    if (!newDealer.name) {
      setDealerStatus(language === 'en' ? 'Name is required' : 'নাম প্রয়োজন')
      return
    }
    try {
      setDealerStatus(language === 'en' ? 'Saving...' : 'সংরক্ষণ করা হচ্ছে...')
      const selectedEmp = employees.find((emp) => String(emp._id) === String(newDealer.assignedTo))
      const res = await fetch(`${API_BASE}/api/dealers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId: finalDealerId,
          name: newDealer.name,
          phone: newDealer.phone,
          email: newDealer.email,
          address: newDealer.address,
          photo: newDealer.photo,
          nid: newDealer.nid,
          tradeLicense: newDealer.tradeLicense,
          pesticideLicense: newDealer.pesticideLicense,
          area: newDealer.area,
          agreement: newDealer.agreement,
          assignedTo: newDealer.assignedTo || undefined,
          assignedToName: selectedEmp?.name || newDealer.assignedToName || '',
          assignedToId: selectedEmp?.employeeId || newDealer.assignedToId || ''
        })
      })
      if (!res.ok) throw new Error('Failed to save dealer')
      const data = await res.json()
      const saved = data.data
      setDealers((prev) => [saved, ...prev])
      setDealerStatus(language === 'en' ? 'Dealer saved' : 'ডিলার সংরক্ষিত')
      setNewDealer({
        dealerId: getNextDealerId(),
        name: '',
        phone: '',
        email: '',
        address: '',
        photo: '',
        nid: '',
        tradeLicense: '',
        pesticideLicense: '',
        area: '',
        agreement: '',
        assignedTo: '',
        assignedToName: '',
        assignedToId: ''
      })
      setShowDealerForm(false)
    } catch (err) {
      console.error('Dealer save failed', err)
      setDealerStatus(language === 'en' ? 'Save failed' : 'সংরক্ষণ ব্যর্থ')
    }
  }

  const handleSaveDealerEdit = async () => {
    if (!editingDealerData || !viewingDealer?._id) return
    try {
      setSavingDealer(true)
      const selectedEmp = employees.find((emp) => String(emp._id) === String(editingDealerData.assignedTo))
      const res = await fetch(`${API_BASE}/api/dealers/${viewingDealer._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId: editingDealerData.dealerId,
          name: editingDealerData.name,
          phone: editingDealerData.phone,
          email: editingDealerData.email,
          address: editingDealerData.address,
          photo: editingDealerData.photo,
          nid: editingDealerData.nid,
          tradeLicense: editingDealerData.tradeLicense,
          pesticideLicense: editingDealerData.pesticideLicense,
          area: editingDealerData.area,
          agreement: editingDealerData.agreement,
          assignedTo: editingDealerData.assignedTo || undefined,
          assignedToName: selectedEmp?.name || editingDealerData.assignedToName || '',
          assignedToId: selectedEmp?.employeeId || editingDealerData.assignedToId || ''
        })
      })

      if (!res.ok) throw new Error('Failed to update dealer')

      const updated = await res.json()
      setViewingDealer(updated.data)
      setDealers((prev) =>
        prev.map((d) => (d._id === viewingDealer._id ? updated.data : d))
      )
      setIsEditingDealer(false)
      setEditingDealerData(null)
      setSavingDealer(false)
    } catch (err) {
      console.error('Dealer update failed', err)
      alert(language === 'en' ? 'Failed to update dealer' : 'ডিলার আপডেট ব্যর্থ')
      setSavingDealer(false)
    }
  }

  const handleDeleteDealer = async () => {
    if (!viewingDealer?._id) return
    if (!window.confirm(language === 'en' ? 'Delete this dealer?' : 'এই ডিলারকে মুছবেন?')) return

    try {
      const res = await fetch(`${API_BASE}/api/dealers/${viewingDealer._id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete dealer')
      setDealers((prev) => prev.filter((d) => d._id !== viewingDealer._id))
      setViewingDealer(null)
      setIsEditingDealer(false)
      setEditingDealerData(null)
    } catch (err) {
      console.error('Dealer delete failed', err)
      alert(language === 'en' ? 'Failed to delete dealer' : 'ডিলার মুছে ফেলতে ব্যর্থ')
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
            designation: data.designation || '',
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

  // Reload profile after authentication toggles
  useEffect(() => {
    if (isAuthenticated) {
      if (isEmployee && loggedInUserId) {
        loadUserProfile('employee', loggedInUserId)
      } else {
        loadUserProfile('admin')
      }
    }
  }, [isAuthenticated, isEmployee, loggedInUserId])

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
          // Sync profile data immediately on login, preserving designation if present
          setProfileData((prev) => ({
            ...prev,
            name: data.name || prev.name || 'Admin',
            email: data.email || prev.email || 'admin@example.com',
            phone: data.phone || prev.phone || '+880 1234 567890',
            address: data.address || prev.address || 'Dhaka, Bangladesh',
            photo: data.photo || prev.photo || '',
            role: 'Admin',
            designation: data.designation ?? prev.designation ?? '',
            department: ''
          }))
          // Load admin profile
          loadUserProfile('admin')
          setIsAuthenticated(true)
          persistAuthState({
            isEmployee: false,
            userRole: 'Admin',
            loggedInUser: data.name || '',
            loggedInUserId: null
          })
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
        persistAuthState({
          isEmployee: true,
          userRole: data.role,
          loggedInUser: data.name || '',
          loggedInUserId: data.id || null
        })
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
          setProfileData((prev) => ({
            ...prev,
            name: data.name || prev.name || 'Admin',
            email: data.email || prev.email || 'admin@example.com',
            phone: data.phone || prev.phone || '+880 1234 567890',
            address: data.address || prev.address || 'Dhaka, Bangladesh',
            photo: data.photo || prev.photo || '',
            role: 'Admin',
            designation: data.designation ?? prev.designation ?? '',
            department: ''
          }))
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
  const productCount = products.length || t.products.items.length
  const stats = {
    totalProducts: productCount,
    totalBlogs: t.blog.featured.length + t.blog.list.length,
    totalContacts: 24,
    recentActivity: [
      { type: 'product', action: 'Updated', item: 'Herbicide Pro', time: '2 hours ago' },
      { type: 'blog', action: 'Published', item: 'Expert Tips for Maximizing Crop Yields', time: '1 day ago' },
      { type: 'contact', action: 'New message from', item: 'Md. Rafiq Hasan', time: '2 days ago' }
    ]
  }

  const productList = products.length ? products : t.products.items
  const filteredProducts = productList.filter((product) => {
    if (!productSearch.trim()) return true
    const query = productSearch.toLowerCase().trim()
    return (
      (product.productId || '').toLowerCase().includes(query) ||
      (product.name || '').toLowerCase().includes(query) ||
      (product.genericName || '').toLowerCase().includes(query) ||
      (product.description || '').toLowerCase().includes(query) ||
      (product.usage || '').toLowerCase().includes(query) ||
      (product.category || '').toLowerCase().includes(query)
    )
  })

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
              <div className="admin-tab-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 className="admin-page-title" style={{ flex: 1 }}>{adminContent.manageProducts}</h1>
                {(userRole || '').toLowerCase() === 'admin' && (
                  <button 
                    className="admin-add-btn"
                    onClick={() => {
                      resetProductForm()
                      setShowProductForm(true)
                      setProductStatus('')
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {adminContent.addNew}
                  </button>
                )}
              </div>
              {productStatus && (
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: productStatus.toLowerCase().includes('fail') || productStatus.toLowerCase().includes('ব্যর্থ')
                      ? '#fef2f2'
                      : '#ecfdf3',
                    color: productStatus.toLowerCase().includes('fail') || productStatus.toLowerCase().includes('ব্যর্থ')
                      ? '#b91c1c'
                      : '#166534',
                    border: productStatus.toLowerCase().includes('fail') || productStatus.toLowerCase().includes('ব্যর্থ')
                      ? '1px solid #fecaca'
                      : '1px solid #bbf7d0',
                    fontWeight: 600
                  }}
                >
                  {productStatus}
                </div>
              )}
              {showProductForm && (
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
                  resetProductForm()
                  setShowProductForm(false)
                  setProductStatus('')
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
                      <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                          {editingProductId
                            ? (language === 'en' ? 'Edit Product' : 'পণ্য সম্পাদনা')
                            : (language === 'en' ? 'Add Product' : 'পণ্য যোগ করুন')}
                        </h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 600 }}>
                          {language === 'en' ? 'Fill in product details and save' : 'পণ্যের বিবরণ পূরণ করুন এবং সংরক্ষণ করুন'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          resetProductForm()
                          setShowProductForm(false)
                          setProductStatus('')
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

                    <div style={{ position: 'relative', zIndex: 1 }}>
                    {productStatus && (
                      <div style={{
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        borderRadius: '0.5rem',
                        border: productStatus.includes('error') || productStatus.includes('Failed') ? '1px solid #fecaca' : '1px solid #bbf7d0',
                        backgroundColor: productStatus.includes('error') || productStatus.includes('Failed') ? '#fef2f2' : '#ecfdf3',
                        color: productStatus.includes('error') || productStatus.includes('Failed') ? '#b91c1c' : '#065f46',
                        fontWeight: 700
                      }}>
                        {productStatus}
                      </div>
                    )}
                    <form onSubmit={handleSaveProduct}>
                      <div className="admin-form-grid">
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Product ID' : 'পণ্য আইডি'}</label>
                          <input
                            type="text"
                            value={productForm.productId || ''}
                            onChange={(e) => setProductForm({ ...productForm, productId: e.target.value })}
                            placeholder={language === 'en' ? 'Auto-generated (BP001, BP002...)' : 'স্বয়ংক্রিয়ভাবে তৈরি (BP001, BP002...)'}
                            style={{ backgroundColor: editingProductId ? 'white' : '#f3f4f6', cursor: editingProductId ? 'text' : 'not-allowed' }}
                            readOnly={!editingProductId}
                            title={language === 'en' ? 'Product ID is auto-generated for new products' : 'নতুন পণ্যের জন্য পণ্য আইডি স্বয়ংক্রিয়ভাবে তৈরি হয়'}
                          />
                          {!editingProductId && (
                            <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                              {language === 'en' ? 'Will be auto-generated as BP001, BP002, etc.' : 'BP001, BP002 ইত্যাদি হিসাবে স্বয়ংক্রিয়ভাবে তৈরি হবে'}
                            </small>
                          )}
                        </div>
                        <div className="admin-form-group">
                          <label>{adminContent.productName} {language === 'en' ? '(English)' : '(ইংরেজি)'}</label>
                          <input
                            type="text"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{adminContent.productName} {language === 'en' ? '(Bangla)' : '(বাংলা)'}</label>
                          <input
                            type="text"
                            value={productForm.nameBn}
                            onChange={(e) => setProductForm({ ...productForm, nameBn: e.target.value })}
                            placeholder={language === 'en' ? 'Product name in Bangla (optional)' : 'বাংলায় পণ্যের নাম (ঐচ্ছিক)'}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Generic Name' : 'জেনেরিক নাম'} {language === 'en' ? '(English)' : '(ইংরেজি)'}</label>
                          <input
                            type="text"
                            value={productForm.genericName}
                            onChange={(e) => setProductForm({ ...productForm, genericName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Generic Name' : 'জেনেরিক নাম'} {language === 'en' ? '(Bangla)' : '(বাংলা)'}</label>
                          <input
                            type="text"
                            value={productForm.genericNameBn}
                            onChange={(e) => setProductForm({ ...productForm, genericNameBn: e.target.value })}
                            placeholder={language === 'en' ? 'Generic name in Bangla (optional)' : 'বাংলায় জেনেরিক নাম (ঐচ্ছিক)'}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{adminContent.category} {language === 'en' ? '(English)' : '(ইংরেজি)'}</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                          >
                            {['Herbicide', 'Fungicide', 'Insecticide', 'Growth Promoter', 'Fertilizer', 'Organic'].map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="admin-form-group">
                          <label>{adminContent.category} {language === 'en' ? '(Bangla)' : '(বাংলা)'}</label>
                          <input
                            type="text"
                            value={productForm.categoryBn}
                            onChange={(e) => setProductForm({ ...productForm, categoryBn: e.target.value })}
                            placeholder={language === 'en' ? 'Category in Bangla (optional)' : 'বাংলায় ক্যাটাগরি (ঐচ্ছিক)'}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Price Category' : 'মূল্য বিভাগ'}</label>
                          <select
                            value={productForm.priceCategory}
                            onChange={(e) => setProductForm({ ...productForm, priceCategory: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                          >
                            <option value="single">{language === 'en' ? 'Single Price' : 'একক মূল্য'}</option>
                            <option value="per_variant">{language === 'en' ? 'Per Variant' : 'প্রতি ভ্যারিয়েন্ট'}</option>
                          </select>
                        </div>
                        {productForm.priceCategory === 'single' && (
                          <div className="admin-form-group">
                            <label>{language === 'en' ? 'Price' : 'মূল্য'}</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={productForm.price || ''}
                              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                              placeholder={language === 'en' ? '0.00' : '০.০০'}
                            />
                          </div>
                        )}
                        <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                          <label>{language === 'en' ? 'Variants' : 'ভ্যারিয়েন্ট'}</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {(productForm.variants || []).map((variant, index) => (
                              <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <input
                                  type="text"
                                  value={variant.name || ''}
                                  onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                  placeholder={language === 'en' ? 'Variant name (e.g., Size, Color)' : 'ভ্যারিয়েন্ট নাম (যেমন, আকার, রঙ)'}
                                  style={{ flex: 1, minWidth: '150px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                                />
                                <input
                                  type="text"
                                  value={variant.value || ''}
                                  onChange={(e) => updateVariant(index, 'value', e.target.value)}
                                  placeholder={language === 'en' ? 'Variant value (e.g., Large, Red)' : 'ভ্যারিয়েন্ট মান (যেমন, বড়, লাল)'}
                                  style={{ flex: 1, minWidth: '150px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                                />
                                {productForm.priceCategory === 'per_variant' && (
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={variant.price || ''}
                                    onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                                    placeholder={language === 'en' ? 'Price' : 'মূল্য'}
                                    style={{ width: '120px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeVariant(index)}
                                  style={{
                                    padding: '0.5rem 0.75rem',
                                    backgroundColor: '#fee2e2',
                                    color: '#b91c1c',
                                    border: '1px solid #fecaca',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                  }}
                                >
                                  {language === 'en' ? 'Remove' : 'মুছুন'}
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addVariant}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#dbeafe',
                                color: '#1e40af',
                                border: '1px dashed #93c5fd',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontWeight: 600,
                                alignSelf: 'flex-start'
                              }}
                            >
                              + {language === 'en' ? 'Add Variant' : 'ভ্যারিয়েন্ট যোগ করুন'}
                            </button>
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label>{adminContent.description} {language === 'en' ? '(English)' : '(ইংরেজি)'}</label>
                          <textarea
                            rows={3}
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{adminContent.description} {language === 'en' ? '(Bangla)' : '(বাংলা)'}</label>
                          <textarea
                            rows={3}
                            value={productForm.descriptionBn}
                            onChange={(e) => setProductForm({ ...productForm, descriptionBn: e.target.value })}
                            placeholder={language === 'en' ? 'Description in Bangla (optional)' : 'বাংলায় বিবরণ (ঐচ্ছিক)'}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Usage' : 'ব্যবহার'} {language === 'en' ? '(English)' : '(ইংরেজি)'}</label>
                          <textarea
                            rows={3}
                            value={productForm.usage}
                            onChange={(e) => setProductForm({ ...productForm, usage: e.target.value })}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Usage' : 'ব্যবহার'} {language === 'en' ? '(Bangla)' : '(বাংলা)'}</label>
                          <textarea
                            rows={3}
                            value={productForm.usageBn}
                            onChange={(e) => setProductForm({ ...productForm, usageBn: e.target.value })}
                            placeholder={language === 'en' ? 'Usage instructions in Bangla (optional)' : 'বাংলায় ব্যবহারের নির্দেশাবলী (ঐচ্ছিক)'}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Benefits' : 'সুবিধা'} {language === 'en' ? '(English)' : '(ইংরেজি)'}</label>
                          <textarea
                            rows={4}
                            value={productForm.benefits}
                            onChange={(e) => setProductForm({ ...productForm, benefits: e.target.value })}
                            placeholder={language === 'en' ? 'List the key benefits of this product...' : 'এই পণ্যের মূল সুবিধাগুলি তালিকাভুক্ত করুন...'}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Benefits' : 'সুবিধা'} {language === 'en' ? '(Bangla)' : '(বাংলা)'}</label>
                          <textarea
                            rows={4}
                            value={productForm.benefitsBn}
                            onChange={(e) => setProductForm({ ...productForm, benefitsBn: e.target.value })}
                            placeholder={language === 'en' ? 'Benefits in Bangla (optional)' : 'বাংলায় সুবিধা (ঐচ্ছিক)'}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Application' : 'আবেদন'} {language === 'en' ? '(English)' : '(ইংরেজি)'}</label>
                          <textarea
                            rows={4}
                            value={productForm.application}
                            onChange={(e) => setProductForm({ ...productForm, application: e.target.value })}
                            placeholder={language === 'en' ? 'Application instructions and guidelines...' : 'আবেদনের নির্দেশাবলী এবং নির্দেশিকা...'}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Application' : 'আবেদন'} {language === 'en' ? '(Bangla)' : '(বাংলা)'}</label>
                          <textarea
                            rows={4}
                            value={productForm.applicationBn}
                            onChange={(e) => setProductForm({ ...productForm, applicationBn: e.target.value })}
                            placeholder={language === 'en' ? 'Application instructions in Bangla (optional)' : 'বাংলায় আবেদনের নির্দেশাবলী (ঐচ্ছিক)'}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Safety' : 'নিরাপত্তা'} {language === 'en' ? '(English)' : '(ইংরেজি)'}</label>
                          <textarea
                            rows={4}
                            value={productForm.safety}
                            onChange={(e) => setProductForm({ ...productForm, safety: e.target.value })}
                            placeholder={language === 'en' ? 'Safety precautions and guidelines...' : 'নিরাপত্তা সতর্কতা এবং নির্দেশিকা...'}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Safety' : 'নিরাপত্তা'} {language === 'en' ? '(Bangla)' : '(বাংলা)'}</label>
                          <textarea
                            rows={4}
                            value={productForm.safetyBn}
                            onChange={(e) => setProductForm({ ...productForm, safetyBn: e.target.value })}
                            placeholder={language === 'en' ? 'Safety precautions in Bangla (optional)' : 'বাংলায় নিরাপত্তা সতর্কতা (ঐচ্ছিক)'}
                          />
                        </div>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Image' : 'ছবি'}</label>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={productForm.image}
                              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                              placeholder="https://... (optional)"
                            />
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                              <label
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  padding: '0.5rem 0.75rem',
                                  border: '1px dashed #cbd5e1',
                                  borderRadius: '0.375rem',
                                  background: '#f8fafc',
                                  color: '#0f172a',
                                  cursor: 'pointer',
                                  fontWeight: 600
                                }}
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    try {
                                      const base64 = await fileToBase64(file)
                                      setProductForm((prev) => ({ ...prev, image: base64 }))
                                      setProductStatus('')
                                    } catch (err) {
                                      console.error('Product image upload failed', err)
                                      setProductStatus(language === 'en' ? 'Image upload failed' : 'ছবি আপলোড ব্যর্থ')
                                    }
                                  }}
                                />
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {language === 'en' ? 'Upload image' : 'ছবি আপলোড করুন'}
                              </label>
                              {productForm.image && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <img
                                    src={productForm.image}
                                    alt="Product preview"
                                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                                    onError={(e) => { e.target.style.display = 'none' }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setProductForm((prev) => ({ ...prev, image: '' }))}
                                    style={{
                                      padding: '0.4rem 0.65rem',
                                      background: '#fee2e2',
                                      color: '#b91c1c',
                                      border: '1px solid #fecaca',
                                      borderRadius: '0.375rem',
                                      fontWeight: 600,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {language === 'en' ? 'Remove' : 'মুছুন'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <button
                          type="submit"
                          disabled={savingProduct}
                          style={{
                            padding: '0.65rem 1.2rem',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontWeight: 700,
                            cursor: savingProduct ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {savingProduct
                            ? (language === 'en' ? 'Saving...' : 'সংরক্ষণ হচ্ছে...')
                            : adminContent.save}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            resetProductForm()
                            setShowProductForm(false)
                            setProductStatus('')
                          }}
                          style={{
                            padding: '0.65rem 1.2rem',
                            backgroundColor: '#e5e7eb',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            borderRadius: '0.375rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {adminContent.cancel}
                        </button>
                      </div>
                    </form>
                    </div>
                  </div>
                </div>
              )}
              <div className="admin-table-container">
                <div className="admin-search-bar">
                  <input 
                    type="text" 
                    placeholder={adminContent.search} 
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                  />
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{language === 'en' ? 'Product ID' : 'পণ্য আইডি'}</th>
                      <th>{adminContent.productName}</th>
                      <th>{adminContent.category}</th>
                      <th>{language === 'en' ? 'Price' : 'মূল্য'}</th>
                      <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length ? filteredProducts.map((product, index) => {
                      const hasVariants = product.priceCategory === 'per_variant' && Array.isArray(product.variants) && product.variants.length > 0
                      const displayPrice = hasVariants ? null : (product.price || 0)
                      
                      return (
                        <tr key={product._id || product.name || index}>
                          <td>{product.productId || '-'}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                          <td>
                            {hasVariants ? (
                              <select 
                                style={{
                                  padding: '0.4rem 0.6rem',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.875rem',
                                  backgroundColor: 'white',
                                  cursor: 'pointer',
                                  minWidth: '120px'
                                }}
                                onChange={(e) => {
                                  // Display only, not editable
                                  e.target.blur()
                                }}
                              >
                                <option value="">{language === 'en' ? 'Select variant' : 'ভ্যারিয়েন্ট নির্বাচন করুন'}</option>
                                {product.variants.map((variant, vIndex) => (
                                  <option key={vIndex} value={variant.value}>
                                    {variant.name || variant.value}: ৳{variant.price || 0}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span style={{ fontWeight: 600, color: '#16a34a' }}>
                                ৳{displayPrice.toFixed(2)}
                              </span>
                            )}
                          </td>
                        <td>
                          <div className="admin-action-buttons">
                              <button 
                                className="admin-action-btn edit"
                                style={{ backgroundColor: '#e0e7ff', color: '#1d4ed8' }}
                                onClick={() => setViewingProduct(product)}
                              >
                                {language === 'en' ? 'View' : 'দেখুন'}
                              </button>
                          </div>
                        </td>
                      </tr>
                      )
                    }) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '1.5rem' }}>
                          {adminContent.noData}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Product Details Card */}
              {viewingProduct && (
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
                }} onClick={() => setViewingProduct(null)}>
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
                      <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                          {language === 'en' ? 'Product Details' : 'পণ্যের বিবরণ'}
                        </h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 600 }}>
                          {viewingProduct.productId || viewingProduct.name || 'N/A'}
                        </p>
                      </div>
                      <button
                        onClick={() => setViewingProduct(null)}
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', position: 'relative', zIndex: 1 }}>
                      {/* Product ID */}
                      <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                        <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                          {language === 'en' ? 'Product ID' : 'পণ্য আইডি'}
                        </label>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                          {viewingProduct.productId || 'N/A'}
                        </p>
                      </div>

                      {/* Product Name */}
                      <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                        <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                          {language === 'en' ? 'Product Name' : 'পণ্যের নাম'}
                        </label>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingProduct.name || 'N/A'}
                        </p>
                      </div>

                      {/* Category */}
                      <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                        <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                          {language === 'en' ? 'Category' : 'বিভাগ'}
                        </label>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingProduct.category || 'N/A'}
                        </p>
                      </div>

                      {/* Price Category */}
                      <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                        <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                          {language === 'en' ? 'Price Category' : 'মূল্যের বিভাগ'}
                        </label>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                          {viewingProduct.priceCategory === 'per_variant' ? (language === 'en' ? 'Per Variant' : 'প্রতি ভ্যারিয়েন্ট') : (language === 'en' ? 'Single Price' : 'একক মূল্য')}
                        </p>
                      </div>

                      {/* Price */}
                      {viewingProduct.priceCategory === 'single' && (
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Price' : 'মূল্য'}
                          </label>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: 600, color: '#16a34a' }}>
                            ৳{parseFloat(viewingProduct.price || 0).toFixed(2)}
                          </p>
                        </div>
                      )}

                      {/* Generic Name */}
                      {(viewingProduct.genericName || viewingProduct.genericNameBn) && (
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Generic Name' : 'জেনেরিক নাম'}
                          </label>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                            {language === 'en' ? (viewingProduct.genericName || 'N/A') : (viewingProduct.genericNameBn || viewingProduct.genericName || 'N/A')}
                          </p>
                        </div>
                      )}

                      {/* Description */}
                      {(viewingProduct.description || viewingProduct.descriptionBn) && (
                        <div style={{ gridColumn: '1 / -1', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Description' : 'বিবরণ'}
                          </label>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827', whiteSpace: 'pre-wrap' }}>
                            {language === 'en' ? (viewingProduct.description || 'N/A') : (viewingProduct.descriptionBn || viewingProduct.description || 'N/A')}
                          </p>
                        </div>
                      )}

                      {/* Variants Table (if per_variant) */}
                      {viewingProduct.priceCategory === 'per_variant' && viewingProduct.variants && Array.isArray(viewingProduct.variants) && viewingProduct.variants.length > 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, marginBottom: '0.75rem', display: 'block' }}>
                            {language === 'en' ? 'Variants' : 'ভ্যারিয়েন্ট'}
                          </label>
                          <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#fff' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                    {language === 'en' ? 'Name' : 'নাম'}
                                  </th>
                                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                    {language === 'en' ? 'Value' : 'মান'}
                                  </th>
                                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                    {language === 'en' ? 'Price' : 'মূল্য'}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {viewingProduct.variants.map((variant, idx) => (
                                  <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827' }}>
                                      {variant.name || '-'}
                                    </td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827' }}>
                                      {variant.value || '-'}
                                    </td>
                                    <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827', fontWeight: 600, textAlign: 'right' }}>
                                      ৳{parseFloat(variant.price || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                        </div>
                      )}

                      {/* Product Image */}
                      {viewingProduct.image && (
                        <div style={{ gridColumn: '1 / -1', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, marginBottom: '0.75rem', display: 'block' }}>
                            {language === 'en' ? 'Product Image' : 'পণ্যের ছবি'}
                          </label>
                          <img 
                            src={viewingProduct.image} 
                            alt={viewingProduct.name}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '300px',
                              borderRadius: '0.5rem',
                              border: '2px solid #e5e7eb'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ position: 'relative', display: 'flex', gap: '0.75rem', marginTop: '1.5rem', zIndex: 1 }}>
                      {(userRole || '').toLowerCase() === 'admin' && (
                        <>
                          <button
                            onClick={() => {
                              handleEditProduct(viewingProduct)
                              setViewingProduct(null)
                            }}
                            style={{
                              padding: '0.5rem 1.5rem',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              fontWeight: 700,
                              boxShadow: '0 10px 20px rgba(59,130,246,0.35)'
                            }}
                          >
                            {adminContent.edit}
                          </button>
                          {viewingProduct._id && (
                            <button
                              onClick={async () => {
                                if (window.confirm(language === 'en' ? 'Are you sure you want to delete this product?' : 'আপনি কি এই পণ্যটি মুছতে চান?')) {
                                  await handleDeleteProduct(viewingProduct._id)
                                  setViewingProduct(null)
                                }
                              }}
                              style={{
                                padding: '0.5rem 1.5rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 700,
                                boxShadow: '0 10px 20px rgba(239,68,68,0.35)'
                              }}
                            >
                              {adminContent.delete}
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => setViewingProduct(null)}
                        style={{
                          padding: '0.5rem 1.5rem',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        {language === 'en' ? 'Close' : 'বন্ধ করুন'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
              
              {showPreview ? (
                <div className="admin-preview-container">
                  <div className="admin-preview-header">
                    <div className="admin-preview-controls">
                      <button 
                        className={`admin-preview-nav-btn ${editMode ? 'active' : ''}`}
                        onClick={() => setEditMode(!editMode)}
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
                        onClick={() => { setPreviewUrl('/'); refreshPreview() }}
                      >
                        {language === 'en' ? 'Home' : 'হোম'}
                      </button>
                      <button 
                        className="admin-preview-nav-btn"
                        onClick={() => { setPreviewUrl('/about'); refreshPreview() }}
                      >
                        {language === 'en' ? 'About' : 'আমাদের সম্পর্কে'}
                      </button>
                      <button 
                        className="admin-preview-nav-btn"
                        onClick={() => { setPreviewUrl('/product'); refreshPreview() }}
                      >
                        {language === 'en' ? 'Products' : 'পণ্য'}
                      </button>
                      <button 
                        className="admin-preview-nav-btn"
                        onClick={() => { setPreviewUrl('/contact'); refreshPreview() }}
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
              ) : null}

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
              <div className="admin-settings-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Profile summary */}
                <div className="admin-settings-card" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.65)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 25px 60px -18px rgba(15,23,42,0.35)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  borderRadius: '18px'
                }}>
                  <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e5e7eb', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {profileData.photo ? (
                        <img src={profileData.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                      <div style={{ fontSize: '3rem', color: '#64748b', fontWeight: 700 }}>
                          {(profileData.name || 'A').charAt(0)}
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>{profileData.name || 'Admin'}</div>
                      {profileData.designation ? (
                        <div style={{ color: '#475569', fontWeight: 600, marginTop: '0.15rem' }}>{profileData.designation}</div>
                      ) : null}
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontWeight: 600 }}>{language === 'en' ? 'Email' : 'ইমেইল'}</div>
                      <div style={{ color: '#0f172a' }}>{profileData.email}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontWeight: 600 }}>{language === 'en' ? 'Phone' : 'ফোন'}</div>
                      <div style={{ color: '#0f172a' }}>{profileData.phone}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280', fontWeight: 600 }}>{language === 'en' ? 'Address' : 'ঠিকানা'}</div>
                      <div style={{ color: '#0f172a' }}>{profileData.address}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0, width: 200 }}>
                    <label className="admin-upload-btn" style={{ justifyContent: 'center', width: '100%' }}>
                      {language === 'en' ? 'Upload Photo' : 'ছবি আপলোড করুন'}
                      <input type="file" accept="image/*" onChange={handleProfilePhotoFileChange} style={{ display: 'none' }} />
                    </label>
                    <button
                      className="admin-save-btn"
                      onClick={() => setShowEditProfile(true)}
                    >
                      {language === 'en' ? 'Edit Profile' : 'প্রোফাইল সম্পাদনা'}
                    </button>
                    <button
                      className="admin-save-btn"
                      onClick={() => {
                        setShowChangePassword(true)
                          setPasswordForm({ current: '', next: '', confirm: '', status: '' })
                      }}
                    >
                      {language === 'en' ? 'Change Password' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                    </button>
                  </div>
                </div>

                {/* Profile form */}
                {showEditProfile && (
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
                    setShowEditProfile(false)
                    setProfileStatus('')
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
                        <div>
                          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                            {language === 'en' ? 'Edit Profile' : 'প্রোফাইল সম্পাদনা'}
                          </h2>
                          <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 600 }}>
                            {language === 'en' ? 'Update your profile information' : 'আপনার প্রোফাইল তথ্য আপডেট করুন'}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setShowEditProfile(false)
                            setProfileStatus('')
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

                      <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Name' : 'নাম'}</label>
                      <input type="text" value={profileData.name} onChange={(e) => handleProfileFieldChange('name', e.target.value)} />
                    </div>
                      <div className="admin-form-group">
                        <label>{language === 'en' ? 'Designation' : 'পদবি'}</label>
                        <input
                          type="text"
                          value={profileData.designation || ''}
                          onChange={(e) => handleProfileFieldChange('designation', e.target.value)}
                        />
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
                    </div>
                    {profileStatus && (
                      <div style={{
                        padding: '0.75rem',
                        marginTop: '1rem',
                        borderRadius: '0.5rem',
                        border: profileStatus.includes('fail') || profileStatus.includes('ব্যর্থ') ? '1px solid #fecaca' : '1px solid #bbf7d0',
                        backgroundColor: profileStatus.includes('fail') || profileStatus.includes('ব্যর্থ') ? '#fef2f2' : '#ecfdf3',
                        color: profileStatus.includes('fail') || profileStatus.includes('ব্যর্থ') ? '#b91c1c' : '#065f46',
                        fontWeight: 700
                      }}>
                        {profileStatus}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button className="admin-save-btn" onClick={handleSaveProfile}>{adminContent.save}</button>
                      <button
                        className="admin-remove-btn"
                        onClick={() => {
                          setShowEditProfile(false)
                          setProfileStatus('')
                        }}
                      >
                        {language === 'en' ? 'Cancel' : 'বাতিল'}
                      </button>
                  </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Change password */}
                {showChangePassword && (
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
                    setShowChangePassword(false)
                    setPasswordForm({ current: '', next: '', confirm: '', status: '' })
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
                        <div>
                          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                            {adminContent.changePassword}
                          </h2>
                          <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 600 }}>
                            {language === 'en' ? 'Update your password' : 'আপনার পাসওয়ার্ড আপডেট করুন'}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setShowChangePassword(false)
                            setPasswordForm({ current: '', next: '', confirm: '', status: '' })
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

                      <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', background: '#f9fafb' }}>
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
                        <div style={{
                          padding: '0.75rem',
                          marginTop: '1rem',
                          borderRadius: '0.5rem',
                          border: passwordForm.status.toLowerCase().includes('incorrect') || passwordForm.status.toLowerCase().includes('ব্যর্থ') ? '1px solid #fecaca' : '1px solid #bbf7d0',
                          backgroundColor: passwordForm.status.toLowerCase().includes('incorrect') || passwordForm.status.toLowerCase().includes('ব্যর্থ') ? '#fef2f2' : '#ecfdf3',
                          color: passwordForm.status.toLowerCase().includes('incorrect') || passwordForm.status.toLowerCase().includes('ব্যর্থ') ? '#b91c1c' : '#065f46',
                          fontWeight: 700
                        }}>
                      {passwordForm.status}
                    </div>
                  )}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CRM / Dealer Tab */}
          {activeTab === 'crm' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 className="admin-page-title" style={{ flex: 1 }}>{language === 'en' ? 'Dealers' : 'ডিলার'}</h1>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className="admin-add-btn"
                  onClick={() => {
                    setShowDealerForm(true)
                    setDealerStatus('')
                    setNewDealer((prev) => ({
                      ...prev,
                      dealerId: prev.dealerId || getNextDealerId()
                    }))
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {adminContent.addNew}
                </button>
                  <button
                    type="button"
                    onClick={() => loadDealers()}
                    className="admin-add-btn"
                    style={{ backgroundColor: '#e2e8f0', color: '#0f172a' }}
                  >
                    {language === 'en' ? 'Refresh' : 'রিফ্রেশ'}
                  </button>
                </div>
              </div>
              {showDealerForm && (
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
                  setShowDealerForm(false)
                  setDealerStatus('')
                  setNewDealer({
                    dealerId: getNextDealerId(),
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    photo: '',
                    nid: '',
                    tradeLicense: '',
                    pesticideLicense: '',
                    area: '',
                    agreement: '',
                    assignedTo: '',
                    assignedToName: '',
                    assignedToId: ''
                  })
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
                      <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                          {language === 'en' ? 'Add Dealer' : 'ডিলার যোগ করুন'}
                        </h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 600 }}>
                          {language === 'en' ? 'Fill in dealer details and save' : 'ডিলারের বিবরণ পূরণ করুন এবং সংরক্ষণ করুন'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowDealerForm(false)
                          setDealerStatus('')
                          setNewDealer({
                            dealerId: getNextDealerId(),
                            name: '',
                            phone: '',
                            email: '',
                            address: '',
                            photo: '',
                            nid: '',
                            tradeLicense: '',
                            pesticideLicense: '',
                            area: '',
                            agreement: '',
                            assignedTo: '',
                            assignedToName: '',
                            assignedToId: ''
                          })
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

                    <div style={{ position: 'relative', zIndex: 1 }}>
                  {dealerStatus && (
                      <div style={{
                        padding: '0.75rem',
                        marginBottom: '1rem',
                        borderRadius: '0.5rem',
                        border: dealerStatus.includes('required') ? '1px solid #fecaca' : '1px solid #bbf7d0',
                        backgroundColor: dealerStatus.includes('required') ? '#fef2f2' : '#ecfdf3',
                        color: dealerStatus.includes('required') ? '#b91c1c' : '#065f46',
                        fontWeight: 700
                      }}>
                      {dealerStatus}
                    </div>
                  )}
                  <form onSubmit={handleAddDealer} className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Dealer ID' : 'ডিলার আইডি'}</label>
                      <input type="text" value={newDealer.dealerId} onChange={(e) => setNewDealer({ ...newDealer, dealerId: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Dealer Name' : 'ডিলারের নাম'}</label>
                      <input type="text" value={newDealer.name} onChange={(e) => setNewDealer({ ...newDealer, name: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Phone' : 'ফোন'}</label>
                      <input type="tel" value={newDealer.phone} onChange={(e) => setNewDealer({ ...newDealer, phone: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Email' : 'ইমেইল'}</label>
                      <input type="email" value={newDealer.email} onChange={(e) => setNewDealer({ ...newDealer, email: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Address' : 'ঠিকানা'}</label>
                      <textarea value={newDealer.address} onChange={(e) => setNewDealer({ ...newDealer, address: e.target.value })} rows={3} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'NID' : 'এনআইডি'}</label>
                      <input type="text" value={newDealer.nid} onChange={(e) => setNewDealer({ ...newDealer, nid: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Trade License Number' : 'ট্রেড লাইসেন্স নম্বর'}</label>
                      <input type="text" value={newDealer.tradeLicense} onChange={(e) => setNewDealer({ ...newDealer, tradeLicense: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Pesticides License Number' : 'কীটনাশক লাইসেন্স নম্বর'}</label>
                      <input type="text" value={newDealer.pesticideLicense} onChange={(e) => setNewDealer({ ...newDealer, pesticideLicense: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Area' : 'এলাকা'}</label>
                      <input type="text" value={newDealer.area} onChange={(e) => setNewDealer({ ...newDealer, area: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Assign Salesman' : 'সেলসম্যান নির্ধারণ করুন'}</label>
                      <select
                        value={newDealer.assignedTo}
                        onChange={(e) => setNewDealer({
                          ...newDealer,
                          assignedTo: e.target.value,
                          assignedToName: '',
                          assignedToId: ''
                        })}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.95rem'
                        }}
                      >
                        <option value="">{language === 'en' ? 'Select Salesman' : 'সেলসম্যান নির্বাচন করুন'}</option>
                        {salesEmployees.map((emp) => (
                          <option key={emp._id} value={emp._id}>
                            {emp.name} {emp.employeeId ? `(${emp.employeeId})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Photo Upload' : 'ছবি আপলোড'}</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          try {
                            const base64 = await fileToBase64(file)
                            setNewDealer({ ...newDealer, photo: base64 })
                          } catch (err) {
                            console.error('Dealer photo upload failed', err)
                          }
                        }}
                      />
                      {newDealer.photo && (
                        <p style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: '#16a34a' }}>
                          {language === 'en' ? 'Photo ready' : 'ছবি প্রস্তুত'}
                        </p>
                      )}
                    </div>
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Agreement Paper Upload' : 'চুক্তিপত্র আপলোড'}</label>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          try {
                            const base64 = await fileToBase64(file)
                            setNewDealer({ ...newDealer, agreement: base64 })
                          } catch (err) {
                            console.error('Agreement upload failed', err)
                          }
                        }}
                      />
                      {newDealer.agreement && (
                        <p style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: '#16a34a' }}>
                          {language === 'en' ? 'Agreement ready' : 'চুক্তি প্রস্তুত'}
                        </p>
                      )}
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="admin-save-btn">{adminContent.save}</button>
                      <button
                        type="button"
                        className="admin-remove-btn"
                        onClick={() => { 
                          setShowDealerForm(false); 
                          setDealerStatus(''); 
                          setNewDealer({
                            dealerId: getNextDealerId(),
                            name: '',
                            phone: '',
                            email: '',
                            address: '',
                            photo: '',
                            nid: '',
                            tradeLicense: '',
                            pesticideLicense: '',
                            area: '',
                            agreement: '',
                            assignedTo: '',
                            assignedToName: '',
                            assignedToId: ''
                          }) 
                        }}
                      >
                        {language === 'en' ? 'Close' : 'বন্ধ করুন'}
                      </button>
                    </div>
                  </form>
                  </div>
                </div>
                </div>
              )}
              <div className="admin-table-container">
                <div className="admin-search-bar">
                  <input 
                    type="text" 
                    placeholder={language === 'en' ? 'Search dealers...' : 'ডিলার খুঁজুন...'} 
                    value={dealerSearch || ''}
                    onChange={(e) => setDealerSearch(e.target.value)}
                  />
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th 
                        onClick={() => handleSortDealers('dealerId')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Dealer ID' : 'ডিলার আইডি'}
                        {dealerSortField === 'dealerId' && (dealerSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortDealers('name')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Dealer Name' : 'ডিলারের নাম'}
                        {dealerSortField === 'name' && (dealerSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortDealers('phone')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Phone' : 'ফোন'}
                        {dealerSortField === 'phone' && (dealerSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortDealers('email')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Email' : 'ইমেইল'}
                        {dealerSortField === 'email' && (dealerSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortDealers('area')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Area' : 'এলাকা'}
                        {dealerSortField === 'area' && (dealerSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortDealers('salesman')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Salesman' : 'সেলসম্যান'}
                        {dealerSortField === 'salesman' && (dealerSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortDealers('dueAmount')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Due Amount' : 'বকেয়া পরিমাণ'}
                        {dealerSortField === 'dueAmount' && (dealerSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDealers.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                          {adminContent.noData}
                        </td>
                      </tr>
                    ) : (
                      sortedDealers.map((d) => {
                        // Calculate due amount for this dealer (exclude cancelled orders)
                        const dealerOrders = (orders || []).filter(order => 
                          order.dealerId === d.dealerId && order.status !== 'Cancelled'
                        )
                        const dueAmount = dealerOrders.reduce((sum, order) => {
                          const due = order.dueAmount !== undefined 
                            ? parseFloat(order.dueAmount) 
                            : Math.max(0, parseFloat(order.totalPrice || 0) - parseFloat(order.paidAmount || 0))
                          return sum + due
                        }, 0)
                        
                        return (
                          <tr key={d.id}>
                            <td>{d.dealerId}</td>
                            <td>{d.name}</td>
                            <td>{d.phone}</td>
                            <td>{d.email}</td>
                            <td>{d.area}</td>
                            <td>{d.assignedToName || d.assignedToId || '-'}</td>
                            <td style={{ 
                              fontWeight: 700, 
                              color: dueAmount > 0 ? '#c2410c' : '#15803d' 
                            }}>
                              ৳{Number(dueAmount || 0).toLocaleString()}
                            </td>
                            <td style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <button
                                className="admin-add-btn"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.9rem' }}
                                onClick={() => {
                                  setViewingDealer(d)
                                  setIsEditingDealer(false)
                                  setEditingDealerData(null)
                                  // Show dealer details by default, hide orders section
                                  setShowDealerOrders(false)
                                }}
                              >
                                {language === 'en' ? 'View' : 'দেখুন'}
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {viewingDealer && (
                <div
                  style={{
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
                  }}
                onClick={() => setViewingDealer(null)}
                >
                  <div
                    style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    maxWidth: '900px',
                    width: '100%',
                      maxHeight: '90vh',
                      overflowY: 'auto',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                    }}
                  onClick={(e) => e.stopPropagation()}
                  >
                  <div
                        style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      overflow: 'hidden',
                      borderRadius: '0.75rem'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: '260px',
                        height: '260px',
                        top: '-120px',
                        left: '-80px',
                        background: 'radial-gradient(circle at 30% 30%, rgba(59,130,246,0.25), transparent 60%)',
                        filter: 'blur(20px)'
                        }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        width: '240px',
                        height: '240px',
                        bottom: '-140px',
                        right: '-100px',
                        background: 'radial-gradient(circle at 70% 70%, rgba(16,185,129,0.22), transparent 60%)',
                        filter: 'blur(20px)'
                      }}
                    />
                    </div>

                    <div
                      style={{
                      position: 'relative',
                        display: 'flex',
                      justifyContent: 'space-between',
                        alignItems: 'center',
                      marginBottom: '1.5rem',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div
                        style={{
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
                        }}
                      >
                        {(isEditingDealer ? editingDealerData?.photo : viewingDealer.photo) ? (
                          <img
                            src={isEditingDealer ? editingDealerData?.photo : viewingDealer.photo}
                            alt={editingDealerData?.name || viewingDealer.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        ) : (
                          (editingDealerData?.name || viewingDealer.name || 'D').charAt(0)
                        )}
                      </div>
                        <div>
                        <h2
                          style={{
                            margin: 0,
                            fontSize: '1.5rem',
                            fontWeight: 800,
                            color: '#0f172a'
                          }}
                        >
                          {viewingDealer.name || (language === 'en' ? 'Dealer' : 'ডিলার')}
                        </h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 700 }}>
                          {viewingDealer.dealerId || 'N/A'}
                        </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {!isEditingDealer && (
                        <button
                          onClick={() => {
                            if (showDealerOrders) {
                              setShowDealerOrders(false)
                            } else {
                              handleShowDealerOrders()
                            }
                          }}
                          style={{
                            padding: '0.45rem 0.85rem',
                            backgroundColor: '#0ea5e9',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: 700,
                            boxShadow: '0 10px 20px rgba(14,165,233,0.35)'
                          }}
                        >
                          {showDealerOrders 
                            ? (language === 'en' ? 'Back' : 'পেছনে যান')
                            : (language === 'en' ? 'Orders' : 'অর্ডার')}
                        </button>
                      )}
                      {!isEditingDealer && (
                        <button
                          onClick={() => {
                            setIsEditingDealer(true)
                            setEditingDealerData(viewingDealer)
                          }}
                          style={{
                            padding: '0.5rem 0.9rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: 700,
                            boxShadow: '0 10px 20px rgba(59,130,246,0.35)'
                          }}
                        >
                          {language === 'en' ? 'Edit' : 'সম্পাদনা'}
                        </button>
                      )}
                      {isEditingDealer && (
                        <>
                          <button
                            onClick={handleSaveDealerEdit}
                            disabled={savingDealer}
                            style={{
                              padding: '0.5rem 0.9rem',
                              backgroundColor: '#16a34a',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              fontWeight: 700,
                              opacity: savingDealer ? 0.7 : 1
                            }}
                          >
                            {savingDealer
                              ? language === 'en'
                                ? 'Saving...'
                                : 'সংরক্ষণ হচ্ছে...'
                              : language === 'en'
                                ? 'Save'
                                : 'সংরক্ষণ'}
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingDealer(false)
                              setEditingDealerData(null)
                            }}
                            style={{
                              padding: '0.5rem 0.9rem',
                              backgroundColor: '#e2e8f0',
                              color: '#0f172a',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              fontWeight: 700
                            }}
                          >
                            {language === 'en' ? 'Cancel' : 'বাতিল'}
                          </button>
                        </>
                      )}
                      {isEditingDealer && (
                        <button
                          onClick={handleDeleteDealer}
                          style={{
                            padding: '0.45rem 0.85rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: 700,
                            boxShadow: '0 10px 20px rgba(239,68,68,0.35)'
                          }}
                        >
                          {language === 'en' ? 'Delete' : 'মুছুন'}
                        </button>
                      )}
                      <button
                        onClick={() => setViewingDealer(null)}
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

                  {showDealerOrders && (
                    <div className="admin-card" style={{ marginTop: '0.5rem' }}>
                      {(() => {
                        const isAdmin = (userRole || '').toLowerCase() === 'admin'
                        return (
                          <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <h3 style={{ margin: 0 }}>{language === 'en' ? 'Dealer Orders' : 'ডিলারের অর্ডার'}</h3>
                          
                        </div>
                       
                      </div>

                      {dealerOrdersLoading && (
                        <div style={{ padding: '0.75rem', color: '#475569' }}>
                          {language === 'en' ? 'Loading orders...' : 'অর্ডার লোড হচ্ছে...'}
                        </div>
                      )}
                      {dealerOrdersStatus && !dealerOrdersLoading && (
                        <div style={{
                          padding: '0.75rem',
                          marginBottom: '0.75rem',
                          borderRadius: '0.375rem',
                          backgroundColor: '#f1f5f9',
                          color: '#475569'
                        }}>
                          {dealerOrdersStatus}
                        </div>
                      )}

                      {!dealerOrdersLoading && dealerOrders.length > 0 && (
                        <>
                          {(() => {
                            const totalAmount = dealerOrders.reduce((sum, order) => {
                              const price = parseFloat(order.totalPrice) || 0
                              return sum + price
                            }, 0)
                            
                            const totalPaid = dealerOrders.reduce((sum, order) => {
                              // Match the table display logic: order.paidAmount ? parseFloat(order.paidAmount) : 0
                              const paid = order.paidAmount ? parseFloat(order.paidAmount) || 0 : 0
                              return sum + paid
                            }, 0)
                            
                            const totalDue = dealerOrders.reduce((sum, order) => {
                              // Match the table display logic exactly
                              const totalPrice = parseFloat(order.totalPrice) || 0
                              const paidAmount = order.paidAmount ? parseFloat(order.paidAmount) || 0 : 0
                              const due = order.dueAmount !== undefined && order.dueAmount !== null
                                ? parseFloat(order.dueAmount) || 0
                                : Math.max(0, totalPrice - paidAmount)
                              return sum + due
                            }, 0)
                            
                            return (
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                              }}>
                                <div style={{
                                  padding: '1rem',
                                  borderRadius: '0.5rem',
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #e5e7eb'
                                }}>
                                  <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 700, marginBottom: '0.5rem' }}>
                                    {language === 'en' ? 'Total Amount' : 'মোট পরিমাণ'}
                                  </div>
                                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                                    ৳{Number(totalAmount || 0).toLocaleString()}
                                  </div>
                                </div>
                                <div style={{
                                  padding: '1rem',
                                  borderRadius: '0.5rem',
                                  backgroundColor: '#f0fdf4',
                                  border: '1px solid #dcfce7'
                                }}>
                                  <div style={{ fontSize: '0.875rem', color: '#15803d', fontWeight: 700, marginBottom: '0.5rem' }}>
                                    {language === 'en' ? 'Total Paid' : 'মোট পরিশোধিত'}
                                  </div>
                                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534' }}>
                                    ৳{Number(totalPaid || 0).toLocaleString()}
                                  </div>
                                </div>
                                <div style={{
                                  padding: '1rem',
                                  borderRadius: '0.5rem',
                                  backgroundColor: '#fff7ed',
                                  border: '1px solid #fed7aa'
                                }}>
                                  <div style={{ fontSize: '0.875rem', color: '#c2410c', fontWeight: 700, marginBottom: '0.5rem' }}>
                                    {language === 'en' ? 'Total Due' : 'মোট বকেয়া'}
                                  </div>
                                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#9a3412' }}>
                                    ৳{Number(totalDue || 0).toLocaleString()}
                                  </div>
                                </div>
                                {isAdmin && (
                                  <div style={{
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: '#eff6ff',
                                    border: '1px solid #bfdbfe'
                                  }}>
                                    <div style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: 700, marginBottom: '0.5rem' }}>
                                      {language === 'en' ? 'Add Collection' : 'সংগ্রহ যোগ করুন'}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                      <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={addCollectionAmount}
                                        onChange={(e) => setAddCollectionAmount(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddCollection(addCollectionAmount)
                                          }
                                        }}
                                        placeholder={language === 'en' ? 'Enter amount' : 'পরিমাণ লিখুন'}
                                        style={{
                                          flex: 1,
                                          minWidth: '120px',
                                          padding: '0.5rem',
                                          border: '1px solid #3b82f6',
                                          borderRadius: '0.375rem',
                                          fontSize: '1rem',
                                          fontWeight: 600,
                                          color: '#1e40af'
                                        }}
                                      />
                                      <button
                                        onClick={() => handleAddCollection(addCollectionAmount)}
                                        disabled={savingCollection || !addCollectionAmount || parseFloat(addCollectionAmount) <= 0}
                                        style={{
                                          padding: '0.5rem 1rem',
                                          backgroundColor: savingCollection ? '#9ca3af' : '#3b82f6',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '0.375rem',
                                          fontSize: '0.875rem',
                                          fontWeight: 700,
                                          cursor: savingCollection || !addCollectionAmount || parseFloat(addCollectionAmount) <= 0 ? 'not-allowed' : 'pointer',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        {savingCollection 
                                          ? (language === 'en' ? 'Adding...' : 'যোগ করা হচ্ছে...')
                                          : (language === 'en' ? 'Add' : 'যোগ করুন')}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })()}
                          
                          <div className="admin-table-container" style={{ width: '100%', overflowX: 'auto' }}>
                          <table className="admin-table" style={{ width: '100%', fontSize: '0.875rem' }}>
                            <thead>
                              <tr>
                                <th style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{language === 'en' ? 'Date' : 'তারিখ'}</th>
                                <th style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{language === 'en' ? 'Order ID' : 'অর্ডার আইডি'}</th>
                                <th style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{language === 'en' ? 'Product' : 'পণ্য'}</th>
                                <th style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{language === 'en' ? 'Variant' : 'ভ্যারিয়েন্ট'}</th>
                                <th style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{language === 'en' ? 'Qty' : 'পরিমাণ'}</th>
                                <th style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{language === 'en' ? 'Status' : 'স্ট্যাটাস'}</th>
                                <th style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{language === 'en' ? 'Total' : 'মোট'}</th>
                                <th style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{language === 'en' ? 'Paid Amount' : 'পরিশোধিত পরিমাণ'}</th>
                                <th style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{language === 'en' ? 'Due Amount' : 'বাকি পরিমাণ'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dealerOrders.map((order) => (
                                <tr key={order._id}>
                                  <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                                  <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{order.orderId || '-'}</td>
                                  <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{order.productName || order.product?.name || '-'}</td>
                                  <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{order.variant?.value ? (order.variant.name || order.variant.value) : '-'}</td>
                                  <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{order.quantity || 0}</td>
                                  <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>{order.status || 'Pending'}</td>
                                  <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>৳{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</td>
                                  <td style={{ padding: '0.5rem', whiteSpace: 'nowrap', fontWeight: 600, color: '#16a34a' }}>
                                    ৳{order.paidAmount ? parseFloat(order.paidAmount).toFixed(2) : '0.00'}
                                  </td>
                                  <td style={{ padding: '0.5rem', whiteSpace: 'nowrap', fontWeight: 600, color: (() => {
                                    const due = order.dueAmount !== undefined 
                                      ? parseFloat(order.dueAmount) 
                                      : Math.max(0, parseFloat(order.totalPrice || 0) - parseFloat(order.paidAmount || 0))
                                    return due > 0 ? '#dc2626' : '#16a34a'
                                  })() }}>
                                    ৳{(() => {
                                      const due = order.dueAmount !== undefined 
                                        ? parseFloat(order.dueAmount) 
                                        : Math.max(0, parseFloat(order.totalPrice || 0) - parseFloat(order.paidAmount || 0))
                                      return due.toFixed(2)
                                    })()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        </>
                      )}
                          </>
                        )
                      })()}
                    </div>
                  )}

                  <div
                    style={{
                      display: showDealerOrders ? 'none' : 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '1rem',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                      {[
                      { key: 'dealerId', label: language === 'en' ? 'Dealer ID' : 'ডিলার আইডি' },
                      { key: 'name', label: language === 'en' ? 'Dealer Name' : 'ডিলারের নাম' },
                      { key: 'phone', label: language === 'en' ? 'Phone' : 'ফোন' },
                      { key: 'email', label: language === 'en' ? 'Email' : 'ইমেইল' },
                      { key: 'area', label: language === 'en' ? 'Area' : 'এলাকা' },
                      { key: 'nid', label: language === 'en' ? 'NID' : 'এনআইডি' },
                      { key: 'tradeLicense', label: language === 'en' ? 'Trade License' : 'ট্রেড লাইসেন্স' },
                      { key: 'pesticideLicense', label: language === 'en' ? 'Pesticides License' : 'কীটনাশক লাইসেন্স' }
                      ].map((item) => (
                      <div
                        key={item.label}
                        style={{
                          padding: '1rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '0.375rem'
                        }}
                      >
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>{item.label}</div>
                        {isEditingDealer ? (
                          <input
                            type="text"
                            value={editingDealerData?.[item.key] || ''}
                            onChange={(e) =>
                              setEditingDealerData({
                                ...editingDealerData,
                                [item.key]: e.target.value
                              })
                            }
                            style={{
                              marginTop: '0.5rem',
                              width: '100%',
                              padding: '0.5rem',
                              borderRadius: '0.375rem',
                              border: '1px solid #d1d5db',
                              fontSize: '1rem',
                              color: '#111827'
                            }}
                          />
                        ) : (
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                            {viewingDealer?.[item.key] || 'N/A'}
                          </p>
                        )}
                        </div>
                      ))}

                    <div
                      style={{
                        gridColumn: '1 / -1',
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.375rem'
                      }}
                    >
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                          {language === 'en' ? 'Address' : 'ঠিকানা'}
                        </div>
                      {isEditingDealer ? (
                        <textarea
                          value={editingDealerData?.address || ''}
                          onChange={(e) =>
                            setEditingDealerData({
                              ...editingDealerData,
                              address: e.target.value
                            })
                          }
                          rows={3}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #d1d5db',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            color: '#111827',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <p
                          style={{
                            margin: '0.5rem 0 0 0',
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#111827',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {viewingDealer.address || 'N/A'}
                        </p>
                      )}
                    </div>
                    <div
                      style={{
                        padding: '1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.375rem'
                      }}
                    >
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Assign Salesman' : 'সেলসম্যান নির্ধারণ'}
                      </div>
                      {isEditingDealer ? (
                        <select
                          value={editingDealerData?.assignedTo || ''}
                          onChange={(e) => {
                            setEditingDealerData({
                              ...editingDealerData,
                              assignedTo: e.target.value,
                              assignedToName: '',
                              assignedToId: ''
                            })
                          }}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '0.375rem',
                            border: '1px solid #d1d5db',
                            fontSize: '1rem',
                            color: '#111827'
                          }}
                        >
                          <option value="">{language === 'en' ? 'Select Salesman' : 'সেলসম্যান নির্বাচন করুন'}</option>
                          {salesEmployees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                              {emp.name} {emp.employeeId ? `(${emp.employeeId})` : ''}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                          {(viewingDealer.assignedToName || viewingDealer.assignedToId) || (language === 'en' ? 'Unassigned' : 'নির্ধারিত নয়')}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                      <div
                        style={{
                          padding: '1.25rem',
                          background: 'linear-gradient(180deg, #f8fbff 0%, #f2f7ff 100%)',
                          borderRadius: '0.75rem',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 15px 35px rgba(59,130,246,0.08)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ fontSize: '0.95rem', color: '#475569', fontWeight: 700 }}>
                          {language === 'en' ? 'Agreement' : 'চুক্তি'}
                        </div>
                        {(isEditingDealer ? editingDealerData?.agreement : viewingDealer.agreement) ? (
                          <a
                            href={isEditingDealer ? editingDealerData?.agreement : viewingDealer.agreement}
                            download={`${viewingDealer.dealerId || 'agreement'}.pdf`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0.7rem 0.95rem',
                              background: '#3b82f6',
                              color: 'white',
                              fontWeight: 800,
                              borderRadius: '0.6rem',
                              textDecoration: 'none',
                              boxShadow: '0 10px 24px rgba(59,130,246,0.28)'
                            }}
                          >
                            {language === 'en' ? 'Download Agreement' : 'চুক্তি ডাউনলোড করুন'}
                          </a>
                        ) : (
                          <div style={{ color: '#94a3b8', fontWeight: 700 }}>
                            {language === 'en' ? 'No agreement uploaded' : 'কোনো চুক্তি নেই'}
                          </div>
                        )}
                        {isEditingDealer && (
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              try {
                                const base64 = await fileToBase64(file)
                                setEditingDealerData({
                                  ...editingDealerData,
                                  agreement: base64
                                })
                              } catch (err) {
                                console.error('Agreement upload failed', err)
                              }
                            }}
                            style={{
                              width: '100%',
                              padding: '0.55rem',
                              borderRadius: '0.5rem',
                              border: '1px solid #d1d5db',
                              backgroundColor: 'white',
                              cursor: 'pointer',
                              fontWeight: 600,
                              opacity: 0.65
                            }}
                          />
                        )}
                      </div>

                      <div
                        style={{
                          padding: '1rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '0.375rem',
                          border: '1px solid #e5e7eb',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 700, marginBottom: '0.5rem' }}>
                          {language === 'en' ? 'Photo' : 'ছবি'}
                        </div>
                        {(isEditingDealer ? editingDealerData?.photo : viewingDealer.photo) ? (
                          <img
                            src={isEditingDealer ? editingDealerData?.photo : viewingDealer.photo}
                            alt={editingDealerData?.name || viewingDealer.name}
                            style={{ maxWidth: '240px', maxHeight: '240px', borderRadius: '0.75rem', border: '2px solid #e5e7eb', objectFit: 'cover' }}
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        ) : (
                          <div style={{ fontWeight: 700, color: '#94a3b8' }}>
                            {language === 'en' ? 'No photo' : 'ছবি নেই'}
                          </div>
                        )}
                        {isEditingDealer && (
                          <div style={{ marginTop: '0.75rem' }}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                try {
                                  const base64 = await fileToBase64(file)
                                  setEditingDealerData({
                                    ...editingDealerData,
                                    photo: base64
                                  })
                                } catch (err) {
                                  console.error('Photo upload failed', err)
                                }
                              }}
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '0.375rem',
                                border: '1px solid #d1d5db',
                                backgroundColor: 'white',
                                cursor: 'pointer',
                                opacity: 0.65
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )}
            </div>
          )}

          {/* HR Tab */}
          {activeTab === 'hr' && (
            <div className="admin-tab-content">
              <div className="admin-tab-header" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 className="admin-page-title" style={{ flex: 1 }}>{adminContent.hr}</h1>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="admin-add-btn" onClick={() => setShowEmployeeForm(true)}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {adminContent.addNew}
                </button>
                  <button
                    type="button"
                    onClick={() => loadEmployees()}
                    className="admin-add-btn"
                    style={{ backgroundColor: '#e2e8f0', color: '#0f172a' }}
                  >
                    {language === 'en' ? 'Refresh' : 'রিফ্রেশ'}
                  </button>
                </div>
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
                setShowEmployeeForm(false)
                setEmployeeStatus('')
                setGeneratedCredentials(null)
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
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                        {language === 'en' ? 'Add Employee' : 'কর্মচারী যোগ করুন'}
                      </h2>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 600 }}>
                        {language === 'en' ? 'Fill in employee details and save' : 'কর্মচারীর বিবরণ পূরণ করুন এবং সংরক্ষণ করুন'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowEmployeeForm(false)
                        setEmployeeStatus('')
                        setGeneratedCredentials(null)
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

                  <div style={{ position: 'relative', zIndex: 1 }}>
                  {employeeStatus && (
                    <div style={{
                      padding: '0.75rem',
                      marginBottom: '1rem',
                      borderRadius: '0.5rem',
                      border: employeeStatus.includes('fail') || employeeStatus.includes('ব্যর্থ') ? '1px solid #fecaca' : '1px solid #bbf7d0',
                      backgroundColor: employeeStatus.includes('fail') || employeeStatus.includes('ব্যর্থ') ? '#fef2f2' : '#ecfdf3',
                      color: employeeStatus.includes('fail') || employeeStatus.includes('ব্যর্থ') ? '#b91c1c' : '#065f46',
                      fontWeight: 700
                    }}>
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
                      <label>{language === 'en' ? 'Posting Area' : 'পোস্টিং এরিয়া'}</label>
                      <input type="text" value={newEmployee.postingArea} onChange={(e) => setNewEmployee({ ...newEmployee, postingArea: e.target.value })} />
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
                          postingArea: newEmployee.postingArea || '',
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
                        
                        setNewEmployee({ name: '', email: '', phone: '', address: '', nid: '', document: '', emergencyContactName: '', emergencyContact: '', salary: '', salesTarget: '', bankName: '', bankBranch: '', accountNumber: '', department: '', postingArea: '', role: '', designation: '', photo: '', status: 'Unpaid' })
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
              </div>
            )}

            <div className="admin-table-container" style={{ marginTop: '1.5rem' }}>
                <div className="admin-search-bar">
                  <input 
                    type="text" 
                    placeholder={language === 'en' ? 'Search employees...' : 'কর্মচারী খুঁজুন...'} 
                    value={employeeSearch || ''}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                  />
                </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th 
                      onClick={() => handleSortEmployees('employeeId')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {language === 'en' ? 'ID' : 'আইডি'}
                      {employeeSortField === 'employeeId' && (employeeSortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                    <th 
                      onClick={() => handleSortEmployees('name')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {language === 'en' ? 'Name' : 'নাম'}
                      {employeeSortField === 'name' && (employeeSortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                    <th 
                      onClick={() => handleSortEmployees('phone')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {language === 'en' ? 'Phone' : 'ফোন'}
                      {employeeSortField === 'phone' && (employeeSortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                    <th 
                      onClick={() => handleSortEmployees('designation')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {language === 'en' ? 'Designation' : 'পদবি'}
                      {employeeSortField === 'designation' && (employeeSortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                    <th 
                      onClick={() => handleSortEmployees('postingArea')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {language === 'en' ? 'Posting Area' : 'পোস্টিং এলাকা'}
                      {employeeSortField === 'postingArea' && (employeeSortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                    <th 
                      onClick={() => handleSortEmployees('salary')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {language === 'en' ? 'Salary' : 'বেতন'}
                      {employeeSortField === 'salary' && (employeeSortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                    <th 
                      onClick={() => handleSortEmployees('salesTarget')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {language === 'en' ? 'Sales Target' : 'বিক্রয় লক্ষ্য'}
                      {employeeSortField === 'salesTarget' && (employeeSortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                    <th 
                      onClick={() => handleSortEmployees('salaryStatus')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {language === 'en' ? 'Salary Status' : 'বেতন স্থিতি'}
                      {employeeSortField === 'salaryStatus' && (employeeSortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                    <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEmployees.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        {adminContent.noData}
                      </td>
                    </tr>
                  ) : (
                    sortedEmployees.map((emp, idx) => (
                      <tr key={emp._id || idx}>
                        <td>{emp.employeeId || 'N/A'}</td>
                        <td>{emp.name || 'N/A'}</td>
                        <td>{emp.phone || 'N/A'}</td>
                        <td>{emp.designation || 'N/A'}</td>
                        <td>{emp.postingArea || emp.area || 'N/A'}</td>
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
                          setShowSalesHistory(false) // Show employee details by default
                          setShowAssignedDealers(false) // Show employee details by default
                                } else {
                                  // Fallback to existing data if fetch fails
                                  console.log('[View Employee] Using cached employee data:', emp)
                          setViewingEmployee({ ...emp, status: normalizeSalaryStatus(emp.status) })
                          setLastGeneratedPassword(emp.generatedPassword || '')
                          setShowSalesHistory(false) // Show employee details by default
                          setShowAssignedDealers(false) // Show employee details by default
                                }
                              } catch (err) {
                                console.error('Failed to fetch employee details', err)
                                // Fallback to existing data if fetch fails
                        setViewingEmployee({ ...emp, status: normalizeSalaryStatus(emp.status) })
                        setLastGeneratedPassword(emp.generatedPassword || '')
                        setShowSalesHistory(false) // Show employee details by default
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
                          {viewingEmployee.name || (language === 'en' ? 'Employee' : 'কর্মচারী')}
                        </h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 600 }}>{viewingEmployee.designation || viewingEmployee.role || ''}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={() => {
                        setShowSalesHistory((prev) => !prev)
                        setShowAssignedDealers(false)
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
                      {showSalesHistory
                        ? (language === 'en' ? 'Back' : 'পেছনে যান')
                        : (language === 'en' ? 'Sales History' : 'বিক্রয় ইতিহাস')}
                    </button>
                    {!showSalesHistory && (
                      <button
                        onClick={() => {
                          setShowAssignedDealers((prev) => !prev)
                          setShowSalesHistory(false)
                        }}
                        style={{
                          padding: '0.6rem 1.1rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          boxShadow: '0 10px 20px rgba(16,185,129,0.35)'
                        }}
                      >
                        {showAssignedDealers
                          ? (language === 'en' ? 'Back' : 'পেছনে যান')
                          : (language === 'en' ? 'Dealers' : 'ডিলার')}
                      </button>
                    )}
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

                  {showSalesHistory ? (
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(() => {
                      // Check if viewing employee is RSM
                      const isRSM = (viewingEmployee?.role || '').toLowerCase() === 'rsm'
                      
                      // For RSM: calculate sales target as sum of all salesmen's targets
                      // For others: use their own sales target
                      const calculatedSalesTarget = isRSM
                        ? (employees || []).reduce((sum, emp) => {
                            if ((emp.role || '').toLowerCase() === 'salesman') {
                              return sum + (parseFloat(emp.salesTarget) || 0)
                            }
                            return sum
                          }, 0)
                        : (parseFloat(viewingEmployee.salesTarget) || 0)
                      
                      // Calculate individual employee's total collection and total due
                      // Include both employee-created orders AND admin-created orders for assigned dealers
                      const employeeId = viewingEmployee?._id || ''
                      
                      // Get all dealers assigned to this employee
                      const assignedDealerIds = (dealers || [])
                        .filter(dealer => {
                          const assignedToId = dealer.assignedTo?._id || dealer.assignedTo || ''
                          return String(assignedToId) === String(employeeId)
                        })
                        .map(dealer => ({
                          _id: String(dealer._id || ''),
                          dealerId: String(dealer.dealerId || '')
                        }))
                        .filter(d => d._id || d.dealerId)
                      
                      // Filter orders: employee-created OR admin-created for assigned dealers
                      const employeeOrders = (orders || []).filter(order => {
                        const orderRequestedBy = order.requestedBy?._id || order.requestedBy || ''
                        const isEmployeeOrder = String(orderRequestedBy) === String(employeeId)
                        
                        // Check if this is an admin-created order for an assigned dealer
                        const isAdminOrder = (order.requestedByRole || '').toLowerCase() === 'admin'
                        let isAdminOrderForAssignedDealer = false
                        
                        if (isAdminOrder) {
                          const orderDealerId = order.dealer?._id || order.dealer || ''
                          const orderDealerIdString = String(orderDealerId)
                          const orderDealerIdFromDealer = order.dealerId || ''
                          
                          isAdminOrderForAssignedDealer = assignedDealerIds.some(assignedDealer => 
                            assignedDealer._id === orderDealerIdString ||
                            assignedDealer.dealerId === orderDealerIdFromDealer ||
                            (order.dealer && String(order.dealer._id || order.dealer) === assignedDealer._id)
                          )
                        }
                        
                        return isEmployeeOrder || isAdminOrderForAssignedDealer
                      })
                      
                      // For RSM: sum all employees' achievedTarget values
                      // For others: calculate from own approved orders + admin-created orders for assigned dealers
                      let employeeAchievedTarget = 0
                      if (isRSM) {
                        // Sum all employees' achievedTarget values
                        employeeAchievedTarget = (employees || []).reduce((sum, emp) => {
                          return sum + (parseFloat(emp.achievedTarget) || 0)
                        }, 0)
                      } else {
                        // Calculate achieved target from:
                        // 1. Employee-created approved orders (excluding cancelled)
                        // 2. Admin-created approved orders for dealers assigned to this employee (excluding cancelled)
                        employeeAchievedTarget = employeeOrders
                          .filter(order => 
                            order.approvalStatus === 'Approved' && 
                            order.status !== 'Cancelled'
                          )
                          .reduce((sum, order) => {
                            return sum + (parseFloat(order.totalPrice) || 0)
                          }, 0)
                      }
                      
                      // For RSM: calculate collection and due from all salesmen's orders
                      // For others: calculate from own orders
                      let employeeTotalCollection = 0
                      let employeeTotalDue = 0
                      
                      if (isRSM) {
                        const salesmenIds = (employees || [])
                          .filter(emp => (emp.role || '').toLowerCase() === 'salesman')
                          .map(emp => String(emp._id || ''))
                        
                        const allSalesmenOrders = (orders || []).filter(order => {
                          const orderRequestedBy = String(order.requestedBy?._id || order.requestedBy || '')
                          return salesmenIds.includes(orderRequestedBy)
                        })
                        
                        employeeTotalCollection = allSalesmenOrders.reduce((sum, order) => {
                          const paid = order?.paidAmount !== undefined && order?.paidAmount !== null
                            ? Number(order.paidAmount)
                            : 0
                          return sum + Number(paid || 0)
                        }, 0)
                        
                        employeeTotalDue = allSalesmenOrders.reduce((sum, order) => {
                          const due = order?.dueAmount !== undefined && order?.dueAmount !== null
                            ? Number(order.dueAmount)
                            : Math.max(0, Number(order.totalPrice || 0) - Number(order.paidAmount || 0))
                          return sum + Number(due || 0)
                        }, 0)
                      } else {
                        employeeTotalCollection = employeeOrders.reduce((sum, order) => {
                          const paid = order?.paidAmount !== undefined && order?.paidAmount !== null
                            ? Number(order.paidAmount)
                            : 0
                          return sum + Number(paid || 0)
                        }, 0)
                        
                        employeeTotalDue = employeeOrders.reduce((sum, order) => {
                          const due = order?.dueAmount !== undefined && order?.dueAmount !== null
                            ? Number(order.dueAmount)
                            : Math.max(0, Number(order.totalPrice || 0) - Number(order.paidAmount || 0))
                          return sum + Number(due || 0)
                        }, 0)
                      }
                      
                      return (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '0.75rem'
                        }}>
                          <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e5e7eb' }}>
                            <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 700 }}>
                            {language === 'en' ? 'Total Target' : 'মোট টার্গেট'}
                          </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
                            ৳{Number(calculatedSalesTarget || 0).toLocaleString()}
                          </div>
                        </div>
                        <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7' }}>
                            <div style={{ fontSize: '0.9rem', color: '#15803d', fontWeight: 700 }}>
                            {language === 'en' ? 'Achieved Target' : 'অর্জিত টার্গেট'}
                          </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534', marginTop: '0.35rem' }}>
                            ৳{Number(employeeAchievedTarget || 0).toLocaleString()}
                          </div>
                        </div>
                          <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#eef2ff', border: '1px solid #e0e7ff' }}>
                            <div style={{ fontSize: '0.9rem', color: '#4338ca', fontWeight: 700 }}>
                            {language === 'en' ? 'Progress' : 'অগ্রগতি'}
                          </div>
                          {(() => {
                            const total = Number(calculatedSalesTarget || 0) || 0
                            const achieved = Number(employeeAchievedTarget || 0) || 0
                            const pct = total > 0 ? Math.min(100, Math.round((achieved / total) * 100)) : 0
                            return (
                                <div style={{ marginTop: '0.35rem' }}>
                                  <div style={{ height: '10px', background: '#e0e7ff', borderRadius: '999px', overflow: 'hidden' }}>
                                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #22c55e)' }} />
                                </div>
                                <div style={{ marginTop: '0.35rem', fontWeight: 700, color: '#312e81' }}>{pct}%</div>
                              </div>
                            )
                          })()}
                        </div>
                          <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e5e7eb' }}>
                            <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 700 }}>
                              {language === 'en' ? 'Total Collection' : 'মোট সংগ্রহ'}
                            </div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
                              ৳{Number(employeeTotalCollection || 0).toLocaleString()}
                            </div>
                          </div>
                          <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#fff7ed', border: '1px solid #fed7aa' }}>
                            <div style={{ fontSize: '0.9rem', color: '#c2410c', fontWeight: 700 }}>
                              {language === 'en' ? 'Total Due' : 'মোট বকেয়া'}
                            </div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#9a3412', marginTop: '0.35rem' }}>
                              ৳{Number(employeeTotalDue || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )
                    })()}

                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: '0.25rem 0' }}>
                        {language === 'en' ? 'Sales History' : 'বিক্রয় ইতিহাস'}
                      </h3>
                      {viewingEmployee.salesHistory && Array.isArray(viewingEmployee.salesHistory) && viewingEmployee.salesHistory.length > 0 ? (
                        <div style={{ 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '0.5rem', 
                          overflow: 'hidden',
                          backgroundColor: '#fff'
                        }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                  {language === 'en' ? 'Date' : 'তারিখ'}
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                  {language === 'en' ? 'Order ID' : 'অর্ডার আইডি'}
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                  {language === 'en' ? 'Dealer' : 'ডিলার'}
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                  {language === 'en' ? 'Amount' : 'পরিমাণ'}
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                  {language === 'en' ? 'Order Created By' : 'অর্ডার তৈরিকারী'}
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                  {language === 'en' ? 'Approved By' : 'অনুমোদনকারী'}
                                </th>
                                <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                  {language === 'en' ? 'Status' : 'অবস্থা'}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                // Get all dealers assigned to this employee
                                const employeeId = viewingEmployee?._id || ''
                                const assignedDealerIds = (dealers || [])
                                  .filter(dealer => {
                                    const assignedToId = dealer.assignedTo?._id || dealer.assignedTo || ''
                                    return String(assignedToId) === String(employeeId)
                                  })
                                  .map(dealer => ({
                                    _id: String(dealer._id || ''),
                                    dealerId: String(dealer.dealerId || '')
                                  }))
                                  .filter(d => d._id || d.dealerId)
                                
                                return (viewingEmployee.salesHistory || [])
                                  .filter((sale) => {
                                    // Filter out deleted orders - only show if order still exists
                                    if (!sale || !sale.orderObjectId) return false
                                    
                                    const order = (orders || []).find(o => {
                                      if (!o) return false
                                      const orderIdMatch = o._id && sale.orderObjectId && (
                                        String(o._id) === String(sale.orderObjectId) ||
                                        String(o._id) === String(sale.orderObjectId._id || sale.orderObjectId)
                                      )
                                      const orderIdStringMatch = o.orderId && sale.orderId && (
                                        String(o.orderId) === String(sale.orderId)
                                      )
                                      return orderIdMatch || orderIdStringMatch
                                    })
                                    
                                    // Only show if order exists in the orders array
                                    if (!order) return false
                                    
                                    // Verify this order actually belongs to this employee
                                    const orderRequestedBy = order.requestedBy?._id || order.requestedBy || ''
                                    const isEmployeeOrder = String(orderRequestedBy) === String(employeeId)
                                    
                                    // Check if this is an admin-created order for an assigned dealer
                                    const isAdminOrder = (order.requestedByRole || '').toLowerCase() === 'admin'
                                    let isAdminOrderForAssignedDealer = false
                                    
                                    if (isAdminOrder) {
                                      const orderDealerId = order.dealer?._id || order.dealer || ''
                                      const orderDealerIdString = String(orderDealerId)
                                      const orderDealerIdFromDealer = order.dealerId || ''
                                      
                                      isAdminOrderForAssignedDealer = assignedDealerIds.some(assignedDealer => 
                                        assignedDealer._id === orderDealerIdString ||
                                        assignedDealer.dealerId === orderDealerIdFromDealer ||
                                        (order.dealer && String(order.dealer._id || order.dealer) === assignedDealer._id)
                                      )
                                    }
                                    
                                    // Only show if order belongs to this employee
                                    return isEmployeeOrder || isAdminOrderForAssignedDealer
                                  })
                                  // Remove duplicates - keep only the first occurrence of each order
                                  .filter((sale, index, self) => {
                                  // Get unique identifier for this sale entry
                                  const saleOrderObjectId = sale.orderObjectId?._id 
                                    ? String(sale.orderObjectId._id) 
                                    : (sale.orderObjectId ? String(sale.orderObjectId) : '')
                                  const saleOrderId = String(sale.orderId || '')
                                  
                                  // Find the first occurrence of this order (by orderObjectId or orderId)
                                  const firstIndex = self.findIndex(s => {
                                    const sOrderObjectId = s.orderObjectId?._id 
                                      ? String(s.orderObjectId._id) 
                                      : (s.orderObjectId ? String(s.orderObjectId) : '')
                                    const sOrderId = String(s.orderId || '')
                                    
                                    // Match by orderObjectId (preferred) or orderId
                                    return (saleOrderObjectId && sOrderObjectId && saleOrderObjectId === sOrderObjectId) ||
                                           (saleOrderId && sOrderId && saleOrderId === sOrderId && saleOrderId !== '')
                                  })
                                  
                                  // Only keep if this is the first occurrence
                                  return index === firstIndex
                                })
                                .sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt))
                                .map((sale, idx) => {
                                  // Find the order to get requestedByName
                                  const order = (orders || []).find(o => 
                                    String(o._id) === String(sale.orderObjectId) || 
                                    o.orderId === sale.orderId
                                  )
                                  const createdByName = order?.requestedByName || viewingEmployee.name || '-'
                                  
                                  return (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827' }}>
                                        {sale.approvedAt ? new Date(sale.approvedAt).toLocaleDateString() : '-'}
                                      </td>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827', fontFamily: 'monospace' }}>
                                        {sale.orderId || '-'}
                                      </td>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827' }}>
                                        {sale.dealerName || sale.dealerId || '-'}
                                      </td>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827', fontWeight: 600, textAlign: 'right' }}>
                                        ৳{parseFloat(sale.totalAmount || 0).toLocaleString()}
                                      </td>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827' }}>
                                        {createdByName}
                                      </td>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827' }}>
                                        {sale.approvedByName || '-'}
                                      </td>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                        {(() => {
                                          const orderStatus = order?.status || 'Pending'
                                          return (
                                            <span style={{
                                              display: 'inline-block',
                                              padding: '0.25rem 0.5rem',
                                              borderRadius: '0.25rem',
                                              fontSize: '0.75rem',
                                              fontWeight: 600,
                                              backgroundColor: 
                                                orderStatus === 'Complete' ? '#dcfce7' :
                                                orderStatus === 'Delivered' ? '#d1fae5' :
                                                orderStatus === 'Shipped' ? '#dbeafe' :
                                                orderStatus === 'Processing' ? '#fef3c7' :
                                                orderStatus === 'Cancelled' ? '#fee2e2' :
                                                '#f3f4f6',
                                              color:
                                                orderStatus === 'Complete' ? '#166534' :
                                                orderStatus === 'Delivered' ? '#065f46' :
                                                orderStatus === 'Shipped' ? '#1e40af' :
                                                orderStatus === 'Processing' ? '#92400e' :
                                                orderStatus === 'Cancelled' ? '#b91c1c' :
                                                '#374151'
                                            }}>
                                              {orderStatus}
                                            </span>
                                          )
                                        })()}
                                      </td>
                                    </tr>
                                  )
                                })
                              })()}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div style={{
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #e5e7eb',
                          backgroundColor: '#fff',
                          color: '#475569',
                          fontWeight: 600
                        }}>
                          {language === 'en' ? 'No sales history found.' : 'কোন বিক্রয় ইতিহাস পাওয়া যায়নি।'}
                        </div>
                      )}
                    </div>
                  ) : showAssignedDealers ? (
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: '0.25rem 0' }}>
                        {language === 'en' ? 'Assigned Dealers' : 'নির্ধারিত ডিলার'}
                      </h3>
                      {(() => {
                        // Filter dealers assigned to this employee
                        const assignedDealers = (dealers || []).filter(dealer => {
                          const assignedToId = dealer.assignedTo?._id || dealer.assignedTo || ''
                          const employeeId = viewingEmployee?._id || ''
                          return String(assignedToId) === String(employeeId)
                        })

                        if (assignedDealers.length === 0) {
                          return (
                            <div style={{
                              padding: '2rem',
                              textAlign: 'center',
                              backgroundColor: '#f9fafb',
                              borderRadius: '0.5rem',
                              border: '1px solid #e5e7eb',
                              color: '#6b7280'
                            }}>
                              {language === 'en' ? 'No dealers assigned to this employee' : 'এই কর্মচারীর জন্য কোন ডিলার নির্ধারিত নেই'}
                            </div>
                          )
                        }

                        return (
                          <div style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            overflow: 'hidden',
                            backgroundColor: '#fff'
                          }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                    {language === 'en' ? 'Dealer ID' : 'ডিলার আইডি'}
                                  </th>
                                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                    {language === 'en' ? 'Dealer Name' : 'ডিলারের নাম'}
                                  </th>
                                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                    {language === 'en' ? 'Contact' : 'যোগাযোগ'}
                                  </th>
                                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                    {language === 'en' ? 'Address' : 'ঠিকানা'}
                                  </th>
                                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                                    {language === 'en' ? 'Due Amount' : 'বকেয়া পরিমাণ'}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {assignedDealers.map((dealer, idx) => {
                                  // Calculate due amount for this dealer (excluding cancelled orders)
                                  const dealerOrders = (orders || []).filter(order => {
                                    const orderDealerId = order.dealerId || order.dealer?._id || ''
                                    const dealerId = dealer.dealerId || dealer._id || ''
                                    return (
                                      (String(orderDealerId) === String(dealerId) || 
                                       String(order.dealer?._id) === String(dealer._id)) &&
                                      order.status !== 'Cancelled' &&
                                      order.approvalStatus !== 'Rejected'
                                    )
                                  })
                                  
                                  const dealerDueAmount = dealerOrders.reduce((sum, order) => {
                                    const due = order?.dueAmount !== undefined && order?.dueAmount !== null
                                      ? Number(order.dueAmount)
                                      : Math.max(0, Number(order.totalPrice || 0) - Number(order.paidAmount || 0))
                                    return sum + Number(due || 0)
                                  }, 0)

                                  return (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827', fontFamily: 'monospace' }}>
                                        {dealer.dealerId || '-'}
                                      </td>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827', fontWeight: 600 }}>
                                        {dealer.name || '-'}
                                      </td>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827' }}>
                                        {dealer.phone || dealer.contact || '-'}
                                      </td>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827' }}>
                                        {dealer.address || '-'}
                                      </td>
                                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: dealerDueAmount > 0 ? '#dc2626' : '#16a34a', fontWeight: 600, textAlign: 'right' }}>
                                        ৳{Number(dealerDueAmount || 0).toLocaleString()}
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        )
                      })()}
                    </div>
                  ) : (
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
                          disabled={(viewingEmployee?.role || '').toLowerCase() === 'rsm'}
                          style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem',
                            backgroundColor: (viewingEmployee?.role || '').toLowerCase() === 'rsm' ? '#f3f4f6' : 'white'
                          }}
                        />
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827', fontWeight: 600 }}>
                          {(() => {
                            const isRSM = (viewingEmployee?.role || '').toLowerCase() === 'rsm'
                            const calculatedTarget = isRSM
                              ? (employees || []).reduce((sum, emp) => {
                                  if ((emp.role || '').toLowerCase() === 'salesman') {
                                    return sum + (parseFloat(emp.salesTarget) || 0)
                                  }
                                  return sum
                                }, 0)
                              : (parseFloat(viewingEmployee.salesTarget) || 0)
                            return calculatedTarget > 0 ? `৳ ${Number(calculatedTarget).toLocaleString()}` : 'N/A'
                          })()}
                        </p>
                      )}
                    </div>

                    {/* Achieved Target */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Achieved Target' : 'অর্জিত লক্ষ্য'}
                      </label>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827', fontWeight: 600 }}>
                        {(() => {
                          const isRSM = (viewingEmployee?.role || '').toLowerCase() === 'rsm'
                          let achievedTarget = 0
                          
                          if (isRSM) {
                            // Sum all employees' achievedTarget values
                            achievedTarget = (employees || []).reduce((sum, emp) => {
                              return sum + (parseFloat(emp.achievedTarget) || 0)
                            }, 0)
                          } else {
                            // Calculate achieved target from own approved orders + admin-created orders for assigned dealers
                            const employeeId = viewingEmployee?._id || ''
                            
                            // Get all dealers assigned to this employee
                            const assignedDealerIds = (dealers || [])
                              .filter(dealer => {
                                const assignedToId = dealer.assignedTo?._id || dealer.assignedTo || ''
                                return String(assignedToId) === String(employeeId)
                              })
                              .map(dealer => ({
                                _id: String(dealer._id || ''),
                                dealerId: String(dealer.dealerId || '')
                              }))
                              .filter(d => d._id || d.dealerId)
                            
                            // Filter orders: employee-created OR admin-created for assigned dealers
                            const employeeOrders = (orders || []).filter(order => {
                              const orderRequestedBy = order.requestedBy?._id || order.requestedBy || ''
                              const isEmployeeOrder = String(orderRequestedBy) === String(employeeId)
                              
                              // Check if this is an admin-created order for an assigned dealer
                              const isAdminOrder = (order.requestedByRole || '').toLowerCase() === 'admin'
                              let isAdminOrderForAssignedDealer = false
                              
                              if (isAdminOrder) {
                                const orderDealerId = order.dealer?._id || order.dealer || ''
                                const orderDealerIdString = String(orderDealerId)
                                const orderDealerIdFromDealer = order.dealerId || ''
                                
                                isAdminOrderForAssignedDealer = assignedDealerIds.some(assignedDealer => 
                                  assignedDealer._id === orderDealerIdString ||
                                  assignedDealer.dealerId === orderDealerIdFromDealer ||
                                  (order.dealer && String(order.dealer._id || order.dealer) === assignedDealer._id)
                                )
                              }
                              
                              return isEmployeeOrder || isAdminOrderForAssignedDealer
                            })
                            
                            achievedTarget = employeeOrders
                              .filter(order => 
                                order.approvalStatus === 'Approved' && 
                                order.status !== 'Cancelled'
                              )
                              .reduce((sum, order) => {
                                return sum + (parseFloat(order.totalPrice) || 0)
                              }, 0)
                          }
                          
                          return `৳ ${Number(achievedTarget || 0).toLocaleString()}`
                        })()}
                      </p>
                      {(() => {
                        const isRSM = (viewingEmployee?.role || '').toLowerCase() === 'rsm'
                        const calculatedTarget = isRSM
                          ? (employees || []).reduce((sum, emp) => {
                              if ((emp.role || '').toLowerCase() === 'salesman') {
                                return sum + (parseFloat(emp.salesTarget) || 0)
                              }
                              return sum
                            }, 0)
                          : (parseFloat(viewingEmployee.salesTarget) || 0)
                        
                        let achievedTarget = 0
                        if (isRSM) {
                          // Sum all employees' achievedTarget values
                          achievedTarget = (employees || []).reduce((sum, emp) => {
                            return sum + (parseFloat(emp.achievedTarget) || 0)
                          }, 0)
                        } else {
                          // Calculate achieved target from own approved orders + admin-created orders for assigned dealers
                          const employeeId = viewingEmployee?._id || ''
                          
                          // Get all dealers assigned to this employee
                          const assignedDealerIds = (dealers || [])
                            .filter(dealer => {
                              const assignedToId = dealer.assignedTo?._id || dealer.assignedTo || ''
                              return String(assignedToId) === String(employeeId)
                            })
                            .map(dealer => String(dealer._id || dealer.dealerId || ''))
                            .filter(id => id)
                          
                          // Filter orders: employee-created OR admin-created for assigned dealers
                          const employeeOrders = (orders || []).filter(order => {
                            const orderRequestedBy = order.requestedBy?._id || order.requestedBy || ''
                            const orderDealerId = order.dealer?._id || order.dealer || ''
                            const orderDealerIdString = String(orderDealerId)
                            const isEmployeeOrder = String(orderRequestedBy) === String(employeeId)
                            const isAdminOrderForAssignedDealer = 
                              (order.requestedByRole || '').toLowerCase() === 'admin' &&
                              assignedDealerIds.includes(orderDealerIdString)
                            return isEmployeeOrder || isAdminOrderForAssignedDealer
                          })
                          
                          achievedTarget = employeeOrders
                            .filter(order => 
                              order.approvalStatus === 'Approved' && 
                              order.status !== 'Cancelled'
                            )
                            .reduce((sum, order) => {
                              return sum + (parseFloat(order.totalPrice) || 0)
                            }, 0)
                        }
                        
                        return calculatedTarget > 0 ? (
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                            {(() => {
                              const progress = ((Number(achievedTarget || 0) / Number(calculatedTarget || 1)) * 100).toFixed(1)
                              return `${language === 'en' ? 'Progress' : 'অগ্রগতি'}: ${progress}%`
                            })()}
                          </p>
                        ) : null
                      })()}
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
                      {isEditingEmployee ? (
                        <>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Salary Status' : 'বেতন স্থিতি'}
                          </label>
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
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.95rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Salary Status' : 'বেতন স্থিতি'}
                          </span>
                          <span style={{ 
                            fontSize: '1rem', 
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '0.5rem',
                            backgroundColor: normalizeSalaryStatus(viewingEmployee.status) === 'Paid' ? '#dcfce7' : '#fee2e2',
                            color: normalizeSalaryStatus(viewingEmployee.status) === 'Paid' ? '#166534' : '#991b1b',
                            fontWeight: 700
                          }}>
                            {normalizeSalaryStatus(viewingEmployee.status)}
                          </span>
                        </div>
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

                    {/* Posting Area */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                        {language === 'en' ? 'Posting Area' : 'পোস্টিং এরিয়া'}
                      </label>
                      {isEditingEmployee ? (
                        <input
                          type="text"
                          value={editingEmployeeData?.postingArea || ''}
                          onChange={(e) => setEditingEmployeeData({ ...editingEmployeeData, postingArea: e.target.value })}
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
                          {viewingEmployee.postingArea || 'N/A'}
                        </p>
                      )}
                    </div>

                    {/* Role */}
                    <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                      {isEditingEmployee ? (
                        <>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Role' : 'ভূমিকা'}
                          </label>
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
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.95rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Role' : 'ভূমিকা'}
                          </span>
                          <span style={{ 
                            fontSize: '1rem', 
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '0.5rem',
                            backgroundColor: viewingEmployee.role === 'Admin' ? '#dcfce7' : '#fef3c7',
                            color: viewingEmployee.role === 'Admin' ? '#166534' : '#92400e',
                            fontWeight: 700
                          }}>
                            {viewingEmployee.role || 'N/A'}
                          </span>
                        </div>
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
                  )}


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
                          onClick={() => {
                            setIsEditingEmployee(true)
                            setEditingEmployeeData({ ...viewingEmployee, status: normalizeSalaryStatus(viewingEmployee.status) })
                          }}
                          style={{
                            padding: '0.5rem 1.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          {adminContent.edit}
                        </button>
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
              <div className="admin-tab-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 className="admin-page-title" style={{ flex: 1 }}>{adminContent.orders}</h1>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    className="admin-add-btn"
                    onClick={() => {
                      resetOrderForm()
                      setShowOrderForm(true)
                    }}
                  >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {adminContent.addNew}
                </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOrderRequests((prev) => !prev)
                      if (!showOrderRequests) {
                        loadOrderRequests()
                      }
                    }}
                    style={{
                      padding: '0.55rem 1rem',
                      backgroundColor: showOrderRequests ? '#0ea5e9' : '#e2e8f0',
                      color: showOrderRequests ? '#ffffff' : '#0f172a',
                      border: showOrderRequests ? '1px solid #0ea5e9' : '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontWeight: 700,
                      minHeight: '44px',
                      cursor: 'pointer',
                      boxShadow: showOrderRequests ? '0 8px 16px rgba(14,165,233,0.25)' : 'none'
                    }}
                  >
                    {language === 'en' ? 'Order Requests' : 'অর্ডার অনুরোধ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => loadOrders()}
                    className="admin-add-btn"
                    style={{ backgroundColor: '#e2e8f0', color: '#0f172a' }}
                  >
                    {language === 'en' ? 'Refresh' : 'রিফ্রেশ'}
                  </button>
              </div>
              </div>

              {showOrderForm && (
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
                  setShowOrderForm(false)
                  resetOrderForm()
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
                      <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                          {editingOrderId ? (language === 'en' ? 'Edit Order' : 'অর্ডার সম্পাদনা') : (language === 'en' ? 'Add New Order' : 'নতুন অর্ডার যোগ করুন')}
                        </h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 600 }}>
                          {language === 'en' ? 'Fill in order details and add to cart' : 'অর্ডারের তথ্য পূরণ করে কার্টে যোগ করুন'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowOrderForm(false)
                          resetOrderForm()
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

                  <div style={{ position: 'relative', zIndex: 1 }}>
                  {orderStatus && (
                    <div style={{
                      padding: '0.75rem',
                      marginBottom: '1rem',
                      borderRadius: '0.5rem',
                      border: orderStatus.includes('error') || orderStatus.includes('Failed') ? '1px solid #fecaca' : '1px solid #bbf7d0',
                      backgroundColor: orderStatus.includes('error') || orderStatus.includes('Failed') ? '#fef2f2' : '#ecfdf3',
                      color: orderStatus.includes('error') || orderStatus.includes('Failed') ? '#b91c1c' : '#065f46',
                      fontWeight: 700
                    }}>
                      {orderStatus}
                    </div>
                  )}
                  <form onSubmit={(e) => { e.preventDefault(); handleAddOrderToCart() }} className="admin-form-grid">
                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Dealer *' : 'ডিলার *'}</label>
                      <select
                        value={orderForm.dealer}
                        onChange={(e) => setOrderForm({ ...orderForm, dealer: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        <option value="">{language === 'en' ? 'Select Dealer' : 'ডিলার নির্বাচন করুন'}</option>
                        {filteredDealers.map((dealer) => {
                          // Get assigned employee name - handle both populated and unpopulated cases
                          let assignedEmployeeName = ''
                          if (dealer.assignedTo) {
                            if (typeof dealer.assignedTo === 'object' && dealer.assignedTo.name) {
                              assignedEmployeeName = dealer.assignedTo.name
                            } else if (typeof dealer.assignedTo === 'object' && dealer.assignedTo.employeeId) {
                              assignedEmployeeName = dealer.assignedTo.employeeId
                            } else {
                              // If assignedTo is just an ID, find the employee
                              const assignedEmployee = (employees || []).find(emp => 
                                String(emp._id) === String(dealer.assignedTo?._id || dealer.assignedTo)
                              )
                              assignedEmployeeName = assignedEmployee?.name || assignedEmployee?.employeeId || ''
                            }
                          }
                          const assignedEmployeeText = assignedEmployeeName ? ` - Assigned: ${assignedEmployeeName}` : ''
                          return (
                            <option key={dealer._id} value={dealer._id}>
                              {dealer.name} {dealer.dealerId ? `(${dealer.dealerId})` : ''}{assignedEmployeeText}
                            </option>
                          )
                        })}
                      </select>
                      {orderForm.dealer && (() => {
                        const selectedDealer = filteredDealers.find(d => d._id === orderForm.dealer)
                        let assignedEmployeeName = null
                        if (selectedDealer?.assignedTo) {
                          if (typeof selectedDealer.assignedTo === 'object' && selectedDealer.assignedTo.name) {
                            assignedEmployeeName = selectedDealer.assignedTo.name
                          } else if (typeof selectedDealer.assignedTo === 'object' && selectedDealer.assignedTo.employeeId) {
                            assignedEmployeeName = selectedDealer.assignedTo.employeeId
                          } else {
                            // If assignedTo is just an ID, find the employee
                            const assignedEmployee = (employees || []).find(emp => 
                              String(emp._id) === String(selectedDealer.assignedTo?._id || selectedDealer.assignedTo)
                            )
                            assignedEmployeeName = assignedEmployee?.name || assignedEmployee?.employeeId || null
                          }
                        }
                        if (assignedEmployeeName) {
                          return (
                            <div style={{
                              marginTop: '0.5rem',
                              padding: '0.5rem',
                              backgroundColor: '#f0f9ff',
                              border: '1px solid #bae6fd',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              color: '#0369a1',
                              fontWeight: 600
                            }}>
                              {language === 'en' ? 'Assigned Employee: ' : 'নির্ধারিত কর্মচারী: '}
                              {assignedEmployeeName}
                            </div>
                          )
                        }
                        return null
                      })()}
                    </div>

                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Product *' : 'পণ্য *'}</label>
                      <select
                        value={orderForm.product}
                        onChange={(e) => setOrderForm({ ...orderForm, product: e.target.value, variant: { name: '', value: '', price: 0 } })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        <option value="">{language === 'en' ? 'Select Product' : 'পণ্য নির্বাচন করুন'}</option>
                        {products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name} {product.productId ? `(${product.productId})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedProductVariants.length > 0 && (
                      <div className="admin-form-group">
                        <label>{language === 'en' ? 'Product Variant *' : 'পণ্যের ভ্যারিয়েন্ট *'}</label>
                        <select
                          value={orderForm.variant.value}
                          onChange={(e) => {
                            const selectedVariant = selectedProductVariants.find(v => v.value === e.target.value)
                            setOrderForm({
                              ...orderForm,
                              variant: selectedVariant ? {
                                name: selectedVariant.name || '',
                                value: selectedVariant.value || '',
                                price: selectedVariant.price || 0
                              } : { name: '', value: '', price: 0 }
                            })
                          }}
                          required
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                          }}
                        >
                          <option value="">{language === 'en' ? 'Select Variant' : 'ভ্যারিয়েন্ট নির্বাচন করুন'}</option>
                          {selectedProductVariants.map((variant, index) => (
                            <option key={index} value={variant.value}>
                              {variant.name || variant.value} - ৳{variant.price || 0}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="admin-form-group">
                      <label>{language === 'en' ? 'Quantity *' : 'পরিমাণ *'}</label>
                      <input
                        type="number"
                        min="1"
                        value={orderForm.quantity}
                        onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>

                    <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                      <label>{language === 'en' ? 'Notes' : 'নোট'}</label>
                      <textarea
                        rows={3}
                        value={orderForm.notes}
                        onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                        placeholder={language === 'en' ? 'Additional notes (optional)' : 'অতিরিক্ত নোট (ঐচ্ছিক)'}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    {/* Paid Amount and Status - Only show when editing */}
                    {editingOrderId && (
                      <>
                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Paid Amount' : 'পরিশোধিত পরিমাণ'}</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={orderForm.paidAmount || 0}
                            onChange={(e) => setOrderForm({ ...orderForm, paidAmount: parseFloat(e.target.value) || 0 })}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem'
                            }}
                          />
                        </div>

                        <div className="admin-form-group">
                          <label>{language === 'en' ? 'Status' : 'স্ট্যাটাস'}</label>
                          <select
                            value={orderForm.status}
                            onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem'
                            }}
                          >
                            <option value="Pending">{language === 'en' ? 'Pending' : 'অপেক্ষমাণ'}</option>
                            <option value="Processing">{language === 'en' ? 'Processing' : 'প্রক্রিয়াকরণ'}</option>
                            <option value="Shipped">{language === 'en' ? 'Shipped' : 'প্রেরিত'}</option>
                            <option value="Delivered">{language === 'en' ? 'Delivered' : 'বিতরণকৃত'}</option>
                            <option value="Complete">{language === 'en' ? 'Complete' : 'সম্পন্ন'}</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        disabled={savingOrder}
                        onClick={handleAddOrderToCart}
                        style={{
                          padding: '0.65rem 1.2rem',
                          backgroundColor: '#0ea5e9',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontWeight: 700,
                          cursor: savingOrder ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {language === 'en' ? 'Add to Cart' : 'কার্টে যোগ করুন'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowOrderForm(false)
                          resetOrderForm()
                        }}
                        style={{
                          padding: '0.65rem 1.2rem',
                          backgroundColor: '#64748b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {adminContent.cancel}
                      </button>
                    </div>
                  </form>

                  {/* Cart Details Section */}
                  {orderCart.length > 0 && (
                    <div style={{ position: 'relative', zIndex: 1, marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                          {language === 'en' ? 'Order Cart' : 'অর্ডার কার্ট'}
                        </h3>
                        <span style={{
                          padding: '0.35rem 0.75rem',
                          backgroundColor: '#e0f2fe',
                          color: '#0ea5e9',
                          borderRadius: '999px',
                          fontSize: '0.875rem',
                          fontWeight: 700
                        }}>
                          {orderCart.length} {language === 'en' ? 'item(s)' : 'আইটেম'}
                        </span>
                      </div>
                      <div style={{ marginBottom: '0.75rem', color: '#475569', fontWeight: 600 }}>
                        {language === 'en' ? 'Dealer:' : 'ডিলার:'} {filteredDealers.find(d => d._id === orderForm.dealer)?.name || '-'}
                      </div>
                      <div className="admin-table-container" style={{ marginBottom: '1rem', background: '#fff', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>{language === 'en' ? 'Product' : 'পণ্য'}</th>
                              <th>{language === 'en' ? 'Variant' : 'ভ্যারিয়েন্ট'}</th>
                              <th>{language === 'en' ? 'Qty' : 'পরিমাণ'}</th>
                              <th>{language === 'en' ? 'Total' : 'মোট'}</th>
                              <th>{language === 'en' ? 'Status' : 'স্ট্যাটাস'}</th>
                              <th>{language === 'en' ? 'Notes' : 'নোট'}</th>
                              <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderCart.map((item, idx) => (
                              <tr key={`${item.product}-${idx}`}>
                                <td>{item.productName || item.productId || '-'}</td>
                                <td>{item.variant?.value ? (item.variant.name || item.variant.value) : '-'}</td>
                                <td>{item.quantity}</td>
                                <td>৳{getCartItemTotal(item).toFixed(2)}</td>
                                <td>
                                  <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.25rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151'
                                  }}>
                                    {item.status || 'Pending'}
                                  </span>
                                </td>
                                <td>{item.notes || '-'}</td>
                                <td>
                                  <button
                                    className="admin-action-btn delete"
                                    onClick={() => handleRemoveCartItem(idx)}
                                    style={{
                                      padding: '0.35rem 0.75rem',
                                      fontSize: '0.875rem'
                                    }}
                                  >
                                    {adminContent.delete}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700, padding: '0.75rem' }}>
                                {language === 'en' ? 'Cart Total:' : 'কার্ট মোট:'}
                              </td>
                              <td colSpan="4" style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', padding: '0.75rem' }}>
                                ৳{getOrderCartTotal().toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                        <button
                          type="button"
                          disabled={savingOrder}
                          onClick={handleConfirmOrders}
                          style={{
                            padding: '0.65rem 1.5rem',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: 700,
                            cursor: savingOrder ? 'not-allowed' : 'pointer',
                            boxShadow: '0 10px 20px rgba(22,163,74,0.35)'
                          }}
                        >
                          {savingOrder
                            ? (language === 'en' ? 'Saving...' : 'সংরক্ষণ হচ্ছে...')
                            : (language === 'en' ? 'Confirm Order' : 'অর্ডার নিশ্চিত করুন')}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOrderCart([])
                            setShowOrderCart(false)
                          }}
                          style={{
                            padding: '0.65rem 1.5rem',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(239,68,68,0.35)'
                          }}
                        >
                          {language === 'en' ? 'Clear Cart' : 'কার্ট খালি করুন'}
                        </button>
                      </div>
                    </div>
                  )}
                  </div>
                  </div>
                </div>
              )}

              <div className="admin-table-container">
                {showOrderRequests && (
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
                    setShowOrderRequests(false)
                  }}>
                    <div style={{
                      position: 'relative',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
                      borderRadius: '0.75rem',
                      padding: '2rem',
                      maxWidth: '1200px',
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
                        <div>
                          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                            {language === 'en' ? 'Pending Order Requests' : 'অপেক্ষমাণ অর্ডার অনুরোধ'}
                          </h2>
                          <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 600 }}>
                            {language === 'en' ? 'Approve or reject pending requests' : 'অপেক্ষমাণ অনুরোধ অনুমোদন বা বাতিল করুন'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span
                            style={{
                              fontWeight: 800,
                              color: '#0ea5e9',
                              background: '#e0f2fe',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '999px',
                              border: '1px solid #bae6fd',
                              minWidth: '72px',
                              textAlign: 'center'
                            }}
                          >
                            {orderRequests.length} {language === 'en' ? 'pending' : 'অপেক্ষমাণ'}
                          </span>
                          <button
                            onClick={() => {
                              setShowOrderRequests(false)
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

                      <div style={{ position: 'relative', zIndex: 1 }}>

                    {orderRequests.length === 0 ? (
                      <div style={{ padding: '0.75rem', color: '#475569' }}>
                        {language === 'en' ? 'No pending requests.' : 'কোনো অপেক্ষমাণ অনুরোধ নেই।'}
                      </div>
                    ) : (
                      <div className="admin-table-container" style={{ background: '#fff', borderRadius: '0.65rem', border: '1px solid #e2e8f0' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                              <th>{language === 'en' ? 'Date' : 'তারিখ'}</th>
                      <th>{language === 'en' ? 'Order ID' : 'অর্ডার আইডি'}</th>
                              <th>{language === 'en' ? 'Dealer' : 'ডিলার'}</th>
                              <th>{language === 'en' ? 'Dealer ID' : 'ডিলার আইডি'}</th>
                      <th>{language === 'en' ? 'Product' : 'পণ্য'}</th>
                              <th>{language === 'en' ? 'Variant' : 'ভ্যারিয়েন্ট'}</th>
                              <th>{language === 'en' ? 'Qty' : 'পরিমাণ'}</th>
                              <th>{language === 'en' ? 'Requested By' : 'অনুরোধকারী'}</th>
                              <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orderRequests.map((order) => {
                              const isAdmin = (userRole || '').toLowerCase() === 'admin'
                              return (
                                <tr key={order._id}>
                                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                                  <td>{order.orderId || '-'}</td>
                                  <td>{order.dealerName || order.dealer?.name || '-'}</td>
                                  <td>{order.dealerId || order.dealer?.dealerId || '-'}</td>
                                  <td>{order.productName || order.product?.name || '-'}</td>
                                  <td>{order.variant?.value ? (order.variant.name || order.variant.value) : '-'}</td>
                                  <td>{order.quantity || 0}</td>
                                  <td>{order.requestedByName || order.requestedByRole || '-'}</td>
                                  <td>
                                    <div className="admin-action-buttons">
                                      {isAdmin ? (
                                        <>
                                          <button
                                            className="admin-action-btn edit"
                                            onClick={async () => {
                                              try {
                                                const res = await fetch(`${API_BASE}/api/orders/${order._id}`, {
                                                  method: 'PUT',
                                                  headers: { 'Content-Type': 'application/json' },
                                                  body: JSON.stringify({ 
                                                    approvalStatus: 'Approved',
                                                    approvedBy: loggedInUserId,
                                                    approvedByName: loggedInUser || 'Admin'
                                                  })
                                                })
                                                const data = await res.json()
                                                if (!res.ok) throw new Error(data.message || 'Failed to approve')
                                                await loadOrders()
                                                await loadOrderRequests()
                                                // Reload employees to update achieved target
                                                const empRes = await fetch(`${API_BASE}/api/employees`)
                                                if (empRes.ok) {
                                                  const empData = await empRes.json()
                                                  setEmployees(empData.data || [])
                                                  
                                                  // Update viewingEmployee if it's the same employee who created the order
                                                  if (viewingEmployee && order.requestedBy && viewingEmployee._id === order.requestedBy) {
                                                    const updatedEmp = empData.data.find(e => e._id === order.requestedBy)
                                                    if (updatedEmp) {
                                                      setViewingEmployee({ ...updatedEmp, status: normalizeSalaryStatus(updatedEmp.status) })
                                                    }
                                                  }
                                                }
                                              } catch (err) {
                                                alert(language === 'en' ? 'Approval failed' : 'অনুমোদন ব্যর্থ')
                                                console.error(err)
                                              }
                                            }}
                                          >
                                            {language === 'en' ? 'Approve' : 'অনুমোদন'}
                                          </button>
                                          <button
                                            className="admin-action-btn delete"
                                            onClick={async () => {
                                              try {
                                                const res = await fetch(`${API_BASE}/api/orders/${order._id}`, {
                                                  method: 'PUT',
                                                  headers: { 'Content-Type': 'application/json' },
                                                  body: JSON.stringify({ approvalStatus: 'Rejected', status: 'Cancelled' })
                                                })
                                                const data = await res.json()
                                                if (!res.ok) throw new Error(data.message || 'Failed to reject')
                                                await loadOrders()
                                                await loadOrderRequests()
                                              } catch (err) {
                                                alert(language === 'en' ? 'Rejection failed' : 'বাতিল ব্যর্থ')
                                                console.error(err)
                                              }
                                            }}
                                          >
                                            {language === 'en' ? 'Reject' : 'বাতিল'}
                                          </button>
                                          <button
                                            className="admin-action-btn edit"
                                            style={{ backgroundColor: '#e0e7ff', color: '#1d4ed8' }}
                                            onClick={() => {
                                              setViewingOrder(order)
                                              setIsEditingOrderDetails(false)
                                              setEditingOrderDetails(null)
                                            }}
                                          >
                                            {language === 'en' ? 'View' : 'দেখুন'}
                                          </button>
                                        </>
                                      ) : (
                                        <button
                                          className="admin-action-btn edit"
                                          onClick={() => {
                                            setEditingOrderId(order._id)
                                            const existingItems = Array.isArray(order.items) && order.items.length
                                              ? order.items
                                              : [{
                                                  product: order.product?._id || order.product || '',
                                                  productName: order.productName || '',
                                                  productId: order.productId || '',
                                                  variant: order.variant || { name: '', value: '', price: 0 },
                                                  quantity: order.quantity || 1,
                                                  notes: order.notes || '',
                                                  status: order.status || 'Pending'
                                                }]
                                            setOrderCart(existingItems.map((it) => ({
                                              product: it.product,
                                              productName: it.productName,
                                              productId: it.productId,
                                              variant: it.variant,
                                              quantity: it.quantity,
                                              notes: it.notes,
                                              status: it.status || 'Pending'
                                            })))
                                            setOrderForm({
                                              dealer: order.dealer?._id || order.dealer || '',
                                              product: existingItems[0]?.product || '',
                                              variant: existingItems[0]?.variant || { name: '', value: '', price: 0 },
                                              quantity: existingItems[0]?.quantity || 1,
                                              notes: existingItems[0]?.notes || '',
                                              status: existingItems[0]?.status || 'Pending'
                                            })
                                            setShowOrderForm(true)
                                            setShowOrderCart(true)
                                            setShowOrderRequests(false)
                                          }}
                                        >
                                          {language === 'en' ? 'Edit' : 'সম্পাদনা'}
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                      </div>
                    </div>
                  </div>
                )}

                {!showOrderRequests && !showOrderForm && (
                <div className="admin-table-container" style={{ marginTop: '1rem' }}>
                  <div className="admin-search-bar" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder={language === 'en' ? 'Search orders...' : 'অর্ডার খুঁজুন...'} 
                      value={orderSearch || ''}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      onClick={() => setOrderFilter('rejected')}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: orderFilter === 'rejected' ? '#ef4444' : '#e2e8f0',
                        color: orderFilter === 'rejected' ? 'white' : '#0f172a',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {language === 'en' ? 'Rejected Orders' : 'প্রত্যাখ্যাত অর্ডার'}
                    </button>
                    <button
                      onClick={() => setOrderFilter('cancelled')}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: orderFilter === 'cancelled' ? '#f59e0b' : '#e2e8f0',
                        color: orderFilter === 'cancelled' ? 'white' : '#0f172a',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {language === 'en' ? 'Cancelled Orders' : 'বাতিল অর্ডার'}
                    </button>
                    {orderFilter !== 'all' && (
                      <button
                        onClick={() => setOrderFilter('all')}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {language === 'en' ? 'All Orders' : 'সব অর্ডার'}
                      </button>
                    )}
                    <button
                      onClick={handleExportOrders}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      {language === 'en' ? 'Export Excel' : 'এক্সেল রপ্তানি'}
                    </button>
                  </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th 
                        onClick={() => handleSortOrders('date')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Date' : 'তারিখ'}
                        {orderSortField === 'date' && (orderSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortOrders('orderId')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Order ID' : 'অর্ডার আইডি'}
                        {orderSortField === 'orderId' && (orderSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortOrders('dealer')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Dealer' : 'ডিলার'}
                        {orderSortField === 'dealer' && (orderSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortOrders('dealerId')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Dealer ID' : 'ডিলার আইডি'}
                        {orderSortField === 'dealerId' && (orderSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortOrders('product')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Product' : 'পণ্য'}
                        {orderSortField === 'product' && (orderSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th>{language === 'en' ? 'Variant' : 'ভ্যারিয়েন্ট'}</th>
                      <th 
                        onClick={() => handleSortOrders('quantity')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Quantity' : 'পরিমাণ'}
                        {orderSortField === 'quantity' && (orderSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortOrders('createdBy')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Created By' : 'তৈরিকারী'}
                        {orderSortField === 'createdBy' && (orderSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortOrders('totalPrice')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Total Price' : 'মোট মূল্য'}
                        {orderSortField === 'totalPrice' && (orderSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortOrders('paidAmount')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Paid Amount' : 'পরিশোধিত পরিমাণ'}
                        {orderSortField === 'paidAmount' && (orderSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortOrders('dueAmount')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Due Amount' : 'বাকি পরিমাণ'}
                        {orderSortField === 'dueAmount' && (orderSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th 
                        onClick={() => handleSortOrders('status')}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {language === 'en' ? 'Status' : 'স্ট্যাটাস'}
                        {orderSortField === 'status' && (orderSortDirection === 'asc' ? ' ↑' : ' ↓')}
                      </th>
                      <th>{language === 'en' ? 'Actions' : 'কার্যক্রম'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders.length ? sortedOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</td>
                        <td>{order.orderId || '-'}</td>
                        <td>{order.dealerName || order.dealer?.name || '-'}</td>
                        <td>{order.dealerId || order.dealer?.dealerId || '-'}</td>
                        <td>{order.productName || order.product?.name || '-'}</td>
                        <td>
                          {order.variant && order.variant.value
                            ? `${order.variant.name || order.variant.value}`
                            : '-'}
                        </td>
                        <td>{order.quantity || 0}</td>
                        <td>{order.requestedByName || order.requestedByRole || '-'}</td>
                        <td>৳{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</td>
                        <td style={{ fontWeight: 600, color: '#16a34a' }}>
                          ৳{order.paidAmount ? parseFloat(order.paidAmount).toFixed(2) : '0.00'}
                        </td>
                        <td style={{ fontWeight: 600, color: (() => {
                          const due = order.dueAmount !== undefined 
                            ? parseFloat(order.dueAmount) 
                            : Math.max(0, parseFloat(order.totalPrice || 0) - parseFloat(order.paidAmount || 0))
                          return due > 0 ? '#dc2626' : '#16a34a'
                        })() }}>
                          ৳{(() => {
                            const due = order.dueAmount !== undefined 
                              ? parseFloat(order.dueAmount) 
                              : Math.max(0, parseFloat(order.totalPrice || 0) - parseFloat(order.paidAmount || 0))
                            return due.toFixed(2)
                          })()}
                        </td>
                        <td>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backgroundColor: 
                              order.status === 'Complete' ? '#dcfce7' :
                              order.status === 'Delivered' ? '#d1fae5' :
                              order.status === 'Shipped' ? '#dbeafe' :
                              order.status === 'Processing' ? '#fef3c7' :
                              order.status === 'Cancelled' ? '#fee2e2' :
                              '#f3f4f6',
                            color:
                              order.status === 'Complete' ? '#166534' :
                              order.status === 'Delivered' ? '#065f46' :
                              order.status === 'Shipped' ? '#1e40af' :
                              order.status === 'Processing' ? '#92400e' :
                              order.status === 'Cancelled' ? '#b91c1c' :
                              '#374151'
                          }}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-action-buttons">
                            <button 
                              className="admin-action-btn edit"
                              style={{ backgroundColor: '#e0e7ff', color: '#1d4ed8' }}
                              onClick={() => setViewingOrder(order)}
                            >
                              {language === 'en' ? 'View' : 'দেখুন'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="13" style={{ textAlign: 'center', padding: '2rem' }}>
                          {adminContent.noData}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
                )}

                {/* Order Details Card */}
                {viewingOrder && !showOrderForm && (
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
                  }} onClick={() => setViewingOrder(null)}>
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
                        <div>
                          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                            {language === 'en' ? 'Order Details' : 'অর্ডার বিবরণ'}
                          </h2>
                          <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontWeight: 600 }}>
                            {viewingOrder.orderId || 'N/A'}
                          </p>
                        </div>
                        <button
                          onClick={() => setViewingOrder(null)}
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

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', position: 'relative', zIndex: 1 }}>
                        {/* Order ID */}
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Order ID' : 'অর্ডার আইডি'}
                          </label>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                            {viewingOrder.orderId || 'N/A'}
                          </p>
                        </div>

                        {/* Date */}
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Date' : 'তারিখ'}
                          </label>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                            {viewingOrder.createdAt ? new Date(viewingOrder.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>

                        {/* Dealer Name */}
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Dealer Name' : 'ডিলারের নাম'}
                          </label>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                            {viewingOrder.dealerName || viewingOrder.dealer?.name || 'N/A'}
                          </p>
                        </div>

                        {/* Dealer ID */}
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Dealer ID' : 'ডিলার আইডি'}
                          </label>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                            {viewingOrder.dealerId || viewingOrder.dealer?.dealerId || 'N/A'}
                          </p>
                        </div>

                        {/* Total Price */}
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Total Price' : 'মোট মূল্য'}
                          </label>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827', fontWeight: 600 }}>
                            ৳{viewingOrder.totalPrice ? viewingOrder.totalPrice.toFixed(2) : '0.00'}
                          </p>
                        </div>

                        {/* Paid Amount */}
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Paid Amount' : 'পরিশোধিত পরিমাণ'}
                          </label>
                          {isEditingOrderDetails ? (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editingOrderDetails?.paidAmount || 0}
                              onChange={(e) => {
                                const paid = parseFloat(e.target.value) || 0
                                const total = parseFloat(viewingOrder.totalPrice || 0)
                                const due = Math.max(0, total - paid)
                                setEditingOrderDetails({
                                  ...editingOrderDetails,
                                  paidAmount: paid,
                                  dueAmount: due
                                })
                              }}
                              style={{
                                marginTop: '0.5rem',
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '1rem',
                                fontWeight: 600
                              }}
                            />
                          ) : (
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#16a34a', fontWeight: 600 }}>
                              ৳{viewingOrder.paidAmount ? parseFloat(viewingOrder.paidAmount).toFixed(2) : '0.00'}
                            </p>
                          )}
                        </div>

                        {/* Due Amount */}
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Due Amount' : 'বাকি পরিমাণ'}
                          </label>
                          <p style={{ 
                            margin: '0.5rem 0 0 0', 
                            fontSize: '1rem', 
                            color: (() => {
                              const due = isEditingOrderDetails && editingOrderDetails
                                ? parseFloat(editingOrderDetails.dueAmount || 0)
                                : (viewingOrder.dueAmount !== undefined 
                                  ? parseFloat(viewingOrder.dueAmount) 
                                  : Math.max(0, parseFloat(viewingOrder.totalPrice || 0) - parseFloat(viewingOrder.paidAmount || 0)))
                              return due > 0 ? '#dc2626' : '#16a34a'
                            })(), 
                            fontWeight: 600 
                          }}>
                            ৳{(() => {
                              const due = isEditingOrderDetails && editingOrderDetails
                                ? parseFloat(editingOrderDetails.dueAmount || 0)
                                : (viewingOrder.dueAmount !== undefined 
                                  ? parseFloat(viewingOrder.dueAmount) 
                                  : Math.max(0, parseFloat(viewingOrder.totalPrice || 0) - parseFloat(viewingOrder.paidAmount || 0)))
                              return due.toFixed(2)
                            })()}
                          </p>
                        </div>

                        {/* Status */}
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Status' : 'স্ট্যাটাস'}
                          </label>
                          {isEditingOrderDetails ? (
                            <select
                              value={editingOrderDetails?.status || 'Pending'}
                              onChange={(e) => setEditingOrderDetails({ ...editingOrderDetails, status: e.target.value })}
                              style={{
                                marginTop: '0.5rem',
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '1rem'
                              }}
                            >
                              {(userRole || '').toLowerCase() === 'admin' ? (
                                <>
                                  <option value="Pending">{language === 'en' ? 'Pending' : 'অপেক্ষমাণ'}</option>
                                  <option value="Processing">{language === 'en' ? 'Processing' : 'প্রক্রিয়াকরণ'}</option>
                                  <option value="Shipped">{language === 'en' ? 'Shipped' : 'প্রেরিত'}</option>
                                  <option value="Delivered">{language === 'en' ? 'Delivered' : 'বিতরণকৃত'}</option>
                                  <option value="Complete">{language === 'en' ? 'Complete' : 'সম্পন্ন'}</option>
                                  <option value="Cancelled">{language === 'en' ? 'Cancelled' : 'বাতিল'}</option>
                                </>
                              ) : (
                                <>
                                  <option value="Shipped">{language === 'en' ? 'Shipped' : 'প্রেরিত'}</option>
                                  <option value="Delivered">{language === 'en' ? 'Delivered' : 'বিতরণকৃত'}</option>
                                  <option value="Complete">{language === 'en' ? 'Complete' : 'সম্পন্ন'}</option>
                                </>
                              )}
                            </select>
                          ) : (
                            <p style={{ margin: '0.5rem 0 0 0' }}>
                              <span style={{
                                padding: '0.35rem 0.75rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                backgroundColor: 
                                  viewingOrder.status === 'Complete' ? '#dcfce7' :
                                  viewingOrder.status === 'Delivered' ? '#d1fae5' :
                                  viewingOrder.status === 'Shipped' ? '#dbeafe' :
                                  viewingOrder.status === 'Processing' ? '#fef3c7' :
                                  viewingOrder.status === 'Cancelled' ? '#fee2e2' :
                                  '#f3f4f6',
                                color:
                                  viewingOrder.status === 'Complete' ? '#166534' :
                                  viewingOrder.status === 'Delivered' ? '#065f46' :
                                  viewingOrder.status === 'Shipped' ? '#1e40af' :
                                  viewingOrder.status === 'Processing' ? '#92400e' :
                                  viewingOrder.status === 'Cancelled' ? '#b91c1c' :
                                  '#374151'
                              }}>
                                {viewingOrder.status || 'Pending'}
                              </span>
                            </p>
                          )}
                        </div>

                        {/* Approval Status */}
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Approval Status' : 'অনুমোদন স্ট্যাটাস'}
                          </label>
                          <p style={{ margin: '0.5rem 0 0 0' }}>
                            <span style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              backgroundColor: 
                                viewingOrder.approvalStatus === 'Approved' ? '#d1fae5' :
                                viewingOrder.approvalStatus === 'Rejected' ? '#fee2e2' :
                                '#fef3c7',
                              color:
                                viewingOrder.approvalStatus === 'Approved' ? '#065f46' :
                                viewingOrder.approvalStatus === 'Rejected' ? '#b91c1c' :
                                '#92400e'
                            }}>
                              {viewingOrder.approvalStatus || 'Pending'}
                            </span>
                          </p>
                        </div>

                        {/* Requested By */}
                        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Requested By' : 'অনুরোধকারী'}
                          </label>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827' }}>
                            {viewingOrder.requestedByName || viewingOrder.requestedByRole || 'N/A'}
                          </p>
                        </div>

                        {/* Notes */}
                        <div style={{ gridColumn: '1 / -1', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600 }}>
                            {language === 'en' ? 'Notes' : 'নোট'}
                          </label>
                          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#111827', whiteSpace: 'pre-wrap' }}>
                            {viewingOrder.notes || 'N/A'}
                          </p>
                        </div>

                        {/* Order Items Table (if multi-item order) */}
                        {Array.isArray(viewingOrder.items) && viewingOrder.items.length > 0 && (
                          <div style={{ gridColumn: '1 / -1', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
                            <label style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 600, marginBottom: '0.75rem', display: 'block' }}>
                              {language === 'en' ? 'Order Items' : 'অর্ডার আইটেম'}
                            </label>
                            <div className="admin-table-container" style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                              <table className="admin-table">
                                <thead>
                                  <tr>
                                    <th>{language === 'en' ? 'Product' : 'পণ্য'}</th>
                                    <th>{language === 'en' ? 'Variant' : 'ভ্যারিয়েন্ট'}</th>
                                    <th>{language === 'en' ? 'Qty' : 'পরিমাণ'}</th>
                                    <th>{language === 'en' ? 'Unit Price' : 'একক মূল্য'}</th>
                                    <th>{language === 'en' ? 'Total' : 'মোট'}</th>
                                    <th>{language === 'en' ? 'Notes' : 'নোট'}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {viewingOrder.items.map((item, idx) => (
                                    <tr key={idx}>
                                      <td>{item.productName || '-'}</td>
                                      <td>{item.variant?.value ? (item.variant.name || item.variant.value) : '-'}</td>
                                      <td>{item.quantity || 0}</td>
                                      <td>৳{item.unitPrice !== undefined ? (item.unitPrice || 0).toFixed(2) : '-'}</td>
                                      <td>৳{item.totalPrice !== undefined ? (item.totalPrice || 0).toFixed(2) : '-'}</td>
                                      <td>{item.notes || '-'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div style={{ position: 'relative', display: 'flex', gap: '0.75rem', marginTop: '1.5rem', zIndex: 1 }}>
                        {isEditingOrderDetails ? (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`${API_BASE}/api/orders/${viewingOrder._id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      paidAmount: editingOrderDetails.paidAmount || 0,
                                      status: editingOrderDetails.status || 'Pending'
                                    })
                                  })
                                  const data = await res.json()
                                  if (!res.ok) throw new Error(data.message || 'Failed to update order')
                                  await loadOrders()
                                  await loadOrderRequests()
                                  setViewingOrder({ ...viewingOrder, ...editingOrderDetails })
                                  setIsEditingOrderDetails(false)
                                  setEditingOrderDetails(null)
                                } catch (err) {
                                  alert(language === 'en' ? 'Failed to update order' : 'অর্ডার আপডেট করতে ব্যর্থ')
                                  console.error(err)
                                }
                              }}
                              style={{
                                padding: '0.5rem 1.5rem',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 700,
                                boxShadow: '0 10px 20px rgba(16,185,129,0.35)'
                              }}
                            >
                              {language === 'en' ? 'Save' : 'সংরক্ষণ'}
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingOrderDetails(false)
                                setEditingOrderDetails(null)
                              }}
                              style={{
                                padding: '0.5rem 1.5rem',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 700
                              }}
                            >
                              {language === 'en' ? 'Cancel' : 'বাতিল'}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setIsEditingOrderDetails(true)
                                const total = parseFloat(viewingOrder.totalPrice || 0)
                                const paid = parseFloat(viewingOrder.paidAmount || 0)
                                const due = Math.max(0, total - paid)
                                const currentStatus = viewingOrder.status || 'Pending'
                                // For non-admin users, if status is not Shipped, Delivered, or Complete, default to Shipped
                                let initialStatus = currentStatus
                                if ((userRole || '').toLowerCase() !== 'admin') {
                                  if (currentStatus !== 'Shipped' && currentStatus !== 'Delivered' && currentStatus !== 'Complete') {
                                    initialStatus = 'Shipped'
                                  }
                                }
                                setEditingOrderDetails({
                                  paidAmount: paid,
                                  dueAmount: due,
                                  status: initialStatus
                                })
                              }}
                              style={{
                                padding: '0.5rem 1.5rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 700,
                                boxShadow: '0 10px 20px rgba(59,130,246,0.35)'
                              }}
                            >
                              {adminContent.edit}
                            </button>
                            {(userRole || '').toLowerCase() === 'admin' && (
                              <button
                                onClick={async () => {
                                  if (window.confirm(language === 'en' ? 'Are you sure you want to delete this order?' : 'আপনি কি এই অর্ডারটি মুছতে চান?')) {
                                    await handleDeleteOrder(viewingOrder._id)
                                    setViewingOrder(null)
                                  }
                                }}
                                style={{
                                  padding: '0.5rem 1.5rem',
                                  backgroundColor: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.5rem',
                                  cursor: 'pointer',
                                  fontWeight: 700,
                                  boxShadow: '0 10px 20px rgba(239,68,68,0.35)'
                                }}
                              >
                                {adminContent.delete}
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => {
                            setViewingOrder(null)
                            setIsEditingOrderDetails(false)
                            setEditingOrderDetails(null)
                          }}
                          style={{
                            padding: '0.5rem 1.5rem',
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: 700
                          }}
                        >
                          {language === 'en' ? 'Close' : 'বন্ধ করুন'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
              <div className="admin-stats-grid" style={{ marginTop: '1.5rem' }}>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Achieve Amount' : 'অর্জিত পরিমাণ'}</h3>
                    <p>
                      ৳{(() => {
                        const achieveAmount = (orders || []).reduce((sum, order) => {
                          // Exclude cancelled and rejected orders from calculations
                          if (order.status === 'Cancelled' || order.approvalStatus === 'Rejected') {
                            return sum
                          }
                          
                          // Count all approved orders (including admin-created orders)
                          const isApproved = order.approvalStatus === 'Approved'
                          
                          if (isApproved) {
                            return sum + (parseFloat(order.totalPrice) || 0)
                          }
                          return sum
                        }, 0)
                        return achieveAmount.toLocaleString()
                      })()}
                    </p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6 4.03-6 9-6 9 4.8 9 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 17c-4.97 0-9-4.8-9-6 0-1.2 4.03-6 9-6s9 4.8 9 6c0 1.2-4.03 6-9 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Total Collection' : 'মোট সংগ্রহ'}</h3>
                    <p>৳{Number(totalCollection || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="admin-stat-info">
                    <h3>{language === 'en' ? 'Total Due' : 'মোট বকেয়া'}</h3>
                    <p>৳{Number(totalDue || 0).toLocaleString()}</p>
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

