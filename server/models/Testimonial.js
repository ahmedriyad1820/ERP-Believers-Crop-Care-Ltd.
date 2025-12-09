import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
    trim: true
  },
  quoteBn: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameBn: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  roleBn: {
    type: String,
    trim: true
  },
  photo: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

const Testimonial = mongoose.model('Testimonial', testimonialSchema)

export default Testimonial

