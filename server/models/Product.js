import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    trim: true
  },
  variants: [{
    productCode: { type: String, trim: true },
    packSize: { type: String, trim: true },
    packUnit: { type: String, enum: ['gm', 'kg', 'ml', 'Ltr'], default: 'ml' },
    cartoonSize: { type: Number, default: 1 },
    cartoonUnit: { type: String, enum: ['Packets', 'Bottles', 'Pcs'], default: 'Pcs' },
    price: { type: Number, default: 0 } // This represents Cartoon Price
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
  },
  hasOffer: {
    type: Boolean,
    default: false
  },
  buyQuantity: {
    type: Number,
    default: null
  },
  freeQuantity: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
})

const Product = mongoose.model('Product', productSchema)

export default Product

