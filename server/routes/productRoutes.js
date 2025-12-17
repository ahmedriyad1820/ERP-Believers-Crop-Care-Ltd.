import express from 'express'
import Product from '../models/Product.js'

const router = express.Router()

const clean = (value) => (typeof value === 'string' ? value.trim() : value || '')

// Generate product ID (BP001, BP002, etc.)
const generateProductId = async () => {
  try {
    // Find the last product to get the highest number
    const lastProduct = await Product.findOne({ productId: { $exists: true } })
      .sort({ productId: -1 })
      .exec()
    
    let nextNumber = 1
    if (lastProduct && lastProduct.productId) {
      // Extract number from productId (e.g., "BP001" -> 1)
      const match = lastProduct.productId.match(/BP(\d+)/i)
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1
      }
    }
    
    // Format as BP001, BP002, etc. (3 digits)
    return `BP${String(nextNumber).padStart(3, '0')}`
  } catch (err) {
    console.error('Error generating product ID:', err)
    // Fallback: use timestamp-based ID
    return `BP${String(Date.now()).slice(-3)}`
  }
}

// List all products
router.get('/', async (_req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 })
    res.json({ success: true, data: items })
  } catch (err) {
    console.error('[Product] List error:', err)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const item = await Product.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ success: true, data: item })
  } catch (err) {
    console.error('[Product] Fetch error:', err)
    res.status(500).json({ message: 'Failed to fetch product' })
  }
})

// Create product
router.post('/', async (req, res) => {
  try {
    const {
      productId,
      variants,
      price,
      priceCategory,
      name,
      nameBn,
      genericName,
      genericNameBn,
      description,
      descriptionBn,
      category,
      categoryBn,
      usage,
      usageBn,
      benefits,
      benefitsBn,
      application,
      applicationBn,
      safety,
      safetyBn,
      image,
      isActive,
      hasOffer,
      buyQuantity,
      freeQuantity
    } = req.body

    if (!name || !genericName || !description || !usage || !category) {
      return res.status(400).json({ message: 'Name, generic name, category, description and usage are required' })
    }

    // Generate product ID if not provided
    const finalProductId = productId || await generateProductId()

    // Process variants - ensure they're in correct format
    const processedVariants = Array.isArray(variants) 
      ? variants.filter(v => v && (v.name || v.value)).map(v => ({
          name: clean(v.name || ''),
          value: clean(v.value || ''),
          price: typeof v.price === 'number' ? v.price : (parseFloat(v.price) || 0)
        }))
      : []

    const payload = {
      productId: finalProductId,
      variants: processedVariants,
      price: typeof price === 'number' ? price : (price ? parseFloat(price) : 0),
      priceCategory: priceCategory === 'per_variant' ? 'per_variant' : 'single',
      name: clean(name),
      nameBn: nameBn ? clean(nameBn) : '',
      genericName: clean(genericName),
      genericNameBn: genericNameBn ? clean(genericNameBn) : '',
      description: clean(description),
      descriptionBn: descriptionBn ? clean(descriptionBn) : '',
      category: clean(category),
      categoryBn: categoryBn ? clean(categoryBn) : '',
      usage: clean(usage),
      usageBn: usageBn ? clean(usageBn) : '',
      benefits: benefits ? clean(benefits) : '',
      benefitsBn: benefitsBn ? clean(benefitsBn) : '',
      application: application ? clean(application) : '',
      applicationBn: applicationBn ? clean(applicationBn) : '',
      safety: safety ? clean(safety) : '',
      safetyBn: safetyBn ? clean(safetyBn) : '',
      image: image || '/product-bottle.png',
      isActive: typeof isActive === 'boolean' ? isActive : true,
      hasOffer: typeof hasOffer === 'boolean' ? hasOffer : false,
      buyQuantity: buyQuantity ? (typeof buyQuantity === 'number' ? buyQuantity : parseFloat(buyQuantity) || null) : null,
      freeQuantity: freeQuantity ? (typeof freeQuantity === 'number' ? freeQuantity : parseFloat(freeQuantity) || null) : null
    }

    console.log('[Product Create] Payload being saved:', {
      productId: payload.productId,
      variantsCount: payload.variants.length,
      price: payload.price,
      priceCategory: payload.priceCategory,
      name: payload.name,
      hasNameBn: !!payload.nameBn,
      genericName: payload.genericName,
      hasGenericNameBn: !!payload.genericNameBn,
      category: payload.category,
      hasCategoryBn: !!payload.categoryBn,
      hasDescription: !!payload.description,
      hasDescriptionBn: !!payload.descriptionBn,
      hasUsage: !!payload.usage,
      hasUsageBn: !!payload.usageBn,
      hasBenefits: !!payload.benefits,
      hasBenefitsBn: !!payload.benefitsBn,
      hasApplication: !!payload.application,
      hasApplicationBn: !!payload.applicationBn,
      hasSafety: !!payload.safety,
      hasSafetyBn: !!payload.safetyBn,
      image: payload.image ? '[...image...]' : 'none'
    })

    const created = await Product.create(payload)
    console.log('[Product Create] Product created successfully:', {
      _id: created._id,
      productId: created.productId,
      name: created.name
    })
    res.json({ success: true, data: created })
  } catch (err) {
    console.error('[Product] Create error:', err)
    const errorMessage = err.message || 'Failed to create product'
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
  }
})

// Update product
router.put('/:id', async (req, res) => {
  try {
    const updates = {}
    ;[
      'productId',
      'name',
      'nameBn',
      'genericName',
      'genericNameBn',
      'description',
      'descriptionBn',
      'category',
      'categoryBn',
      'usage',
      'usageBn',
      'benefits',
      'benefitsBn',
      'application',
      'applicationBn',
      'safety',
      'safetyBn',
      'image'
    ].forEach((field) => {
      if (field in req.body) {
        updates[field] = clean(req.body[field])
      }
    })

    // Handle offer fields separately
    if ('hasOffer' in req.body) {
      updates.hasOffer = typeof req.body.hasOffer === 'boolean' ? req.body.hasOffer : false
    }
    if ('buyQuantity' in req.body) {
      updates.buyQuantity = req.body.buyQuantity ? (typeof req.body.buyQuantity === 'number' ? req.body.buyQuantity : parseFloat(req.body.buyQuantity) || null) : null
    }
    if ('freeQuantity' in req.body) {
      updates.freeQuantity = req.body.freeQuantity ? (typeof req.body.freeQuantity === 'number' ? req.body.freeQuantity : parseFloat(req.body.freeQuantity) || null) : null
    }

    // Handle price separately
    if ('price' in req.body) {
      updates.price = typeof req.body.price === 'number' ? req.body.price : (parseFloat(req.body.price) || 0)
    }

    // Handle priceCategory separately
    if ('priceCategory' in req.body) {
      updates.priceCategory = req.body.priceCategory === 'per_variant' ? 'per_variant' : 'single'
    }

    // Handle variants separately
    if ('variants' in req.body) {
      const processedVariants = Array.isArray(req.body.variants)
        ? req.body.variants.filter(v => v && (v.name || v.value)).map(v => ({
            name: clean(v.name || ''),
            value: clean(v.value || ''),
            price: typeof v.price === 'number' ? v.price : (parseFloat(v.price) || 0)
          }))
        : []
      updates.variants = processedVariants
    }

    if ('isActive' in req.body) {
      updates.isActive = !!req.body.isActive
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true })
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ success: true, data: updated })
  } catch (err) {
    console.error('[Product] Update error:', err)
    const errorMessage = err.message || 'Failed to update product'
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
  }
})

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ success: true, data: deleted })
  } catch (err) {
    console.error('[Product] Delete error:', err)
    res.status(500).json({ message: 'Failed to delete product' })
  }
})

export default router


