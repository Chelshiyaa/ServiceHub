import express from 'express';
import {
  getProviderProfile,
  updateProviderProfile,
  addServiceImages,
  deleteServiceImage,
  changePassword,
} from '../controllers/providerController.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProviderProfile);
router.put('/profile', upload.single('profilePhoto'), updateProviderProfile);
router.post('/services/images', upload.array('images', 10), addServiceImages);
router.delete('/services/images/:id', deleteServiceImage);
router.put('/change-password', changePassword);

export default router;

