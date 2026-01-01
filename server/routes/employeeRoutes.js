import express from 'express'
import bcrypt from 'bcryptjs'
import Employee from '../models/Employee.js'

// Normalize salary status to Paid/Unpaid
const normalizeStatus = (status) => status === 'Paid' ? 'Paid' : 'Unpaid'

const router = express.Router()

// Generate username from email or name
const generateUsername = async (email, name) => {
  let baseUsername = ''
  if (email) {
    baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  } else {
    baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)
  }

  // Prevent using 'admin' as username
  if (baseUsername === 'admin') {
    baseUsername = 'admin' + Date.now().toString().slice(-4)
  }

  let username = baseUsername
  let counter = 1
  while (await Employee.findOne({ username }) || username === 'admin') {
    username = `${baseUsername}${counter}`
    counter++
  }
  return username
}

// Generate employee ID (bcc001, bcc002, etc.)
const generateEmployeeId = async () => {
  try {
    // Find the last employee to get the highest number
    const lastEmployee = await Employee.findOne({ employeeId: { $exists: true } })
      .sort({ employeeId: -1 })
      .exec()

    let nextNumber = 1
    if (lastEmployee && lastEmployee.employeeId) {
      // Extract number from employeeId (e.g., "bcc001" -> 1)
      const match = lastEmployee.employeeId.match(/bcc(\d+)/i)
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1
      }
    }

    // Format as bcc001, bcc002, etc. (3 digits)
    return `bcc${String(nextNumber).padStart(3, '0')}`
  } catch (err) {
    console.error('Error generating employee ID:', err)
    // Fallback: use timestamp-based ID
    return `bcc${String(Date.now()).slice(-3)}`
  }
}

// Generate default password (can be customized)
const generateDefaultPassword = () => {
  // Generate a random 8-character password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// Create
router.post('/', async (req, res) => {
  try {
    const {
      name, email, phone, address, nid, document,
      emergencyContactName, emergencyContact, salary, salesTarget,
      bankName, bankBranch, accountNumber,
      department, postingArea, role, designation, photo, status,
      regionId, areaId, territoryId
    } = req.body

    console.log('[Employee Create] Received data:', {
      name, email, phone, address, nid,
      hasDocument: !!document,
      emergencyContactName, emergencyContact, salary,
      department, role, designation, salesTarget,
      postingArea
    })

    // Generate employee ID
    const employeeId = await generateEmployeeId()
    console.log('[Employee Create] Generated employee ID:', employeeId)

    // Generate username
    const username = await generateUsername(email, name)

    // Generate default password
    const defaultPassword = generateDefaultPassword()
    const passwordHash = await bcrypt.hash(defaultPassword, 10)

    // Ensure all fields are explicitly set
    const employeeData = {
      employeeId: employeeId || '',
      name: name || '',
      email: email || '',
      phone: phone || '',
      address: address || '',
      nid: nid || '',
      document: document || '',
      emergencyContactName: emergencyContactName || '',
      emergencyContact: emergencyContact || '',
      salary: salary ? parseFloat(salary) : 0,
      salesTarget: salesTarget ? parseFloat(salesTarget) : 0,
      bankName: bankName || '',
      bankBranch: bankBranch || '',
      accountNumber: accountNumber || '',
      department: department || '',
      regionId: regionId || '',
      areaId: areaId || '',
      territoryId: territoryId || '',
      postingArea: postingArea || '',
      role: role || '',
      designation: designation || '',
      photo: photo || '',
      username: username || '',
      passwordHash: passwordHash || '',
      status: normalizeStatus(status)
    }

    // Validate required fields
    if (!employeeData.name) {
      return res.status(400).json({ message: 'Name is required' })
    }

    console.log('[Employee Create] Creating employee with data:', { ...employeeData, passwordHash: '***' })

    // Create employee with all fields
    const emp = await Employee.create(employeeData)
    console.log('[Employee Create] Raw created employee:', emp.toObject())

    // Reload from database to ensure all fields are saved
    const savedEmp = await Employee.findById(emp._id).lean()
    console.log('[Employee Create] Employee saved to DB:', {
      _id: savedEmp._id,
      employeeId: savedEmp.employeeId,
      name: savedEmp.name,
      email: savedEmp.email,
      address: savedEmp.address,
      nid: savedEmp.nid,
      hasDocument: !!savedEmp.document,
      documentLength: savedEmp.document ? savedEmp.document.length : 0,
      emergencyContactName: savedEmp.emergencyContactName,
      emergencyContact: savedEmp.emergencyContact,
      salary: savedEmp.salary,
      department: savedEmp.department,
      postingArea: savedEmp.postingArea,
      role: savedEmp.role,
      designation: savedEmp.designation
    })

    // Return employee data with generated password (only on creation)
    const responseData = {
      ...savedEmp,
      generatedPassword: defaultPassword // Only returned once for admin to share with employee
    }

    console.log('[Employee Create] Response data:', {
      employeeId: responseData.employeeId,
      salary: responseData.salary,
      hasAddress: !!responseData.address,
      hasNID: !!responseData.nid
    })

    res.json({
      success: true,
      data: responseData
    })
  } catch (err) {
    console.error('[Employee Create] Error:', err)
    console.error('[Employee Create] Error details:', {
      message: err.message,
      code: err.code,
      keyPattern: err.keyPattern,
      keyValue: err.keyValue
    })
    if (err.code === 11000) {
      const duplicateField = err.keyPattern ? Object.keys(err.keyPattern)[0] : 'field'
      return res.status(400).json({
        message: `${duplicateField === 'email' ? 'Email' : duplicateField === 'username' ? 'Username' : duplicateField === 'employeeId' ? 'Employee ID' : 'Field'} already exists`,
        error: err.message
      })
    }
    res.status(500).json({
      message: 'Failed to create employee',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  }
})

// List
router.get('/', async (_req, res) => {
  try {
    const list = await Employee.find().sort({ createdAt: -1 })
    const normalizedList = list.map((e) => ({
      ...e.toObject(),
      status: normalizeStatus(e.status)
    }))
    res.json({ success: true, data: normalizedList })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch employees' })
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Employee not found' })
    }
    res.json({ success: true, data: deleted })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete employee' })
  }
})

// Employee Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    // Prevent admin username from logging in as employee
    if (username.toLowerCase() === 'admin') {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const employee = await Employee.findOne({
      $or: [
        { username },
        { email: username }
      ]
    })

    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (!employee.passwordHash) {
      return res.status(401).json({ message: 'Account not properly set up' })
    }

    const isValidPassword = await bcrypt.compare(password, employee.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Return employee data (without password hash)
    res.json({
      success: true,
      role: employee.role,
      name: employee.name,
      email: employee.email,
      photo: employee.photo,
      department: employee.department,
      designation: employee.designation,
      id: employee._id
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Login failed' })
  }
})

// Reset employee password (admin only - generates new password)
router.post('/reset-password', async (req, res) => {
  try {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({ message: 'Employee ID is required' })
    }

    const employee = await Employee.findById(id)

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    // Generate new password
    const newPassword = generateDefaultPassword()
    const passwordHash = await bcrypt.hash(newPassword, 10)

    employee.passwordHash = passwordHash
    await employee.save()

    res.json({
      success: true,
      newPassword: newPassword // Return new password for admin to view
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to reset password' })
  }
})

// Change employee password (using ID in request body to avoid route conflicts)
router.post('/change-password', async (req, res) => {
  try {
    console.log('[Employee Routes] Change password request received:', { body: { ...req.body, current: '***', next: '***' } })
    const { id, current, next } = req.body

    if (!id || !current || !next) {
      console.log('[Employee Routes] Missing required fields')
      return res.status(400).json({ message: 'Employee ID, current password, and new password are required' })
    }

    console.log('[Employee Routes] Looking up employee:', id)
    const employee = await Employee.findById(id)

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    if (!employee.passwordHash) {
      return res.status(400).json({ message: 'Account not properly set up' })
    }

    // If current password is provided and matches, proceed. If not provided, allow reset.
    let canChange = true
    if (current) {
      const ok = await bcrypt.compare(current, employee.passwordHash)
      if (!ok) {
        canChange = false
      }
    }

    if (!canChange) {
      return res.status(400).json({ message: 'Current password incorrect' })
    }

    const nextHash = await bcrypt.hash(next, 10)
    employee.passwordHash = nextHash
    await employee.save()

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to change password' })
  }
})

// Get single employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }
    console.log('[Employee Get] Fetched employee:', {
      _id: employee._id,
      name: employee.name,
      username: employee.username,
      status: employee.status
    })
    res.json({ success: true, data: { ...employee.toObject(), status: normalizeStatus(employee.status) } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch employee' })
  }
})

// Update employee profile
router.put('/:id', async (req, res) => {
  try {
    const {
      name, email, phone, address, nid, document,
      emergencyContactName, emergencyContact, salary, salesTarget,
      bankName, bankBranch, accountNumber, photo, status,
      postingArea, department, role, designation,
      regionId, areaId, territoryId
    } = req.body
    const employee = await Employee.findById(req.params.id)
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    if (name) employee.name = name
    if (email) employee.email = email
    if (phone) employee.phone = phone
    if (address !== undefined) employee.address = address
    if (nid !== undefined) employee.nid = nid
    if (document !== undefined) employee.document = document
    if (emergencyContactName !== undefined) employee.emergencyContactName = emergencyContactName
    if (emergencyContact !== undefined) employee.emergencyContact = emergencyContact
    if (salary !== undefined) employee.salary = parseFloat(salary) || 0
    if (salesTarget !== undefined) employee.salesTarget = parseFloat(salesTarget) || 0
    if (bankName !== undefined) employee.bankName = bankName
    if (bankBranch !== undefined) employee.bankBranch = bankBranch
    if (accountNumber !== undefined) employee.accountNumber = accountNumber
    if (postingArea !== undefined) employee.postingArea = postingArea
    if (regionId !== undefined) employee.regionId = regionId
    if (areaId !== undefined) employee.areaId = areaId
    if (territoryId !== undefined) employee.territoryId = territoryId
    if (department !== undefined) employee.department = department
    if (role !== undefined) employee.role = role
    if (designation !== undefined) employee.designation = designation
    if (photo !== undefined) employee.photo = photo
    if (status !== undefined) employee.status = status

    await employee.save()
    res.json({ success: true, data: employee })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update employee' })
  }
})

export default router

