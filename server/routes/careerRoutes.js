import express from 'express'
import {
    getCareers,
    getCareer,
    getCareerByJobId,
    createCareer,
    updateCareer,
    deleteCareer
} from '../controllers/careerController.js'
import { protect, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(getCareers)
    .post(protect, restrictTo('Admin'), createCareer)

router.route('/job/:jobId')
    .get(getCareerByJobId)

router.route('/:id')
    .get(getCareer)
    .put(protect, restrictTo('Admin'), updateCareer)
    .delete(protect, restrictTo('Admin'), deleteCareer)

export default router
