import mongoose from 'mongoose'

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    variant: {
        productCode: { type: String, required: true },
        packSize: { type: Number, required: true },
        packUnit: { type: String, default: 'ml' },
        cartoonSize: { type: Number, default: 1 },
        cartoonUnit: { type: String, default: 'Pcs' },
        price: { type: Number, required: true }
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    minStockLevel: {
        type: Number,
        default: 10,
        min: 0
    },
    notes: {
        type: String,
        default: ''
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Update lastUpdated on save
inventorySchema.pre('save', function (next) {
    this.lastUpdated = new Date()
    next()
})

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function () {
    if (this.quantity === 0) return 'Out of Stock'
    if (this.quantity <= this.minStockLevel) return 'Low Stock'
    return 'In Stock'
})

// Ensure virtuals are included in JSON
inventorySchema.set('toJSON', { virtuals: true })
inventorySchema.set('toObject', { virtuals: true })

export default mongoose.model('Inventory', inventorySchema)
