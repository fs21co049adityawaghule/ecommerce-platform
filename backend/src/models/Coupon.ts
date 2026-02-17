import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  type: 'referral' | 'promotional' | 'discount';
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  owner?: mongoose.Types.ObjectId;
  usageCount: number;
  usageLimit?: number;
  usedBy: mongoose.Types.ObjectId[];
  isActive: boolean;
  validFrom: Date;
  validUntil?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['referral', 'promotional', 'discount'],
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  usageLimit: {
    type: Number
  },
  usedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

// Index for quick lookup
couponSchema.index({ code: 1 });
couponSchema.index({ owner: 1, type: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

export default mongoose.model<ICoupon>('Coupon', couponSchema);