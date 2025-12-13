import express from 'express'
import Dealer from '../models/Dealer.js'
import Employee from '../models/Employee.js'

const router = express.Router()

const generateDealerId = async () => {
  const last = await Dealer.find().sort({ createdAt: -1 }).limit(1)
  if (!last.length || !last[0].dealerId) return 'D001'
  const lastNum = parseInt(String(last[0].dealerId).replace(/^D/i, ''), 10)
  const next = isNaN(lastNum) ? 1 : lastNum + 1
  return `D${String(next).padStart(3, '0')}`
}

// List dealers
router.get('/', async (_req, res) => {
  try {
    const dealers = await Dealer.find().sort({ createdAt: -1 })
    res.json({ success: true, data: dealers })
  } catch (err) {
    console.error('[Dealer] List error:', err)
    res.status(500).json({ message: 'Failed to fetch dealers' })
  }
})

// Get dealer by id
router.get('/:id', async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id)
    if (!dealer) return res.status(404).json({ message: 'Dealer not found' })
    res.json({ success: true, data: dealer })
  } catch (err) {
    console.error('[Dealer] Get error:', err)
    res.status(500).json({ message: 'Failed to fetch dealer' })
  }
})

const resolveAssigned = async (assignedTo, assignedToName, assignedToId) => {
  if (!assignedTo) {
    return {
      assignedTo: null,
      assignedToName: assignedToName || '',
      assignedToId: assignedToId || ''
    }
  }
  try {
    const emp = await Employee.findById(assignedTo)
    if (!emp) {
      return {
        assignedTo: null,
        assignedToName: assignedToName || '',
        assignedToId: assignedToId || ''
      }
    }
    return {
      assignedTo: emp._id,
      assignedToName: emp.name || assignedToName || '',
      assignedToId: emp.employeeId || assignedToId || ''
    }
  } catch (err) {
    console.error('[Dealer] resolveAssigned error', err)
    return {
      assignedTo: null,
      assignedToName: assignedToName || '',
      assignedToId: assignedToId || ''
    }
  }
}

// Create dealer
router.post('/', async (req, res) => {
  try {
    const {
      dealerId,
      name,
      phone,
      email,
      address,
      photo,
      nid,
      tradeLicense,
      pesticideLicense,
      area,
      agreement,
      assignedTo,
      assignedToName,
      assignedToId
    } = req.body

    if (!name) return res.status(400).json({ message: 'Name is required' })

    const finalDealerId = dealerId && dealerId.trim() ? dealerId.trim() : await generateDealerId()

    const assigned = await resolveAssigned(assignedTo, assignedToName, assignedToId)

    const created = await Dealer.create({
      dealerId: finalDealerId,
      name,
      phone: phone || '',
      email: email || '',
      address: address || '',
      photo: photo || '',
      nid: nid || '',
      tradeLicense: tradeLicense || '',
      pesticideLicense: pesticideLicense || '',
      area: area || '',
      agreement: agreement || '',
      assignedTo: assigned.assignedTo,
      assignedToName: assigned.assignedToName,
      assignedToId: assigned.assignedToId
    })

    res.json({ success: true, data: created })
  } catch (err) {
    console.error('[Dealer] Create error:', err)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Dealer ID already exists' })
    }
    res.status(500).json({ message: 'Failed to create dealer' })
  }
})

// Update dealer
router.put('/:id', async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id)
    if (!dealer) return res.status(404).json({ message: 'Dealer not found' })

    const fields = ['dealerId','name','phone','email','address','photo','nid','tradeLicense','pesticideLicense','area','agreement']
    fields.forEach((f) => {
      if (req.body[f] !== undefined) dealer[f] = req.body[f]
    })

    if (req.body.assignedTo !== undefined || req.body.assignedToName !== undefined || req.body.assignedToId !== undefined) {
      const assigned = await resolveAssigned(req.body.assignedTo, req.body.assignedToName, req.body.assignedToId)
      dealer.assignedTo = assigned.assignedTo
      dealer.assignedToName = assigned.assignedToName
      dealer.assignedToId = assigned.assignedToId
    }

    await dealer.save()
    res.json({ success: true, data: dealer })
  } catch (err) {
    console.error('[Dealer] Update error:', err)
    res.status(500).json({ message: 'Failed to update dealer' })
  }
})

// Delete dealer
router.delete('/:id', async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id)
    if (!dealer) return res.status(404).json({ message: 'Dealer not found' })
    await dealer.deleteOne()
    res.json({ success: true })
  } catch (err) {
    console.error('[Dealer] Delete error:', err)
    res.status(500).json({ message: 'Failed to delete dealer' })
  }
})

export default router


