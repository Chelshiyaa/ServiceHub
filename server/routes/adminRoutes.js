import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProviders,
  getProviderById,
  updateProviderStatus,
  deleteProvider,
  getStats,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/providers', getProviders);
router.get('/providers/:id', getProviderById);
router.put('/provider/status/:id', updateProviderStatus);
router.delete('/providers/:id', deleteProvider);
router.post('/category', createCategory);
router.get('/category', getCategories);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

export default router;

