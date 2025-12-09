import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  categoryBn: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleBn: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  authorBn: {
    type: String,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  excerptBn: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  contentBn: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog

