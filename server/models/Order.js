import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    trim: true
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Approved'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  requestedByName: {
    type: String,
    trim: true,
    default: ''
  },
  requestedByRole: {
    type: String,
    trim: true,
    default: ''
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',
    required: true
  },
  dealerName: {
    type: String,
    required: true,
    trim: true
  },
  dealerId: {
    type: String,
    trim: true,
    default: ''
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productId: {
    type: String,
    trim: true
  },
  variant: {
    productCode: { type: String, trim: true },
    packSize: { type: String, trim: true },
    packUnit: { type: String, trim: true, default: 'ml' },
    cartoonSize: { type: Number, default: 1 },
    cartoonUnit: { type: String, default: 'Pcs' },
    price: { type: Number, default: 0 }
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  discountEnabled: {
    type: Boolean,
    default: false
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    default: 0
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    productName: {
      type: String,
      trim: true
    },
    productId: {
      type: String,
      trim: true
    },
    variant: {
      productCode: { type: String, trim: true },
      packSize: { type: String, trim: true },
      packUnit: { type: String, trim: true, default: 'ml' },
      cartoonSize: { type: Number, default: 1 },
      cartoonUnit: { type: String, default: 'Pcs' },
      price: { type: Number, default: 0 }
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1
    },
    unitPrice: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  }],
  commission: {
    type: String,
    default: ''
  },
  paymentHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      default: 0
    },
    commission: {
      type: Number,
      default: 0
    },
    due: {
      type: Number,
      default: 0
    }
  }],
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Complete', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
})

// Ensure hot-reload friendly for dev
if (mongoose.models.Order) {
  delete mongoose.models.Order
}

const Order = mongoose.model('Order', orderSchema)

export default Order

