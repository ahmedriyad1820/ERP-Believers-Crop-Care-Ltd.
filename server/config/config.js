// Configuration file for MongoDB connection
// If .env file is not available, you can set the connection string here
// For production, always use environment variables

export const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://ahmedriyad1820_db_user:bcc%401892514@bcc.exim7hi.mongodb.net/bcc-erp?retryWrites=true&w=majority'

export const PORT = process.env.PORT || 5000

export const NODE_ENV = process.env.NODE_ENV || 'development'

