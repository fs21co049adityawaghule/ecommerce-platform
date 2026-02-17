import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  colors: {
    name: string;
    hex: string;
    images?: string[];
  }[];
  sizes: string[];
  inventory: {
    color?: string;
    size?: string;
    quantity: number;
    sku: string;
  }[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  isNew: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  isActive: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['electronics', 'fashion', 'home', 'sports', 'books', 'beauty', 'toys', 'other']
  },
  subcategory: {
    type: String
  },
  tags: [{
    type: String
  }],
  colors: [{
    name: { type: String, required: true },
    hex: { type: String, required: true },
    images: [{ type: String }]
  }],
  sizes: [{
    type: String
  }],
  inventory: [{
    color: String,
    size: String,
    quantity: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true, unique: true }
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  weight: {
    type: Number
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  seoTitle: {
    type: String,
    maxlength: [70, 'SEO title cannot exceed 70 characters']
  },
  seoDescription: {
    type: String,
    maxlength: [160, 'SEO description cannot exceed 160 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isTrending: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isNew: 1, isActive: 1 });
productSchema.index({ slug: 1 });

// Pre-save hook to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  }
  next();
});

export default mongoose.model<IProduct>('Product', productSchema);