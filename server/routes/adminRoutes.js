import express from 'express'
import bcrypt from 'bcryptjs'
import AdminProfile from '../models/AdminProfile.js'

const router = express.Router()

// Ensure a profile exists
const ensureProfile = async () => {
  let profile = await AdminProfile.findOne({ username: 'admin' })
  if (!profile) {
    const passwordHash = await bcrypt.hash('admin123', 10)
    profile = await AdminProfile.create({ username: 'admin', passwordHash, role: 'Admin' })
  } else {
    // Ensure role is always 'Admin' for admin profile
    if (profile.role !== 'Admin') {
      profile.role = 'Admin'
      await profile.save()
    }
  }
  return profile
}

// GET profile
router.get('/profile', async (req, res) => {
  try {
    const profile = await ensureProfile()
    res.json({
      username: profile.username,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      photo: profile.photo,
      role: 'Admin' // Always return 'Admin' for admin profile
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
})

// GET password placeholder (used only to initialize client password state)
router.get('/password', async (req, res) => {
  try {
    const profile = await ensureProfile()
    res.json({ password: 'admin123', hasHash: !!profile.passwordHash })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch password metadata' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const profile = await ensureProfile()
    if (username !== profile.username) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(password, profile.passwordHash)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    // Ensure profile role is always 'Admin' (fix if it was changed)
    if (profile.role !== 'Admin') {
      profile.role = 'Admin'
      await profile.save()
    }
    // Always return 'Admin' role for admin login, regardless of stored role
    console.log(`[backend] Login successful: User '${username}' with role 'Admin'`)
    res.json({ success: true, role: 'Admin', name: profile.name, photo: profile.photo })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Login failed' })
  }
})

// UPDATE profile
router.put('/profile', async (req, res) => {
  try {
    const { name, email, phone, address, photo, role } = req.body
    const profile = await ensureProfile()
    profile.name = name ?? profile.name
    profile.email = email ?? profile.email
    profile.phone = phone ?? profile.phone
    profile.address = address ?? profile.address
    profile.photo = photo ?? profile.photo
    // Always keep role as 'Admin' for admin profile - don't allow changing it
    profile.role = 'Admin'
    await profile.save()
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update profile' })
  }
})

// CHANGE password
router.post('/change-password', async (req, res) => {
  try {
    const { current, next } = req.body
    const profile = await ensureProfile()
    const ok = await bcrypt.compare(current, profile.passwordHash)
    if (!ok) {
      return res.status(400).json({ message: 'Current password incorrect' })
    }
    const nextHash = await bcrypt.hash(next, 10)
    profile.passwordHash = nextHash
    await profile.save()
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to change password' })
  }
})

export default router

