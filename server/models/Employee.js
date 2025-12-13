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
  achievedTarget: { type: Number, default: 0 },
  salesHistory: [{
    orderId: { type: String, default: '' },
    orderObjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    dealerName: { type: String, default: '' },
    dealerId: { type: String, default: '' },
    totalAmount: { type: Number, default: 0 },
    approvedAt: { type: Date, default: Date.now },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    approvedByName: { type: String, default: '' }
  }],
  bankName: { type: String, default: '' },
  bankBranch: { type: String, default: '' },
  accountNumber: { type: String, default: '' },
  department: { type: String, default: '' },
  postingArea: { type: String, default: '' },
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

