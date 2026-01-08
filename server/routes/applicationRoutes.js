import express from 'express'
import multer from 'multer'
import path from 'path'
import {
    submitApplication,
    getApplications,
    updateApplicationStatus,
    deleteApplication
} from '../controllers/applicationController.js'
import { protect, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router()

// Multer configuration for CV uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, 'cv-' + Date.now() + path.extname(file.originalname))
    }
})

function checkFileType(file, cb) {
    const filetypes = /pdf|doc|docx/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = /pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document/.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: PDF or DOC files only!')
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

router.route('/')
    .post(upload.single('cv'), submitApplication)
    .get(protect, restrictTo('Admin'), getApplications)

router.route('/:id')
    .put(protect, restrictTo('Admin'), updateApplicationStatus)
    .delete(protect, restrictTo('Admin'), deleteApplication)

export default router
