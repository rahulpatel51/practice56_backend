import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post( upload.single('image'), createCategory);

router.route('/:id')
  .get(getCategory)
  .put( upload.single('image'), updateCategory)
  .delete( deleteCategory);

export default router;
