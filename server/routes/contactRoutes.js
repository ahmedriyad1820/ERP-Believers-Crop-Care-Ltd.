import express from 'express'
import Contact from '../models/Contact.js'

const router = express.Router()

// Create a new contact message
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, district, message } = req.body

    // Validate required fields
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, phone, email, and message are required' 
      })
    }

    const contact = new Contact({
      name,
      phone,
      email,
      district: district || '',
      message
    })

    const savedContact = await contact.save()
    res.status(201).json({ 
      message: 'Contact message submitted successfully',
      data: savedContact 
    })
  } catch (error) {
    console.error('Error creating contact:', error)
    res.status(500).json({ 
      message: 'Error submitting contact message',
      error: error.message 
    })
  }
})

// Get all contact messages (for admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ 
      message: 'Contacts retrieved successfully',
      data: contacts 
    })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    res.status(500).json({ 
      message: 'Error fetching contact messages',
      error: error.message 
    })
  }
})

// Get a single contact message by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' })
    }

    res.json({ 
      message: 'Contact retrieved successfully',
      data: contact 
    })
  } catch (error) {
    console.error('Error fetching contact:', error)
    res.status(500).json({ 
      message: 'Error fetching contact message',
      error: error.message 
    })
  }
})

// Update contact status (for admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be: new, read, or replied' 
      })
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' })
    }

    res.json({ 
      message: 'Contact status updated successfully',
      data: contact 
    })
  } catch (error) {
    console.error('Error updating contact:', error)
    res.status(500).json({ 
      message: 'Error updating contact status',
      error: error.message 
    })
  }
})

// Delete a contact message (for admin)
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' })
    }

    res.json({ 
      message: 'Contact message deleted successfully',
      data: contact 
    })
  } catch (error) {
    console.error('Error deleting contact:', error)
    res.status(500).json({ 
      message: 'Error deleting contact message',
      error: error.message 
    })
  }
})

export default router

