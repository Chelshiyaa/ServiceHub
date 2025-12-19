import express from 'express';
import {
  getProviderPublic,
  getProviderProfile,
  updateProviderProfile,
  addServiceImages,
  deleteServiceImage,
  changePassword,
} from '../controllers/providerController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public provider details (for users browsing services)
// IMPORTANT:
// Keep this route public, but restrict it to a Mongo ObjectId so it doesn't
// accidentally catch routes like "/profile" or "/services/images".
router.get('/:id([0-9a-fA-F]{24})', getProviderPublic);

router.use(protect);

router.get('/profile', getProviderProfile);
router.put('/profile', upload.single('profilePhoto'), updateProviderProfile);
router.post('/services/images', upload.array('images', 10), addServiceImages);
router.delete('/services/images/:id', deleteServiceImage);
router.put('/change-password', changePassword);

export default router;

