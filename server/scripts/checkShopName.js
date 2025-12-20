import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import Dealer from '../models/Dealer.js'

dotenv.config()

const checkDealers = async () => {
    try {
        await connectDB()
        const dealers = await Dealer.find({}, { name: 1, shopName: 1, dealerId: 1 }).limit(10)
        console.log('Dealers in database:')
        dealers.forEach(d => {
            console.log(`- ID: ${d.dealerId}, Name: ${d.name}, Shop Name: ${d.shopName || '(EMPTY)'}`)
        })
        process.exit(0)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

checkDealers()
