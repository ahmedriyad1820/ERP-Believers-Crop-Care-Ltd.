import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
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

