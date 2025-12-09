import express from 'express'
import PageImages from '../models/PageImages.js'

const router = express.Router()

const defaultData = {}

const ensureDoc = async () => {
  let doc = await PageImages.findOne({ key: 'pageImages' })
  if (!doc) {
    doc = await PageImages.create({ key: 'pageImages', data: defaultData })
  }
  return doc
}

router.get('/', async (req, res) => {
  try {
    const doc = await ensureDoc()
    res.json({ data: doc.data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch images' })
  }
})

router.put('/', async (req, res) => {
  try {
    const { data } = req.body
    const doc = await ensureDoc()
    doc.data = data || {}
    await doc.save()
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to save images' })
  }
})

export default router

