import mongoose from 'mongoose'

const PageImagesSchema = new mongoose.Schema({
  key: { type: String, default: 'pageImages', unique: true },
  data: { type: Object, default: {} }
}, { timestamps: true })

const PageImages = mongoose.model('PageImages', PageImagesSchema)

export default PageImages

