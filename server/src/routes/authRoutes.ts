import { Router } from 'express';
import { login, getMe, logout, updateProfile } from '../controllers/authController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', requireAdmin, getMe);
router.post('/logout', logout);
router.put('/profile', requireAdmin, updateProfile);

export default router;
