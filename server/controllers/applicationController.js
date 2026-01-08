import Application from '../models/Application.js'
import Career from '../models/Career.js'

// @desc    Submit job application
// @route   POST /api/applications
// @access  Public
export const submitApplication = async (req, res) => {
    try {
        const { jobId, jobTitle, fullName, email, phone, message } = req.body

        // Verify career exists
        const career = await Career.findOne({ jobId })
        if (!career) {
            return res.status(404).json({ success: false, message: 'Job not found' })
        }

        const applicationData = {
            career: career._id,
            jobId,
            jobTitle,
            fullName,
            email,
            phone,
            message,
            cvPath: req.file ? `/${req.file.path}` : ''
        }

        const application = await Application.create(applicationData)
        res.status(201).json({ success: true, data: application })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private/Admin
export const getApplications = async (req, res) => {
    try {
        const { jobId, status } = req.query
        const filter = {}
        if (jobId) filter.jobId = jobId
        if (status) filter.status = status

        const applications = await Application.find(filter)
            .populate('career', 'title titleBn jobId')
            .sort({ createdAt: -1 })

        res.json({ success: true, count: applications.length, data: applications })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Admin
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' })
        }
        res.json({ success: true, data: application })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
export const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id)
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' })
        }
        res.json({ success: true, message: 'Application deleted successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
