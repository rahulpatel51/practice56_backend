import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  // ✅ Reference to Category schema
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  description: String,

  price: {
    type: Number,
    required: true,
  },

  originalPrice: Number,
  discountPercent: Number,

  image: {
    type: String, // Store image path
  },

  rating: {
    type: Number,
    default: 0,
  },

  reviews: {
    type: Number,
    default: 0,
  },

  stock: {
    type: Number,
    default: 0,
  },

  isNew: {
    type: Boolean,
    default: false,
  },

  inStock: {
    type: Boolean,
    default: true,
  },
},
{
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

// Virtual field 'id'
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

export default mongoose.model('Product', productSchema);
