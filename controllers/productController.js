import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Add new product
export const addProduct = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      price,
      originalPrice,
      discountPercent,
      rating,
      reviews,
      stock,
      isNew,
      inStock
    } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // ✅ Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const newProduct = new Product({
      title,
      category,
      description,
      price,
      originalPrice,
      discountPercent,
      image,
      rating,
      reviews,
      stock,
      isNew,
      inStock
    });

    const saved = await newProduct.save();
    res.status(201).json({ success: true, product: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category') // ✅ Include category details
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updatedData = req.body;

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    // ✅ If category is being updated, validate it
    if (updatedData.category) {
      const validCategory = await Category.findById(updatedData.category);
      if (!validCategory) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true }).populate('category');

    if (!updated) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
