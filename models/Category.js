import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity must be positive'],
    default: 0,
  },
  image: {
    type: {
      url: { type: String, required: true },
      filename: { type: String },
      mimetype: { type: String },
    },
  },
  imagePublicId: {
    type: String,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Automatically update `updatedAt` before save
categorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// ✅ Convert _id to id and remove __v and _id
categorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

// ✅ Export model
const Category = mongoose.model('Category', categorySchema);
export default Category;
