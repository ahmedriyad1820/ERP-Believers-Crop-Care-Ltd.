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
    name: {
      type: String,
      trim: true
    },
    value: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      default: 0
    }
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
      name: {
        type: String,
        trim: true
      },
      value: {
        type: String,
        trim: true
      },
      price: {
        type: Number,
        default: 0
      }
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
    notes: {
      type: String,
      trim: true,
      default: ''
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

