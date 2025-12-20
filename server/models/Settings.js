import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    commissionRates: {
        type: [String],
        default: ['7%', '8%', '9%', '10%', '11%']
    },
    salesTargets: [{
        year: Number,
        month: Number,
        amount: Number
    }],
    discountAmount: {
        type: Number,
        default: 0
    },
    discountEnabled: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
