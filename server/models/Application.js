import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
    career: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Career',
        required: true
    },
    jobId: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    cvPath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps: true
})

const Application = mongoose.model('Application', applicationSchema)

export default Application
