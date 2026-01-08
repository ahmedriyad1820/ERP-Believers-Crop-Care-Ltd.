import mongoose from 'mongoose'

const careerSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true,
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
  location: {
    type: String,
    required: true,
    trim: true
  },
  locationBn: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  typeBn: {
    type: String,
    trim: true
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  summaryBn: {
    type: String,
    trim: true
  },
  overview: {
    type: String,
    trim: true
  },
  overviewBn: {
    type: String,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  salaryBn: {
    type: String,
    trim: true
  },
  benefits: {
    type: [String],
    default: []
  },
  benefitsBn: {
    type: [String],
    default: []
  },
  responsibilities: {
    type: [String],
    default: []
  },
  responsibilitiesBn: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  descriptionBn: {
    type: String,
    trim: true
  },
  requirements: {
    type: [String],
    default: []
  },
  requirementsBn: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isOpen: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Career = mongoose.model('Career', careerSchema)

export default Career

