import mongoose from 'mongoose'

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true, sparse: true, default: '' }, // bcc001, bcc002, etc.
  name: { type: String, required: true },
  email: { type: String, default: '', unique: true, sparse: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  nid: { type: String, default: '' }, // National ID
  document: { type: String, default: '' }, // Document file path/URL (base64)
  emergencyContactName: { type: String, default: '' },
  emergencyContact: { type: String, default: '' }, // Phone or email
  salary: { type: Number, default: 0 },
  salesTarget: { type: Number, default: 0 },
  bankName: { type: String, default: '' },
  bankBranch: { type: String, default: '' },
  accountNumber: { type: String, default: '' },
  department: { type: String, default: '' },
  role: { type: String, enum: ['Admin', 'RSM', 'Incharge', 'SalesMan'], default: '' },
  designation: { type: String, default: '' },
  photo: { type: String, default: '' },
  status: { type: String, default: 'Unpaid' },
  username: { type: String, unique: true, sparse: true, default: '' },
  passwordHash: { type: String, default: '' }
}, { timestamps: true })

// Delete existing model if it exists to force recompilation with new schema
if (mongoose.models.Employee) {
  delete mongoose.models.Employee
}

const Employee = mongoose.model('Employee', EmployeeSchema)

export default Employee

