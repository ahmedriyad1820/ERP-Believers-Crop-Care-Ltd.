import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import Product from '../models/Product.js'
import Team from '../models/Team.js'
import Testimonial from '../models/Testimonial.js'
import Blog from '../models/Blog.js'
import Notice from '../models/Notice.js'
import Career from '../models/Career.js'
import Contact from '../models/Contact.js'

dotenv.config()

const verifyData = async () => {
  try {
    await connectDB()
    console.log('Connected to MongoDB\n')

    // Count documents in each collection
    const productCount = await Product.countDocuments()
    const teamCount = await Team.countDocuments()
    const testimonialCount = await Testimonial.countDocuments()
    const blogCount = await Blog.countDocuments()
    const noticeCount = await Notice.countDocuments()
    const careerCount = await Career.countDocuments()
    const contactCount = await Contact.countDocuments()

    console.log('📊 Database Collection Summary:')
    console.log('================================')
    console.log(`Products:        ${productCount} documents`)
    console.log(`Teams:           ${teamCount} documents`)
    console.log(`Testimonials:    ${testimonialCount} documents`)
    console.log(`Blogs:           ${blogCount} documents`)
    console.log(`Notices:         ${noticeCount} documents`)
    console.log(`Careers:         ${careerCount} documents`)
    console.log(`Contacts:        ${contactCount} documents`)
    console.log('================================\n')

    // Show sample data
    if (productCount > 0) {
      const sampleProduct = await Product.findOne()
      console.log('Sample Product:')
      console.log(`  Name: ${sampleProduct.name}`)
      console.log(`  Category: ${sampleProduct.category}\n`)
    }

    if (teamCount > 0) {
      const sampleTeam = await Team.findOne()
      console.log('Sample Team Member:')
      console.log(`  Name: ${sampleTeam.name}`)
      console.log(`  Role: ${sampleTeam.role}\n`)
    }

    if (testimonialCount > 0) {
      const sampleTestimonial = await Testimonial.findOne()
      console.log('Sample Testimonial:')
      console.log(`  Name: ${sampleTestimonial.name}`)
      console.log(`  Role: ${sampleTestimonial.role}\n`)
    }

    console.log('✅ Verification complete!')
    console.log('\n💡 Note: The "contacts" collection will only have data when users submit the contact form.')
    console.log('   All other collections should have data from the seed script.')

    process.exit(0)
  } catch (error) {
    console.error('Error verifying data:', error)
    process.exit(1)
  }
}

verifyData()

