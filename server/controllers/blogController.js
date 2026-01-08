import Blog from '../models/Blog.js'

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 })
        res.json({ success: true, count: blogs.length, data: blogs })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' })
        }
        res.json({ success: true, data: blog })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
    try {
        const blogData = { ...req.body }

        if (req.file) {
            blogData.image = `/${req.file.path}`
        }

        // Parse boolean fields from FormData
        if (blogData.isFeatured !== undefined) {
            blogData.isFeatured = blogData.isFeatured === 'true' || blogData.isFeatured === true
        }
        if (blogData.isActive !== undefined) {
            blogData.isActive = blogData.isActive === 'true' || blogData.isActive === true
        }

        const blog = await Blog.create(blogData)
        res.status(201).json({ success: true, data: blog })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
    try {
        const blogData = { ...req.body }

        if (req.file) {
            blogData.image = `/${req.file.path}`
        }

        // Parse boolean fields from FormData
        if (blogData.isFeatured !== undefined) {
            blogData.isFeatured = blogData.isFeatured === 'true' || blogData.isFeatured === true
        }
        if (blogData.isActive !== undefined) {
            blogData.isActive = blogData.isActive === 'true' || blogData.isActive === true
        }

        const blog = await Blog.findByIdAndUpdate(req.params.id, blogData, {
            new: true,
            runValidators: true
        })
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' })
        }
        res.json({ success: true, data: blog })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id)
        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' })
        }
        res.json({ success: true, message: 'Blog deleted successfully' })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
