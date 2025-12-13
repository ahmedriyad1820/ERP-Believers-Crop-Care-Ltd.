import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    trim: true
  },
  variants: [{
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
  }],
  price: {
    type: Number,
    default: 0
  },
  priceCategory: {
    type: String,
    enum: ['single', 'per_variant'],
    default: 'single'
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
  genericName: {
    type: String,
    required: true,
    trim: true
  },
  genericNameBn: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  descriptionBn: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Herbicide', 'Fungicide', 'Insecticide', 'Growth Promoter', 'Fertilizer', 'Organic']
  },
  categoryBn: {
    type: String,
    trim: true
  },
  usage: {
    type: String,
    required: true,
    trim: true
  },
  usageBn: {
    type: String,
    trim: true
  },
  benefits: {
    type: String,
    trim: true
  },
  benefitsBn: {
    type: String,
    trim: true
  },
  application: {
    type: String,
    trim: true
  },
  applicationBn: {
    type: String,
    trim: true
  },
  safety: {
    type: String,
    trim: true
  },
  safetyBn: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: '/product-bottle.png'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const Product = mongoose.model('Product', productSchema)

export default Product

