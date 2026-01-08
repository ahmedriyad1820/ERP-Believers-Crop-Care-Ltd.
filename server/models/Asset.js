import mongoose from 'mongoose'

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    purchaseDate: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    purchaseShop: {
        type: String,
        trim: true
    },
    value: {
        type: Number,
        required: true,
        default: 0
    },
    paid: {
        type: Number,
        default: 0
    },
    due: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Damaged', 'Lost', 'Sold'],
        default: 'Active'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

const Asset = mongoose.model('Asset', assetSchema)

export default Asset
