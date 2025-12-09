import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
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
  expertise: {
    type: String,
    required: true,
    trim: true
  },
  expertiseBn: {
    type: String,
    trim: true
  },
  photo: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: true,
    enum: ['chairman', 'board', 'management']
  },
  stats: {
    network: {
      type: String,
      default: '0'
    },
    projects: {
      type: String,
      default: '0'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Team = mongoose.model('Team', teamSchema)

export default Team

