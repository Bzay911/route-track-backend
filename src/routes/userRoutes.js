import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { userController } from '../controllers/userController.js';

const router = Router();

// Public routes (no authentication required)
router.post('/handleGoogleSignin', userController.handleGoogleSignin);


// Protected routes (authentication required)
// any route defined after this line will go through the authMiddleware
router.use(authMiddleware);
router.get('/validate', userController.validateToken);
router.post('/addRider', userController.inviteRider)

export default router;
