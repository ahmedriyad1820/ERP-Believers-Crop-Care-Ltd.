import mongoose from 'mongoose'
import { MONGODB_URI } from './config.js'

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...')
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`✅ Database: ${conn.connection.name}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    })

    return conn
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message)
    const maskedUri = MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
    console.error('Connection URI:', maskedUri)
    console.error('Full error:', error)
    console.error('\n💡 Troubleshooting tips:')
    console.error('   1. Check if MongoDB URI is correct')
    console.error('   2. Verify network connectivity')
    console.error('   3. Check if MongoDB Atlas IP whitelist includes your IP')
    console.error('   4. Verify database credentials\n')
    throw error
  }
}

export default connectDB

