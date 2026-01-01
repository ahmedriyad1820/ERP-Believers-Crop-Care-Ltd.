import mongoose from 'mongoose'

const DealerSchema = new mongoose.Schema({
  dealerId: { type: String, unique: true, sparse: true, default: '' },
  name: { type: String, required: true },
  shopName: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  photo: { type: String, default: '' }, // base64
  nid: { type: String, default: '' },
  tradeLicense: { type: String, default: '' },
  pesticideLicense: { type: String, default: '' },
  regionId: { type: String, default: '' },
  areaId: { type: String, default: '' },
  territoryId: { type: String, default: '' },
  area: { type: String, default: '' },
  agreement: { type: String, default: '' }, // base64/pdf or image
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
  assignedToName: { type: String, default: '' },
  assignedToId: { type: String, default: '' }
}, { timestamps: true })

// Ensure hot-reload friendly for dev
if (mongoose.models.Dealer) {
  delete mongoose.models.Dealer
}

const Dealer = mongoose.model('Dealer', DealerSchema)

export default Dealer


