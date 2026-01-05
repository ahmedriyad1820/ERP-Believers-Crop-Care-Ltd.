import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import Employee from '../models/Employee.js'
import AdminProfile from '../models/AdminProfile.js'

export const protect = async (req, res, next) => {
    try {
        // 1) Getting token and check of it's there
        let token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token) {
            return res.status(401).json({
                message: 'You are not logged in! Please log in to get access.'
            })
        }

        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET || 'bcc-erp-secret-key-change-me')

        // 3) Check if user still exists
        // Check AdminProfile first if role is Admin, otherwise check Employee
        let currentUser
        if (decoded.role === 'Admin') {
            currentUser = await AdminProfile.findById(decoded.id)
            // If not found in AdminProfile (rare case maybe ID collision?), fallback to Employee
            if (!currentUser) {
                currentUser = await Employee.findById(decoded.id)
            }
        } else {
            currentUser = await Employee.findById(decoded.id)
        }

        if (!currentUser) {
            return res.status(401).json({
                message: 'The user belonging to this token does no longer exist.'
            })
        }

        // 4) Check if user changed password after the token was issued
        if (currentUser.passwordChangedAt) {
            const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10)
            if (changedTimestamp > decoded.iat) {
                return res.status(401).json({
                    message: 'User recently changed password! Please log in again.'
                })
            }
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser
        next()
    } catch (err) {
        console.error('Auth Error:', err)
        return res.status(401).json({
            message: 'Invalid or expired token'
        })
    }
}

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['Admin', 'RSM']. role='SalesMan'
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action'
            })
        }
        next()
    }
}
