import express from 'express'
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { InviteController } from '../controllers/inviteController.js';

const router = express.Router()

router.use(authMiddleware);
router.post('/invite', InviteController.inviteUser);
router.get('/get-pending-invites', InviteController.getAllInvites);
router.post('/accept/:inviteId', InviteController.acceptInvite);
router.post('/reject/:inviteId', InviteController.rejectInvite);

export default router;