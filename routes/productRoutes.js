import express from 'express';
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('image'), addProduct);             // Add product
router.get('/', getAllProducts);                                  // Get all
router.get('/:id', getProductById);                               // Get one
router.put('/:id', upload.single('image'), updateProduct);        // Update
router.delete('/:id', deleteProduct);                             // Delete

export default router;
