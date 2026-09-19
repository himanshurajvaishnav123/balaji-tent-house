import { Router } from 'express';
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '../controllers/galleryController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getGallery);
router.post('/', requireAdmin, createGalleryItem);
router.put('/:id', requireAdmin, updateGalleryItem);
router.delete('/:id', requireAdmin, deleteGalleryItem);

export default router;
