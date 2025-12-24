import express from 'express'
import Inventory from '../models/Inventory.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'

const router = express.Router()

// Get all inventory records
// Get all inventory records with required quantity from orders
router.get('/', async (req, res) => {
    try {
        const inventory = await Inventory.find()
            .populate('product', 'name image')
            .sort({ lastUpdated: -1 })
            .lean()

        // Aggregate active orders to calculate required quantities (Pending/Processing/Shipped)
        const requiredQuantities = await Order.aggregate([
            {
                $match: {
                    approvalStatus: 'Approved',
                    status: { $in: ['Processing', 'Shipped'] }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: {
                        product: '$items.product',
                        variant: '$items.variant.productCode'
                    },
                    totalRequired: { $sum: '$items.quantity' }
                }
            }
        ])

        // Aggregate delivered quantities (Total Sold)
        const deliveredQuantities = await Order.aggregate([
            {
                $match: {
                    status: 'Delivered'
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: {
                        product: '$items.product',
                        variant: '$items.variant.productCode'
                    },
                    totalDelivered: { $sum: '$items.quantity' }
                }
            }
        ])

        // Map quantities to inventory items
        const inventoryWithRequired = inventory.map(item => {
            // Find Required
            const reqQty = requiredQuantities.find(r => {
                const prodMatch = r._id.product?.toString() === item.product?._id?.toString()
                const itemVarCode = item.variant?.productCode
                const reqVarCode = r._id.variant
                const varMatch = (itemVarCode && reqVarCode)
                    ? itemVarCode === reqVarCode
                    : (!itemVarCode && !reqVarCode)
                return prodMatch && varMatch
            })

            // Find Delivered
            const delQty = deliveredQuantities.find(r => {
                const prodMatch = r._id.product?.toString() === item.product?._id?.toString()
                const itemVarCode = item.variant?.productCode
                const reqVarCode = r._id.variant
                const varMatch = (itemVarCode && reqVarCode)
                    ? itemVarCode === reqVarCode
                    : (!itemVarCode && !reqVarCode)
                return prodMatch && varMatch
            })

            return {
                ...item,
                requiredQuantity: reqQty ? reqQty.totalRequired : 0,
                deliveredQuantity: delQty ? delQty.totalDelivered : 0
            }
        })

        res.json({ success: true, data: inventoryWithRequired })
    } catch (error) {
        console.error('Error fetching inventory:', error)
        res.status(500).json({ message: 'Error fetching inventory', error: error.message })
    }
})

// Get single inventory record
router.get('/:id', async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id)
            .populate('product', 'name image')

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory record not found' })
        }

        res.json({ success: true, data: inventory })
    } catch (error) {
        console.error('Error fetching inventory record:', error)
        res.status(500).json({ message: 'Error fetching inventory record', error: error.message })
    }
})

// Create new inventory record
router.post('/', async (req, res) => {
    try {
        const { product, variant, quantity, minStockLevel, notes } = req.body

        // Validate product exists
        const productExists = await Product.findById(product)
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Check if inventory record already exists for this product-variant combination
        const existingInventory = await Inventory.findOne({
            product,
            'variant.productCode': variant.productCode
        })

        if (existingInventory) {
            existingInventory.quantity += Number(quantity)
            if (minStockLevel !== undefined) existingInventory.minStockLevel = minStockLevel
            if (notes) existingInventory.notes = notes

            await existingInventory.save()

            const populatedInventory = await Inventory.findById(existingInventory._id)
                .populate('product', 'name image')

            return res.status(200).json({ success: true, data: populatedInventory })
        }

        const inventory = new Inventory({
            product,
            variant,
            quantity,
            minStockLevel: minStockLevel || 10,
            notes: notes || ''
        })

        await inventory.save()

        const populatedInventory = await Inventory.findById(inventory._id)
            .populate('product', 'name image')

        res.status(201).json({ success: true, data: populatedInventory })
    } catch (error) {
        console.error('Error creating inventory record:', error)
        res.status(500).json({ message: 'Error creating inventory record', error: error.message })
    }
})

// Update inventory record
router.put('/:id', async (req, res) => {
    try {
        const { quantity, minStockLevel, notes } = req.body

        const inventory = await Inventory.findById(req.params.id)

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory record not found' })
        }

        // Update fields
        if (quantity !== undefined) inventory.quantity = quantity
        if (minStockLevel !== undefined) inventory.minStockLevel = minStockLevel
        if (notes !== undefined) inventory.notes = notes

        await inventory.save()

        const updatedInventory = await Inventory.findById(inventory._id)
            .populate('product', 'name image')

        res.json({ success: true, data: updatedInventory })
    } catch (error) {
        console.error('Error updating inventory record:', error)
        res.status(500).json({ message: 'Error updating inventory record', error: error.message })
    }
})

// Delete inventory record
router.delete('/:id', async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id)

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory record not found' })
        }

        await Inventory.findByIdAndDelete(req.params.id)

        res.json({ success: true, message: 'Inventory record deleted successfully' })
    } catch (error) {
        console.error('Error deleting inventory record:', error)
        res.status(500).json({ message: 'Error deleting inventory record', error: error.message })
    }
})

export default router
