import express from 'express'
import { rideController } from '../controllers/rideController.js'
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = express.Router()

router.use(authMiddleware);
router.post('/create-ride', rideController.createRide)
router.get('/get-all-rides', rideController.getAllRides)
router.get('/get-ride/:rideId', rideController.getRideById)

export default router;