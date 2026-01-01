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

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true, limit: '15mb' }))

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
