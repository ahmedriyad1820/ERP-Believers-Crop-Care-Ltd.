import mongoose from 'mongoose'

const AdminProfileSchema = new mongoose.Schema({
  username: { type: String, default: 'admin', unique: true },
  name: { type: String, default: 'Admin' },
  email: { type: String, default: 'admin@example.com' },
  phone: { type: String, default: '+880 1234 567890' },
  address: { type: String, default: 'Dhaka, Bangladesh' },
  photo: { type: String, default: '' },
  designation: { type: String, default: '' },
  role: { type: String, enum: ['Admin', 'RSM', 'Incharge', 'Sales'], default: 'Admin' },
  passwordHash: { type: String, required: true }
}, { timestamps: true })

const AdminProfile = mongoose.model('AdminProfile', AdminProfileSchema)

export default AdminProfile

