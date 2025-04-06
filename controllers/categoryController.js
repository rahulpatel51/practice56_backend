import Category from '../models/Category.js';
import { v2 as cloudinary } from 'cloudinary';

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// ✅ Get single category
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// ✅ Create a new category
export const createCategory = async (req, res) => {
  try {
    let imageData = {};

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: '../uploads/',
      });
      imageData = {
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      };
    }

    const category = await Category.create({
      ...req.body,
      ...imageData,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// ✅ Update category
export const updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    let imageData = {};

    if (req.file) {
      if (category.imagePublicId) {
        await cloudinary.uploader.destroy(category.imagePublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ecommerce/categories',
      });

      imageData = {
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      };
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...imageData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// ✅ Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    if (category.imagePublicId) {
      await cloudinary.uploader.destroy(category.imagePublicId);
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
