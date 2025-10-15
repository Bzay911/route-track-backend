import express from 'express'
import { rideController } from '../controllers/rideController.js'
const router = express.Router()

router.post('/create-ride', rideController.createRide)
router.get('/get-all-rides', rideController.getAllRides)

export default router;