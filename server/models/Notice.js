import mongoose from 'mongoose'

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  titleBn: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  contentBn: {
    type: String,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    trim: true
  },
  important: {
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

const Notice = mongoose.model('Notice', noticeSchema)

export default Notice

