import { Router } from 'express';
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', createEnquiry);
router.get('/', requireAdmin, getEnquiries);
router.patch('/:id/status', requireAdmin, updateEnquiryStatus);
router.delete('/:id', requireAdmin, deleteEnquiry);

export default router;
