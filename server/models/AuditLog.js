import mongoose from 'mongoose'

const AuditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: false // May be null if action is from unauthenticated user or system
    },
    action: {
        type: String,
        required: true,
        enum: ['LOGIN', 'LOGOUT', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'MFA_SETUP', 'MFA_VERIFY', 'FAILED_LOGIN', 'ACCESS_DENIED']
    },
    resource: {
        type: String, // e.g., 'Employee', 'Order', 'Product'
        required: true
    },
    resourceId: {
        type: String, // ID of the specific resource affected
        required: false
    },
    ip: {
        type: String,
        default: ''
    },
    userAgent: {
        type: String,
        default: ''
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // Flexible object for storing diffs or other info
        default: {}
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'FAILURE'],
        default: 'SUCCESS'
    }
}, {
    timestamps: { createdAt: true, updatedAt: false } // Immutable logs typically only need creation time
})

// Index for faster querying
AuditLogSchema.index({ createdAt: -1 })
AuditLogSchema.index({ action: 1 })
AuditLogSchema.index({ user: 1 })

const AuditLog = mongoose.model('AuditLog', AuditLogSchema)

export default AuditLog
