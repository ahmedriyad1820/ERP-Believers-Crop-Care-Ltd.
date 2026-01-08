import express from 'express'
import {
    getAssets,
    createAsset,
    updateAsset,
    deleteAsset
} from '../controllers/assetController.js'
import { protect, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(protect, restrictTo('Admin'), getAssets)
    .post(protect, restrictTo('Admin'), createAsset)

router.route('/:id')
    .put(protect, restrictTo('Admin'), updateAsset)
    .delete(protect, restrictTo('Admin'), deleteAsset)

export default router
