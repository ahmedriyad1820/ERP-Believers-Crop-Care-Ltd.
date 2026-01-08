import Notice from '../models/Notice.js'

// @desc    Get all active notices
// @route   GET /api/notices
// @access  Public
export const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find({ isActive: true }).sort({ date: -1 })
        res.json(notices)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get all notices (admin view)
// @route   GET /api/notices/admin
// @access  Private/Admin
export const getAdminNotices = async (req, res) => {
    try {
        const notices = await Notice.find({}).sort({ date: -1 })
        res.json(notices)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private/Admin
export const createNotice = async (req, res) => {
    try {
        const { title, date, content, important } = req.body

        let photo = ''
        if (req.file) {
            photo = `/${req.file.path}`
        } else if (req.body.photoUrl) {
            photo = req.body.photoUrl
        }

        const notice = new Notice({
            title,
            date,
            content,
            important: important === 'true' || important === true,
            photo,
            isActive: true
        })

        const createdNotice = await notice.save()
        res.status(201).json(createdNotice)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
export const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id)

        if (notice) {
            await notice.deleteOne()
            res.json({ message: 'Notice removed' })
        } else {
            res.status(404).json({ message: 'Notice not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
