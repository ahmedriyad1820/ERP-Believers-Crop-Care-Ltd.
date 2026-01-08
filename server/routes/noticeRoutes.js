import express from 'express'
import multer from 'multer'
import path from 'path'
import {
    getNotices,
    getAdminNotices,
    createNotice,
    deleteNotice
} from '../controllers/noticeController.js'
import { protect, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router()

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, 'notice-' + Date.now() + path.extname(file.originalname))
    }
})

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: Images Only!')
    }
}

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }
})

router.route('/')
    .get(getNotices)
    .post(protect, restrictTo('Admin'), upload.single('photo'), createNotice)

router.route('/admin')
    .get(protect, restrictTo('Admin'), getAdminNotices)

router.route('/:id')
    .delete(protect, restrictTo('Admin'), deleteNotice)

export default router
