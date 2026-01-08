import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import { PORT } from './config/config.js'
import contactRoutes from './routes/contactRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import pageImagesRoutes from './routes/pageImagesRoutes.js'
import employeeRoutes from './routes/employeeRoutes.js'
import dealerRoutes from './routes/dealerRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import territoryRoutes from './routes/territoryRoutes.js'
import noticeRoutes from './routes/noticeRoutes.js'
import assetRoutes from './routes/assetRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import careerRoutes from './routes/careerRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'

import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'mongo-sanitize'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

const app = express()

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Middleware
// Enable CORS first to handle preflight and errors correctly
app.use(cors())

// Set security HTTP headers
app.use(helmet())

// Limit requests from same API
const limiter = rateLimit({
  max: 5000, // Increased limit for dev/admin usage
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again later!'
})
app.use('/api', limiter)
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true, limit: '15mb' }))

// Data sanitization against NoSQL query injection
// Note: mongo-sanitize is a function that sanitizes inputs, not an express middleware by default in some versions,
// but usually used as middleware wrapper or manually.
// Checking package: "mongo-sanitize": "^1.1.0" - this package exports a function.
// Using express-mongo-sanitize would be easier as middleware, but let's see if we can use a wrapper.
// Actually commonly used "express-mongo-sanitize" is different.
// "mongo-sanitize" strips keys starting with $.
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body)
  req.query = mongoSanitize(req.query)
  req.params = mongoSanitize(req.params)
  next()
})

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp())

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'BCC ERP API Server is running!' })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/contacts', contactRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/page-images', pageImagesRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/dealers', dealerRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/notices', noticeRoutes)
app.use('/api/assets', assetRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/careers', careerRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/territories', territoryRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await connectDB()
    console.log('MongoDB connected successfully!')

    // Start server after MongoDB connection
    const HOST = process.env.HOST || '0.0.0.0'
    app.listen(PORT, HOST, () => {
      console.log('='.repeat(50))
      console.log(`✅ Server is running on http://${HOST}:${PORT}`)
      console.log(`✅ MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`)
      console.log(`✅ Health check: http://${HOST}:${PORT}/api/health`)
      console.log(`✅ API Base: http://${HOST}:${PORT}/api`)
      console.log('='.repeat(50))
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    console.error('Full error:', error)
    process.exit(1)
  }
}

// Start the server
startServer()
