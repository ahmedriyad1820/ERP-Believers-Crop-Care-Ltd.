import Career from '../models/Career.js'

// @desc    Get all careers
// @route   GET /api/careers
// @access  Public
export const getCareers = async (req, res) => {
    try {
        const { isActive } = req.query
        const filter = isActive !== undefined ? { isActive: isActive === 'true' } : {}
        const careers = await Career.find(filter).sort({ createdAt: -1 })
        res.json({ success: true, count: careers.length, data: careers })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// @desc    Get single career
// @route   GET /api/careers/:id
// @access  Public
export const getCareer = async (req, res) => {
    try {
        const career = await Career.findById(req.params.id)
        if (!career) {
            return res.status(404).json({ success: false, message: 'Career not found' })
        }
        res.json({ success: true, data: career })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// @desc    Get career by jobId
// @route   GET /api/careers/job/:jobId
// @access  Public
export const getCareerByJobId = async (req, res) => {
    try {
        const career = await Career.findOne({ jobId: req.params.jobId })
        if (!career) {
            return res.status(404).json({ success: false, message: 'Career not found' })
        }
        res.json({ success: true, data: career })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// @desc    Create new career
// @route   POST /api/careers
// @access  Private/Admin
export const createCareer = async (req, res) => {
    try {
        const career = await Career.create(req.body)
        res.status(201).json({ success: true, data: career })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

// @desc    Update career
// @route   PUT /api/careers/:id
// @access  Private/Admin
export const updateCareer = async (req, res) => {
    try {
        const career = await Career.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if (!career) {
            return res.status(404).json({ success: false, message: 'Career not found' })
        }
        res.json({ success: true, data: career })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

// @desc    Delete career
// @route   DELETE /api/careers/:id
// @access  Private/Admin
export const deleteCareer = async (req, res) => {
    try {
        const career = await Career.findByIdAndDelete(req.params.id)
        if (!career) {
            return res.status(404).json({ success: false, message: 'Career not found' })
        }
        res.json({ success: true, message: 'Career deleted successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
